import { pool } from '../config/database.js';

class MedicalHistory {
    constructor(data) {
        this.user_id = data.user_id;
        this.condition_name = data.condition_name;
        this.diagnosis_date = data.diagnosis_date;
        this.treatment_description = data.treatment_description;
        this.medications = data.medications;
        this.surgery_history = data.surgery_history;
        this.allergies = data.allergies;
        this.chronic_diseases = data.chronic_diseases;
        this.notes = data.notes;
    }

    async create() {
        const query = `
            INSERT INTO medical_history 
            (user_id, condition_name, diagnosis_date, treatment_description, 
             medications, surgery_history, allergies, chronic_diseases, notes)
            VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
            RETURNING *
        `;
        
        const values = [
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

        try {
            const result = await pool.query(query, values);
            return result.rows[0];
        } catch (error) {
            throw new Error(`خطأ في إنشاء السجل الطبي: ${error.message}`);
        }
    }

    static async findByUserId(userId) {
        const query = 'SELECT * FROM medical_history WHERE user_id = $1';
        try {
            const result = await pool.query(query, [userId]);
            return result.rows;
        } catch (error) {
            throw new Error(`خطأ في جلب السجل الطبي: ${error.message}`);
        }
    }

    async update(id) {
        const query = `
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
        `;

        const values = [
            this.condition_name,
            this.diagnosis_date,
            this.treatment_description,
            this.medications,
            this.surgery_history,
            this.allergies,
            this.chronic_diseases,
            this.notes,
            id,
            this.user_id
        ];

        try {
            const result = await pool.query(query, values);
            return result.rows[0];
        } catch (error) {
            throw new Error(`خطأ في تحديث السجل الطبي: ${error.message}`);
        }
    }
}

export default MedicalHistory;