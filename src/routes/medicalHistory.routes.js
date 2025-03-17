import express from 'express';
import { verifyToken } from '../middleware/authJwt.js';
import { validateMedicalHistory, validateId } from '../middleware/medicalHistory.validator.js';
import * as medicalHistoryController from '../controllers/medicalHistory.controller.js';

const router = express.Router();

// Route constants
const ROUTES = {
    BASE: '/',
    BY_ID: '/:id'
};

/**
 * Medical History Routes
 * Base path: /api/medical-history
 */

/**
 * @route POST /api/medical-history
 * @description إنشاء سجل طبي جديد للمستخدم المصادق عليه
 * @access خاص - يتطلب توكن المصادقة
 * @middleware
 *   - verifyToken: التحقق من تسجيل دخول المستخدم
 *   - validateMedicalHistory: التحقق من صحة البيانات المدخلة
 * @body
 *   - condition_name: اسم الحالة المرضية (مطلوب)
 *   - diagnosis_date: تاريخ التشخيص (اختياري)
 *   - treatment_description: وصف العلاج (اختياري)
 *   - medications: الأدوية (اختياري)
 *   - surgery_history: تاريخ العمليات الجراحية (اختياري)
 *   - allergies: الحساسية (اختياري)
 *   - chronic_diseases: الأمراض المزمنة (اختياري)
 *   - notes: ملاحظات إضافية (اختياري)
 */
router.post(
    ROUTES.BASE,
    [verifyToken, validateMedicalHistory],
    medicalHistoryController.createMedicalHistory
);

/**
 * @route GET /api/medical-history
 * @description الحصول على جميع السجلات الطبية للمستخدم المصادق عليه
 * @access خاص - يتطلب توكن المصادقة
 * @middleware
 *   - verifyToken: التحقق من تسجيل دخول المستخدم
 */
router.get(
    ROUTES.BASE,
    verifyToken,
    medicalHistoryController.getUserMedicalHistory
);

/**
 * @route GET /api/medical-history/:id
 * @description الحصول على سجل طبي محدد للمستخدم المصادق عليه
 * @access خاص - يتطلب توكن المصادقة
 * @params
 *   - id: معرف السجل الطبي المراد الحصول عليه
 * @middleware
 *   - verifyToken: التحقق من تسجيل دخول المستخدم
 *   - validateId: التحقق من صحة معرف السجل الطبي
 */
router.get(
    ROUTES.BY_ID,
    [verifyToken, validateId],
    medicalHistoryController.getById
);

/**
 * @route PUT /api/medical-history/:id
 * @description تحديث سجل طبي محدد للمستخدم المصادق عليه
 * @access خاص - يتطلب توكن المصادقة
 * @params
 *   - id: معرف السجل الطبي المراد تحديثه
 * @middleware
 *   - verifyToken: التحقق من تسجيل دخول المستخدم
 *   - validateMedicalHistory: التحقق من صحة البيانات المدخلة
 * @body
 *   - نفس حقول إنشاء السجل الطبي
 */
router.put(
    ROUTES.BY_ID,
    [verifyToken, validateId, validateMedicalHistory],
    medicalHistoryController.updateMedicalHistory
);

/**
 * @route DELETE /api/medical-history/:id
 * @description حذف سجل طبي محدد للمستخدم المصادق عليه
 * @access خاص - يتطلب توكن المصادقة
 * @params
 *   - id: معرف السجل الطبي المراد حذفه
 * @middleware
 *   - verifyToken: التحقق من تسجيل دخول المستخدم
 *   - validateId: التحقق من صحة معرف السجل الطبي
 */
router.delete(
    ROUTES.BY_ID,
    [verifyToken, validateId],
    medicalHistoryController.deleteMedicalHistory
);

export default router;