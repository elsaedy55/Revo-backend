import { validationResult } from 'express-validator';
import MedicalHistory from '../models/medicalHistory.model.js';

// إنشاء سجل طبي جديد
export const createMedicalHistory = async (req, res) => {
    try {
        // التحقق من صحة البيانات المدخلة
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ 
                نجاح: false, 
                أخطاء: errors.array().map(err => ({ 
                    حقل: err.param, 
                    رسالة: err.msg 
                }))
            });
        }

        // إنشاء كائن جديد من التاريخ الطبي
        console.log('Creating medical history for user:', req.userId);
        const medicalHistoryData = {
            user_id: req.userId,
            ...req.body
        };

        const medicalHistory = new MedicalHistory(medicalHistoryData);
        const newRecord = await medicalHistory.create();

        res.status(201).json({
            نجاح: true,
            رسالة: 'تم حفظ السجل الطبي بنجاح',
            بيانات: newRecord
        });

    } catch (error) {
        res.status(500).json({
            نجاح: false,
            رسالة: 'حدث خطأ أثناء حفظ السجل الطبي',
            خطأ: error.message
        });
    }
};

// عرض السجل الطبي للمستخدم
export const getUserMedicalHistory = async (req, res) => {
    try {
        console.log('Getting medical history for user:', req.userId);
        const records = await MedicalHistory.findByUserId(req.userId);
        
        res.json({
            نجاح: true,
            بيانات: records
        });

    } catch (error) {
        res.status(500).json({
            نجاح: false,
            رسالة: 'حدث خطأ أثناء جلب السجل الطبي',
            خطأ: error.message
        });
    }
};

// تحديث السجل الطبي
export const updateMedicalHistory = async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ 
                نجاح: false, 
                أخطاء: errors.array().map(err => ({ 
                    حقل: err.param, 
                    رسالة: err.msg 
                }))
            });
        }

        console.log('Updating medical history for user:', req.userId);
        const medicalHistoryData = {
            user_id: req.userId,
            ...req.body
        };

        const medicalHistory = new MedicalHistory(medicalHistoryData);
        const updatedRecord = await medicalHistory.update(req.params.id);

        if (!updatedRecord) {
            return res.status(404).json({
                نجاح: false,
                رسالة: 'لم يتم العثور على السجل الطبي'
            });
        }

        res.json({
            نجاح: true,
            رسالة: 'تم تحديث السجل الطبي بنجاح',
            بيانات: updatedRecord
        });

    } catch (error) {
        res.status(500).json({
            نجاح: false,
            رسالة: 'حدث خطأ أثناء تحديث السجل الطبي',
            خطأ: error.message
        });
    }
};