-- تحديث هيكل جدول medical_history
ALTER TABLE medical_history
DROP COLUMN IF EXISTS condition_name,
DROP COLUMN IF EXISTS diagnosis_date,
DROP COLUMN IF EXISTS treatment_description,
DROP COLUMN IF EXISTS medications,
DROP COLUMN IF EXISTS surgery_history,
DROP COLUMN IF EXISTS allergies,
DROP COLUMN IF EXISTS chronic_diseases,
DROP COLUMN IF EXISTS notes;