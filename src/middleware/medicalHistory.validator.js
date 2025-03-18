import { body, param } from 'express-validator';
import { validate } from './validation.middleware.js';

/**
 * رسائل الخطأ المستخدمة في التحقق من صحة البيانات
 */
const ERROR_MESSAGES = {
    REQUIRED: (field) => `حقل ${field} مطلوب`,
    INVALID_PHONE: 'رقم الهاتف غير صالح',
    INVALID_DATE: 'التاريخ غير صالح',
    INVALID_BOOLEAN: 'يجب أن تكون القيمة صحيحة أو خاطئة',
    INVALID_ARRAY: 'يجب أن تكون قائمة صحيحة',
    INVALID_DISEASE_OBJECT: 'كل مرض يجب أن يحتوي على اسم المرض (name) وتاريخ بدايته (startDate)',
    INVALID_MEDICATION_OBJECT: 'كل دواء يجب أن يحتوي على اسم الدواء (name) وتاريخ بدء تناوله (startDate)',
    INVALID_SURGERY_OBJECT: 'كل عملية يجب أن تحتوي على اسم العملية (name) وتاريخ إجرائها (date)',
    INVALID_ID: 'معرف السجل الطبي غير صالح'
};

/**
 * التحقق من صحة التاريخ
 */
const isValidDate = (date) => {
    if (!date) return true; // السماح بقيمة فارغة
    const d = new Date(date);
    return !isNaN(d.getTime());
};

/**
 * التحقق من صحة كائن المرض
 */
const validateDiseaseObject = value => {
    if (!value) return true; // السماح بقيمة فارغة
    if (!Array.isArray(value)) {
        throw new Error(ERROR_MESSAGES.INVALID_ARRAY);
    }
    
    value.forEach(disease => {
        if (disease && (disease.name || disease.startDate)) {
            if (!isValidDate(disease.startDate)) {
                throw new Error(ERROR_MESSAGES.INVALID_DATE);
            }
        }
    });
    return true;
};

/**
 * التحقق من صحة كائن الدواء
 */
const validateMedicationObject = value => {
    if (!value) return true; // السماح بقيمة فارغة
    if (!Array.isArray(value)) {
        throw new Error(ERROR_MESSAGES.INVALID_ARRAY);
    }
    
    value.forEach(medication => {
        if (medication && (medication.name || medication.startDate)) {
            if (!isValidDate(medication.startDate)) {
                throw new Error(ERROR_MESSAGES.INVALID_DATE);
            }
        }
    });
    return true;
};

/**
 * التحقق من صحة كائن العملية الجراحية
 */
const validateSurgeryObject = value => {
    if (!value) return true; // السماح بقيمة فارغة
    if (!Array.isArray(value)) {
        throw new Error(ERROR_MESSAGES.INVALID_ARRAY);
    }
    
    value.forEach(surgery => {
        if (surgery && (surgery.name || surgery.date)) {
            if (!isValidDate(surgery.date)) {
                throw new Error(ERROR_MESSAGES.INVALID_DATE);
            }
        }
    });
    return true;
};

/**
 * التحقق من صحة بيانات السجل الطبي
 */
export const validateMedicalHistory = [
    // التحقق من رقم الهاتف
    body('phone_number')
        .notEmpty().withMessage(ERROR_MESSAGES.REQUIRED('رقم الهاتف'))
        .matches(/^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/)
        .withMessage(ERROR_MESSAGES.INVALID_PHONE),
    
    // التحقق من تاريخ الميلاد
    body('date_of_birth')
        .notEmpty().withMessage(ERROR_MESSAGES.REQUIRED('تاريخ الميلاد'))
        .isDate().withMessage(ERROR_MESSAGES.INVALID_DATE),
    
    // التحقق من العنوان
    body('address')
        .notEmpty().withMessage(ERROR_MESSAGES.REQUIRED('العنوان'))
        .trim(),
    
    // التحقق من وجود أمراض (إجباري)
    body('has_diseases')
        .notEmpty().withMessage(ERROR_MESSAGES.REQUIRED('وجود أمراض'))
        .isBoolean().withMessage(ERROR_MESSAGES.INVALID_BOOLEAN),
    
    // التحقق من قائمة الأمراض (اختياري، لكن إجباري إذا كان has_diseases = true)
    body('diseases')
        .if(body('has_diseases').equals('true'))
        .notEmpty().withMessage(ERROR_MESSAGES.REQUIRED('قائمة الأمراض'))
        .custom(validateDiseaseObject),
    
    // التحقق من الأدوية (إجباري)
    body('takes_medications')
        .notEmpty().withMessage(ERROR_MESSAGES.REQUIRED('تناول الأدوية'))
        .isBoolean().withMessage(ERROR_MESSAGES.INVALID_BOOLEAN),
    
    // التحقق من قائمة الأدوية (اختياري، لكن إجباري إذا كان takes_medications = true)
    body('medications')
        .if(body('takes_medications').equals('true'))
        .notEmpty().withMessage(ERROR_MESSAGES.REQUIRED('قائمة الأدوية'))
        .custom(validateMedicationObject),
    
    // التحقق من العمليات الجراحية (إجباري)
    body('had_surgeries')
        .notEmpty().withMessage(ERROR_MESSAGES.REQUIRED('العمليات الجراحية'))
        .isBoolean().withMessage(ERROR_MESSAGES.INVALID_BOOLEAN),
    
    // التحقق من قائمة العمليات (اختياري، لكن إجباري إذا كان had_surgeries = true)
    body('surgeries')
        .if(body('had_surgeries').equals('true'))
        .notEmpty().withMessage(ERROR_MESSAGES.REQUIRED('قائمة العمليات الجراحية'))
        .custom(validateSurgeryObject),

    // تطبيق التحقق
    validate
];

/**
 * التحقق من صحة معرف السجل الطبي
 */
export const validateId = [
    param('id').isNumeric().withMessage(ERROR_MESSAGES.INVALID_ID),
    validate
];