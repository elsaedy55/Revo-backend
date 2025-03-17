import MedicalHistory from '../models/medicalHistory.model.js';

/**
 * وحدة التحكم في السجلات الطبية
 * تحتوي على جميع المنطق الخاص بمعالجة طلبات السجلات الطبية
 */
class MedicalHistoryController {
    /**
     * إنشاء سجل طبي جديد
     */
    async create(req, res) {
        try {
            // التحقق من وجود البيانات المطلوبة
            const requiredFields = ['phone_number', 'date_of_birth', 'address'];
            for (const field of requiredFields) {
                if (!req.body[field]) {
                    return res.status(400).json({
                        success: false,
                        message: `حقل ${field} مطلوب`
                    });
                }
            }

            const medicalRecord = await MedicalHistory.create(req.body);
            
            res.status(201).json({
                success: true,
                message: 'تم إنشاء السجل الطبي بنجاح',
                data: medicalRecord
            });
        } catch (error) {
            console.error('خطأ في إنشاء السجل الطبي:', error);
            res.status(500).json({
                success: false,
                message: 'حدث خطأ أثناء إنشاء السجل الطبي',
                error: error.message
            });
        }
    }

    /**
     * جلب سجل طبي بواسطة المعرف
     */
    async getById(req, res) {
        try {
            const medicalRecord = await MedicalHistory.findById(req.params.id);
            
            if (!medicalRecord) {
                return res.status(404).json({
                    success: false,
                    message: 'لم يتم العثور على السجل الطبي'
                });
            }

            res.json({
                success: true,
                data: medicalRecord
            });
        } catch (error) {
            console.error('خطأ في جلب السجل الطبي:', error);
            res.status(500).json({
                success: false,
                message: 'حدث خطأ أثناء استرجاع السجل الطبي',
                error: error.message
            });
        }
    }

    /**
     * تحديث سجل طبي
     */
    async update(req, res) {
        try {
            // التحقق من وجود البيانات المطلوبة
            const requiredFields = ['phone_number', 'date_of_birth', 'address'];
            for (const field of requiredFields) {
                if (!req.body[field]) {
                    return res.status(400).json({
                        success: false,
                        message: `حقل ${field} مطلوب`
                    });
                }
            }

            const medicalRecord = await MedicalHistory.update(req.params.id, req.body);
            
            if (!medicalRecord) {
                return res.status(404).json({
                    success: false,
                    message: 'لم يتم العثور على السجل الطبي'
                });
            }

            res.json({
                success: true,
                message: 'تم تحديث السجل الطبي بنجاح',
                data: medicalRecord
            });
        } catch (error) {
            console.error('خطأ في تحديث السجل الطبي:', error);
            res.status(500).json({
                success: false,
                message: 'حدث خطأ أثناء تحديث السجل الطبي',
                error: error.message
            });
        }
    }

    /**
     * حذف سجل طبي
     */
    async delete(req, res) {
        try {
            const medicalRecord = await MedicalHistory.delete(req.params.id);
            
            if (!medicalRecord) {
                return res.status(404).json({
                    success: false,
                    message: 'لم يتم العثور على السجل الطبي'
                });
            }

            res.json({
                success: true,
                message: 'تم حذف السجل الطبي بنجاح',
                data: medicalRecord
            });
        } catch (error) {
            console.error('خطأ في حذف السجل الطبي:', error);
            res.status(500).json({
                success: false,
                message: 'حدث خطأ أثناء حذف السجل الطبي',
                error: error.message
            });
        }
    }
}

export default new MedicalHistoryController();