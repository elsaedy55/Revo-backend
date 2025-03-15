const { pool } = require('../config/database.js');

const SQL_QUERIES = {
    CREATE: `
        INSERT INTO medical_history 
        (user_id, condition_name, diagnosis_date, treatment_description, 
         medications, surgery_history, allergies, chronic_diseases, notes)
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
        RETURNING *
    `,
    FIND_BY_USER: 'SELECT * FROM medical_history WHERE user_id = $1',
    UPDATE: `
        UPDATE medical_history
        SET condition_name = $1,
            diagnosis_date = $2,
            treatment_description = $3,
            medications = $4,
            surgery_history = $5,
            allergies = $6,
            chronic_diseases = $7,
            notes = $8,
            updated_at = CURRENT_TIMESTAMP
        WHERE id = $9 AND user_id = $10
        RETURNING *
    `
};

class DatabaseError extends Error {
    constructor(operation, error) {
        super(`خطأ في ${operation}: ${error.message}`);
        this.name = 'DatabaseError';
        this.originalError = error;
    }
}

class MedicalHistory {
    constructor(data) {
        this.validateData(data);
        this.initializeFields(data);
    }

    validateData(data) {
        if (!data.user_id) {
            throw new Error('معرف المستخدم مطلوب');
        }
        
        if (!data.condition_name) {
            throw new Error('اسم الحالة مطلوب');
        }

        if (data.diagnosis_date && !this.isValidDate(data.diagnosis_date)) {
            throw new Error('تاريخ التشخيص غير صالح');
        }
    }

    isValidDate(dateString) {
        const date = new Date(dateString);
        return date instanceof Date && !isNaN(date);
    }

    initializeFields(data) {
        this.user_id = data.user_id;
        this.condition_name = this.sanitizeField(data.condition_name);
        this.diagnosis_date = data.diagnosis_date;
        this.treatment_description = this.sanitizeField(data.treatment_description);
        this.medications = this.sanitizeField(data.medications);
        this.surgery_history = this.sanitizeField(data.surgery_history);
        this.allergies = this.sanitizeField(data.allergies);
        this.chronic_diseases = this.sanitizeField(data.chronic_diseases);
        this.notes = this.sanitizeField(data.notes);
    }

    sanitizeField(value) {
        if (!value) return null;
        // Remove any potentially harmful characters or HTML tags
        return value.toString().replace(/<[^>]*>/g, '');
    }

    getValues() {
        return [
            this.user_id,
            this.condition_name,
            this.diagnosis_date,
            this.treatment_description,
            this.medications,
            this.surgery_history,
            this.allergies,
            this.chronic_diseases,
            this.notes
        ];
    }

    async create() {
        try {
            const result = await pool.query(SQL_QUERIES.CREATE, this.getValues());
            return result.rows[0];
        } catch (error) {
            throw new DatabaseError('إنشاء السجل الطبي', error);
        }
    }

    static async findByUserId(userId) {
        if (!userId) {
            throw new Error('معرف المستخدم مطلوب للبحث');
        }

        try {
            const result = await pool.query(SQL_QUERIES.FIND_BY_USER, [userId]);
            return result.rows;
        } catch (error) {
            throw new DatabaseError('جلب السجل الطبي', error);
        }
    }

    async update(id) {
        if (!id) {
            throw new Error('معرف السجل الطبي مطلوب للتحديث');
        }

        try {
            const values = [...this.getValues(), id, this.user_id];
            const result = await pool.query(SQL_QUERIES.UPDATE, values);
            return result.rows[0];
        } catch (error) {
            throw new DatabaseError('تحديث السجل الطبي', error);
        }
    }
}

module.exports = MedicalHistory;