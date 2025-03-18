import express from 'express';
import { verifyToken } from '../middleware/authJwt.js';
import { validateMedicalHistory, validateId } from '../middleware/medicalHistory.validator.js';
import medicalHistoryController from '../controllers/medicalHistory.controller.js';
import MedicalHistory from '../models/medicalHistory.model.js';

const router = express.Router();

// وسيط للتحقق من ملكية السجل الطبي
const verifyMedicalHistoryOwnership = async (req, res, next) => {
    try {
        const medicalRecord = await MedicalHistory.findById(req.params.id);
        
        // التحقق من وجود السجل
        if (!medicalRecord) {
            return res.status(404).json({
                success: false,
                message: 'لم يتم العثور على السجل الطبي'
            });
        }
        
        // التحقق من ملكية السجل
        if (medicalRecord.user_id !== req.userId) {
            return res.status(403).json({
                success: false,
                message: 'ليس لديك صلاحية الوصول لهذا السجل الطبي'
            });
        }
        
        next();
    } catch (error) {
        console.error('خطأ في التحقق من ملكية السجل:', error);
        res.status(500).json({
            success: false,
            message: 'حدث خطأ أثناء التحقق من صلاحية الوصول'
        });
    }
};

// تكوين المسارات كما هي مع إضافة وسيط التحقق من الملكية
router.post(
    '/',
    [verifyToken, validateMedicalHistory],
    medicalHistoryController.create.bind(medicalHistoryController)
);

router.get(
    '/:id',
    [verifyToken, validateId, verifyMedicalHistoryOwnership],
    medicalHistoryController.getById.bind(medicalHistoryController)
);

router.get(
    '/',
    [verifyToken],
    medicalHistoryController.getAllByUser.bind(medicalHistoryController)
);

router.put(
    '/:id',
    [verifyToken, validateId, verifyMedicalHistoryOwnership, validateMedicalHistory],
    medicalHistoryController.update.bind(medicalHistoryController)
);

router.delete(
    '/:id',
    [verifyToken, validateId, verifyMedicalHistoryOwnership],
    medicalHistoryController.delete.bind(medicalHistoryController)
);

export default router;