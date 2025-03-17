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
    ARRAY_LENGTH_MISMATCH: 'عدد التواريخ يجب أن يتطابق مع عدد العناصر',
    INVALID_ID: 'معرف السجل الطبي غير صالح'
};

/**
 * التحقق من تطابق طول المصفوفتين
 */
const validateArraysLength = (array1, array2) => {
    if (!Array.isArray(array1) || !Array.isArray(array2)) {
        return false;
    }
    return array1.length === array2.length;
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
    
    // التحقق من وجود أمراض
    body('has_diseases')
        .isBoolean().withMessage(ERROR_MESSAGES.INVALID_BOOLEAN),
    
    // التحقق من قائمة الأمراض وتواريخها
    body('diseases')
        .if(body('has_diseases').equals('true'))
        .isArray().withMessage(ERROR_MESSAGES.INVALID_ARRAY),
    
    body('disease_start_dates')
        .if(body('has_diseases').equals('true'))
        .isArray().withMessage(ERROR_MESSAGES.INVALID_ARRAY)
        .custom((value, { req }) => {
            if (!validateArraysLength(req.body.diseases, value)) {
                throw new Error(ERROR_MESSAGES.ARRAY_LENGTH_MISMATCH);
            }
            return true;
        }),
    
    // التحقق من الأدوية
    body('takes_medications')
        .isBoolean().withMessage(ERROR_MESSAGES.INVALID_BOOLEAN),
    
    body('medications')
        .if(body('takes_medications').equals('true'))
        .isArray().withMessage(ERROR_MESSAGES.INVALID_ARRAY),
    
    body('medication_start_dates')
        .if(body('takes_medications').equals('true'))
        .isArray().withMessage(ERROR_MESSAGES.INVALID_ARRAY)
        .custom((value, { req }) => {
            if (!validateArraysLength(req.body.medications, value)) {
                throw new Error(ERROR_MESSAGES.ARRAY_LENGTH_MISMATCH);
            }
            return true;
        }),
    
    // التحقق من العمليات الجراحية
    body('had_surgeries')
        .isBoolean().withMessage(ERROR_MESSAGES.INVALID_BOOLEAN),
    
    body('surgeries')
        .if(body('had_surgeries').equals('true'))
        .isArray().withMessage(ERROR_MESSAGES.INVALID_ARRAY),
    
    body('surgery_dates')
        .if(body('had_surgeries').equals('true'))
        .isArray().withMessage(ERROR_MESSAGES.INVALID_ARRAY)
        .custom((value, { req }) => {
            if (!validateArraysLength(req.body.surgeries, value)) {
                throw new Error(ERROR_MESSAGES.ARRAY_LENGTH_MISMATCH);
            }
            return true;
        }),

    // تطبيق التحقق
    validate
];

/**
 * التحقق من صحة معرف السجل الطبي
 */
export const validateId = [
    param('id').isUUID().withMessage(ERROR_MESSAGES.INVALID_ID),
    validate
];