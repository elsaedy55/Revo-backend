const db = require('../config/database');

/**
 * نموذج السجل الطبي
 * يحتوي على جميع العمليات المتعلقة بالسجلات الطبية في قاعدة البيانات
 */
class MedicalHistory {
    /**
     * إنشاء سجل طبي جديد
     * @param {Object} medicalRecord - بيانات السجل الطبي
     * @returns {Promise<Object>} السجل الطبي المنشأ
     */
    static async create(medicalRecord) {
        const query = `
            INSERT INTO medical_history (
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
            ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)
            RETURNING *
        `;

        const values = [
            medicalRecord.phone_number,
            medicalRecord.date_of_birth,
            medicalRecord.address,
            medicalRecord.has_diseases,
            JSON.stringify(medicalRecord.diseases || []),
            JSON.stringify(medicalRecord.disease_start_dates || []),
            medicalRecord.takes_medications,
            JSON.stringify(medicalRecord.medications || []),
            JSON.stringify(medicalRecord.medication_start_dates || []),
            medicalRecord.had_surgeries,
            JSON.stringify(medicalRecord.surgeries || []),
            JSON.stringify(medicalRecord.surgery_dates || [])
        ];

        try {
            const result = await db.query(query, values);
            return result.rows[0];
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
            return result.rows[0];
        } catch (error) {
            throw new Error(`خطأ في البحث عن السجل الطبي: ${error.message}`);
        }
    }

    /**
     * تحديث سجل طبي
     * @param {string} id - معرف السجل الطبي
     * @param {Object} medicalRecord - البيانات المحدثة
     * @returns {Promise<Object>} السجل الطبي المحدث
     */
    static async update(id, medicalRecord) {
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
            medicalRecord.phone_number,
            medicalRecord.date_of_birth,
            medicalRecord.address,
            medicalRecord.has_diseases,
            JSON.stringify(medicalRecord.diseases || []),
            JSON.stringify(medicalRecord.disease_start_dates || []),
            medicalRecord.takes_medications,
            JSON.stringify(medicalRecord.medications || []),
            JSON.stringify(medicalRecord.medication_start_dates || []),
            medicalRecord.had_surgeries,
            JSON.stringify(medicalRecord.surgeries || []),
            JSON.stringify(medicalRecord.surgery_dates || []),
            id
        ];

        try {
            const result = await db.query(query, values);
            return result.rows[0];
        } catch (error) {
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
            return result.rows[0];
        } catch (error) {
            throw new Error(`خطأ في حذف السجل الطبي: ${error.message}`);
        }
    }
}

module.exports = MedicalHistory;