import express from 'express';
import { verifyToken } from '../middleware/authJwt.js';
import { validateMedicalHistory } from '../middleware/medicalHistory.validator.js';
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
    [verifyToken, validateMedicalHistory],
    medicalHistoryController.updateMedicalHistory
);

export default router;