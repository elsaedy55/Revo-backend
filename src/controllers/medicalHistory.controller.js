import MedicalHistory from '../models/medicalHistory.model.js';
import jwt from 'jsonwebtoken';
import { authConfig } from '../config/auth.config.js';

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
            // استخراج اسم المستخدم من التوكن
            const token = req.headers.authorization.split(' ')[1];
            const decoded = jwt.verify(token, authConfig.jwt.secret);
            const userName = decoded.name;

            // التحقق من وجود البيانات الإجبارية
            const requiredFields = [
                'phone_number', 
                'date_of_birth', 
                'address',
                'has_diseases',
                'takes_medications',
                'had_surgeries'
            ];

            for (const field of requiredFields) {
                if (req.body[field] === undefined || req.body[field] === '') {
                    return res.status(400).json({
                        success: false,
                        message: `حقل ${field} مطلوب`
                    });
                }
            }

            // التحقق من البيانات المرتبطة
            if (req.body.has_diseases && (!req.body.diseases || !req.body.diseases.length)) {
                return res.status(400).json({
                    success: false,
                    message: 'يجب إضافة قائمة الأمراض عند اختيار وجود أمراض'
                });
            }

            if (req.body.takes_medications && (!req.body.medications || !req.body.medications.length)) {
                return res.status(400).json({
                    success: false,
                    message: 'يجب إضافة قائمة الأدوية عند اختيار تناول الأدوية'
                });
            }

            if (req.body.had_surgeries && (!req.body.surgeries || !req.body.surgeries.length)) {
                return res.status(400).json({
                    success: false,
                    message: 'يجب إضافة قائمة العمليات الجراحية عند اختيار وجود عمليات'
                });
            }

            // إضافة معرف المستخدم واسمه من التوكن
            const medicalRecordData = {
                ...req.body,
                user_id: req.userId,
                name: userName
            };

            const medicalRecord = await MedicalHistory.create(medicalRecordData);
            
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
     * جلب جميع السجلات الطبية للمستخدم
     */
    async getAllByUser(req, res) {
        try {
            const medicalRecords = await MedicalHistory.findByUserId(req.userId);
            
            res.json({
                success: true,
                data: medicalRecords
            });
        } catch (error) {
            console.error('خطأ في جلب السجلات الطبية:', error);
            res.status(500).json({
                success: false,
                message: 'حدث خطأ أثناء استرجاع السجلات الطبية',
                error: error.message
            });
        }
    }

    /**
     * تحديث سجل طبي
     */
    async update(req, res) {
        try {
            console.log(`[🔄 UPDATE] Attempting to update medical history ID: ${req.params.id}`);
            console.log(`[👤 USER] User ID from token: ${req.userId}`);
            console.log('[📝 DATA] Request body:', JSON.stringify(req.body, null, 2));

            // التحقق من وجود البيانات الإجبارية
            const requiredFields = [
                'phone_number', 
                'date_of_birth', 
                'address',
                'has_diseases',
                'takes_medications',
                'had_surgeries'
            ];

            for (const field of requiredFields) {
                if (req.body[field] === undefined || req.body[field] === '') {
                    console.log(`[❌ VALIDATION] Missing required field: ${field}`);
                    return res.status(400).json({
                        success: false,
                        message: `حقل ${field} مطلوب`
                    });
                }
            }

            // التحقق من البيانات المرتبطة
            if (req.body.has_diseases && (!req.body.diseases || !req.body.diseases.length)) {
                console.log('[❌ VALIDATION] Missing diseases data while has_diseases is true');
                return res.status(400).json({
                    success: false,
                    message: 'يجب إضافة قائمة الأمراض عند اختيار وجود أمراض'
                });
            }

            if (req.body.takes_medications && (!req.body.medications || !req.body.medications.length)) {
                console.log('[❌ VALIDATION] Missing medications data while takes_medications is true');
                return res.status(400).json({
                    success: false,
                    message: 'يجب إضافة قائمة الأدوية عند اختيار تناول الأدوية'
                });
            }

            if (req.body.had_surgeries && (!req.body.surgeries || !req.body.surgeries.length)) {
                console.log('[❌ VALIDATION] Missing surgeries data while had_surgeries is true');
                return res.status(400).json({
                    success: false,
                    message: 'يجب إضافة قائمة العمليات الجراحية عند اختيار وجود عمليات'
                });
            }

            console.log('[🔄 DB] Executing update query...');
            const medicalRecord = await MedicalHistory.update(req.params.id, req.body);
            
            if (!medicalRecord) {
                console.log('[❌ DB] No medical record found with ID:', req.params.id);
                return res.status(404).json({
                    success: false,
                    message: 'لم يتم العثور على السجل الطبي'
                });
            }

            console.log('[✅ SUCCESS] Successfully updated medical record:', medicalRecord.id);
            res.json({
                success: true,
                message: 'تم تحديث السجل الطبي بنجاح',
                data: medicalRecord
            });
        } catch (error) {
            console.error('[❌ ERROR] Error updating medical record:', error);
            console.error('[📚 STACK]', error.stack);
            res.status(500).json({
                success: false,
                message: 'حدث خطأ أثناء تحديث السجل الطبي',
                error: error.message,
                details: process.env.NODE_ENV === 'development' ? {
                    path: req.path,
                    method: req.method,
                    params: req.params,
                    query: req.query,
                    body: req.body,
                    userId: req.userId,
                    stack: error.stack
                } : undefined
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