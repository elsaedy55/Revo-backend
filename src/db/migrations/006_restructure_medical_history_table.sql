-- إعادة هيكلة جدول medical_history
DROP TABLE IF EXISTS medical_history;

CREATE TABLE medical_history (
    id SERIAL PRIMARY KEY,
    user_id VARCHAR(255) NOT NULL,
    phone_number VARCHAR(20) NOT NULL,
    date_of_birth DATE NOT NULL,
    address TEXT NOT NULL,
    has_diseases BOOLEAN DEFAULT FALSE,
    diseases JSONB DEFAULT '[]'::jsonb,
    disease_start_dates JSONB DEFAULT '[]'::jsonb,
    takes_medications BOOLEAN DEFAULT FALSE,
    medications JSONB DEFAULT '[]'::jsonb,
    medication_start_dates JSONB DEFAULT '[]'::jsonb,
    had_surgeries BOOLEAN DEFAULT FALSE,
    surgeries JSONB DEFAULT '[]'::jsonb,
    surgery_dates JSONB DEFAULT '[]'::jsonb,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- إضافة تعليق على الجدول
COMMENT ON TABLE medical_history IS 'جدول يحتوي على السجلات الطبية للمستخدمين';

-- إضافة تعليقات على الأعمدة
COMMENT ON COLUMN medical_history.user_id IS 'معرف المستخدم من Firebase';
COMMENT ON COLUMN medical_history.phone_number IS 'رقم هاتف المريض';
COMMENT ON COLUMN medical_history.date_of_birth IS 'تاريخ ميلاد المريض';
COMMENT ON COLUMN medical_history.address IS 'عنوان المريض';
COMMENT ON COLUMN medical_history.has_diseases IS 'هل يعاني المريض من أمراض؟';
COMMENT ON COLUMN medical_history.diseases IS 'قائمة الأمراض';
COMMENT ON COLUMN medical_history.disease_start_dates IS 'تواريخ بداية الأمراض';
COMMENT ON COLUMN medical_history.takes_medications IS 'هل يتناول المريض أدوية؟';
COMMENT ON COLUMN medical_history.medications IS 'قائمة الأدوية';
COMMENT ON COLUMN medical_history.medication_start_dates IS 'تواريخ بداية تناول الأدوية';
COMMENT ON COLUMN medical_history.had_surgeries IS 'هل أجرى المريض عمليات جراحية؟';
COMMENT ON COLUMN medical_history.surgeries IS 'قائمة العمليات الجراحية';
COMMENT ON COLUMN medical_history.surgery_dates IS 'تواريخ إجراء العمليات الجراحية';