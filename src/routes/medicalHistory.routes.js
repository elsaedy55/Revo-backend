import express from 'express';
import { verifyToken } from '../middleware/authJwt.js';
import { validateMedicalHistory, validateId } from '../middleware/medicalHistory.validator.js';
import medicalHistoryController from '../controllers/medicalHistory.controller.js';

const router = express.Router();

/**
 * @route POST /api/medical-history
 * @description إنشاء سجل طبي جديد للمستخدم المصادق عليه
 * @access خاص - يتطلب توكن المصادقة
 */
router.post(
    '/',
    [verifyToken, validateMedicalHistory],
    medicalHistoryController.create.bind(medicalHistoryController)
);

/**
 * @route GET /api/medical-history/:id
 * @description الحصول على سجل طبي محدد للمستخدم المصادق عليه
 * @access خاص - يتطلب توكن المصادقة
 */
router.get(
    '/:id',
    [verifyToken, validateId],
    medicalHistoryController.getById.bind(medicalHistoryController)
);

/**
 * @route PUT /api/medical-history/:id
 * @description تحديث سجل طبي محدد للمستخدم المصادق عليه
 * @access خاص - يتطلب توكن المصادقة
 */
router.put(
    '/:id',
    [verifyToken, validateId, validateMedicalHistory],
    medicalHistoryController.update.bind(medicalHistoryController)
);

/**
 * @route DELETE /api/medical-history/:id
 * @description حذف سجل طبي محدد للمستخدم المصادق عليه
 * @access خاص - يتطلب توكن المصادقة
 */
router.delete(
    '/:id',
    [verifyToken, validateId],
    medicalHistoryController.delete.bind(medicalHistoryController)
);

export default router;