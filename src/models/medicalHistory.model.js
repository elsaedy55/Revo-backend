import db from '../config/database.js';

/**
 * نموذج السجل الطبي
 * يحتوي على جميع العمليات المتعلقة بالسجلات الطبية في قاعدة البيانات
 */
class MedicalHistory {
    /**
     * تنسيق البيانات المسترجعة من قاعدة البيانات
     * @param {Object} record - السجل الطبي من قاعدة البيانات
     * @returns {Object} السجل الطبي منسق
     */
    static formatRecord(record) {
        if (!record) return null;

        if (!record.name) {
            throw new Error('اسم المستخدم مطلوب');
        }

        // تنسيق الأمراض مع تواريخها
        const diseases = record.diseases ? record.diseases.map((disease, index) => ({
            name: disease || null,
            startDate: record.disease_start_dates?.[index] || null
        })) : [];

        // تنسيق الأدوية مع تواريخها
        const medications = record.medications ? record.medications.map((medication, index) => ({
            name: medication || null,
            startDate: record.medication_start_dates?.[index] || null
        })) : [];

        // تنسيق العمليات مع تواريخها
        const surgeries = record.surgeries ? record.surgeries.map((surgery, index) => ({
            name: surgery || null,
            date: record.surgery_dates?.[index] || null
        })) : [];

        return {
            id: record.id,
            user_id: record.user_id,
            name: record.name, // لا نسمح بـ null
            phone_number: record.phone_number || null,
            date_of_birth: record.date_of_birth || null,
            address: record.address || null,
            has_diseases: record.has_diseases || false,
            diseases,
            takes_medications: record.takes_medications || false,
            medications,
            had_surgeries: record.had_surgeries || false,
            surgeries,
            created_at: record.created_at,
            updated_at: record.updated_at
        };
    }

    /**
     * تحويل البيانات المنسقة إلى صيغة قاعدة البيانات
     * @param {Object} data - البيانات المنسقة
     * @returns {Object} البيانات بصيغة قاعدة البيانات
     */
    static prepareForDatabase(data) {
        if (!data.name) {
            throw new Error('اسم المستخدم مطلوب');
        }

        const diseases = data.diseases?.map(d => d?.name || null) || [];
        const disease_start_dates = data.diseases?.map(d => d?.startDate || null) || [];
        
        const medications = data.medications?.map(m => m?.name || null) || [];
        const medication_start_dates = data.medications?.map(m => m?.startDate || null) || [];
        
        const surgeries = data.surgeries?.map(s => s?.name || null) || [];
        const surgery_dates = data.surgeries?.map(s => s?.date || null) || [];

        return {
            ...data,
            name: data.name, // لا نسمح بـ null
            phone_number: data.phone_number || null,
            date_of_birth: data.date_of_birth || null,
            address: data.address || null,
            has_diseases: data.has_diseases || false,
            diseases,
            disease_start_dates,
            takes_medications: data.takes_medications || false,
            medications,
            medication_start_dates,
            had_surgeries: data.had_surgeries || false,
            surgeries,
            surgery_dates
        };
    }

    /**
     * إنشاء سجل طبي جديد
     * @param {Object} medicalRecord - بيانات السجل الطبي
     * @returns {Promise<Object>} السجل الطبي المنشأ
     */
    static async create(medicalRecord) {
        const preparedData = this.prepareForDatabase(medicalRecord);
        const query = `
            INSERT INTO medical_history (
                user_id,
                name,
                phone_number, 
                date_of_birth, 
                address,
                has_diseases, 
                diseases, 
                disease_start_dates,
                takes_medications, 
                medications, 
                medication_start_dates,
                had_surgeries, 
                surgeries,
                surgery_dates
            ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14)
            RETURNING *
        `;

        const values = [
            preparedData.user_id,
            preparedData.name,
            preparedData.phone_number,
            preparedData.date_of_birth,
            preparedData.address,
            preparedData.has_diseases,
            JSON.stringify(preparedData.diseases),
            JSON.stringify(preparedData.disease_start_dates),
            preparedData.takes_medications,
            JSON.stringify(preparedData.medications),
            JSON.stringify(preparedData.medication_start_dates),
            preparedData.had_surgeries,
            JSON.stringify(preparedData.surgeries),
            JSON.stringify(preparedData.surgery_dates)
        ];

        try {
            const result = await db.query(query, values);
            return this.formatRecord(result.rows[0]);
        } catch (error) {
            throw new Error(`خطأ في إنشاء السجل الطبي: ${error.message}`);
        }
    }

    /**
     * البحث عن سجل طبي بواسطة المعرف
     * @param {string} id - معرف السجل الطبي
     * @returns {Promise<Object>} السجل الطبي
     */
    static async findById(id) {
        try {
            const query = 'SELECT * FROM medical_history WHERE id = $1';
            const result = await db.query(query, [id]);
            return this.formatRecord(result.rows[0]);
        } catch (error) {
            throw new Error(`خطأ في البحث عن السجل الطبي: ${error.message}`);
        }
    }

    /**
     * البحث عن جميع السجلات الطبية لمستخدم معين
     * @param {string} userId - معرف المستخدم
     * @returns {Promise<Array>} مصفوفة من السجلات الطبية
     */
    static async findByUserId(userId) {
        try {
            const query = 'SELECT * FROM medical_history WHERE user_id = $1 ORDER BY created_at DESC';
            const result = await db.query(query, [userId]);
            return result.rows.map(record => this.formatRecord(record));
        } catch (error) {
            throw new Error(`خطأ في البحث عن السجلات الطبية: ${error.message}`);
        }
    }

    /**
     * تحديث سجل طبي
     * @param {string} id - معرف السجل الطبي
     * @param {Object} medicalRecord - البيانات المحدثة
     * @returns {Promise<Object>} السجل الطبي المحدث
     */
    static async update(id, medicalRecord) {
        try {
            // التحقق من وجود السجل أولاً
            const existingRecord = await this.findById(id);
            if (!existingRecord) {
                console.log(`[❌ DB] Medical record with ID ${id} not found`);
                return null;
            }

            const preparedData = this.prepareForDatabase(medicalRecord);
            const query = `
                UPDATE medical_history SET
                    phone_number = $1,
                    date_of_birth = $2,
                    address = $3,
                    has_diseases = $4,
                    diseases = $5,
                    disease_start_dates = $6,
                    takes_medications = $7,
                    medications = $8,
                    medication_start_dates = $9,
                    had_surgeries = $10,
                    surgeries = $11,
                    surgery_dates = $12,
                    updated_at = CURRENT_TIMESTAMP
                WHERE id = $13
                RETURNING *
            `;

            const values = [
                preparedData.phone_number,
                preparedData.date_of_birth,
                preparedData.address,
                preparedData.has_diseases,
                JSON.stringify(preparedData.diseases),
                JSON.stringify(preparedData.disease_start_dates),
                preparedData.takes_medications,
                JSON.stringify(preparedData.medications),
                JSON.stringify(preparedData.medication_start_dates),
                preparedData.had_surgeries,
                JSON.stringify(preparedData.surgeries),
                JSON.stringify(preparedData.surgery_dates),
                id
            ];

            console.log('[🔄 DB] Executing update query with values:', {
                id,
                phone_number: preparedData.phone_number,
                date_of_birth: preparedData.date_of_birth,
                // ... لا نطبع البيانات الحساسة في السجلات
            });

            const result = await db.query(query, values);
            if (result.rows.length === 0) {
                console.log(`[❌ DB] Update failed for medical record ID ${id}`);
                return null;
            }

            console.log(`[✅ DB] Successfully updated medical record ID ${id}`);
            return this.formatRecord(result.rows[0]);
        } catch (error) {
            console.error('[❌ DB] Error updating medical record:', error);
            throw new Error(`خطأ في تحديث السجل الطبي: ${error.message}`);
        }
    }

    /**
     * حذف سجل طبي
     * @param {string} id - معرف السجل الطبي
     * @returns {Promise<Object>} السجل الطبي المحذوف
     */
    static async delete(id) {
        try {
            const query = 'DELETE FROM medical_history WHERE id = $1 RETURNING *';
            const result = await db.query(query, [id]);
            return this.formatRecord(result.rows[0]);
        } catch (error) {
            throw new Error(`خطأ في حذف السجل الطبي: ${error.message}`);
        }
    }
}

export default MedicalHistory;