ALTER TABLE medical_history 
ADD COLUMN IF NOT EXISTS disease_start_dates JSONB DEFAULT '[]'::jsonb,
ADD COLUMN IF NOT EXISTS medication_start_dates JSONB DEFAULT '[]'::jsonb,
ADD COLUMN IF NOT EXISTS surgery_dates JSONB DEFAULT '[]'::jsonb;