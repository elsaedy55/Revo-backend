-- إنشاء جدول التاريخ الطبي
CREATE TABLE medical_history (
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL,
    condition_name VARCHAR(255) NOT NULL,
    diagnosis_date DATE,
    treatment_description TEXT,
    medications TEXT,
    surgery_history TEXT,
    allergies TEXT,
    chronic_diseases TEXT,
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- إضافة تعليق على الجدول
COMMENT ON TABLE medical_history IS 'جدول يحتوي على التاريخ الطبي للمستخدمين';

-- إضافة تعليقات على الأعمدة
COMMENT ON COLUMN medical_history.condition_name IS 'اسم الحالة المرضية';
COMMENT ON COLUMN medical_history.diagnosis_date IS 'تاريخ التشخيص';
COMMENT ON COLUMN medical_history.treatment_description IS 'وصف العلاج';
COMMENT ON COLUMN medical_history.medications IS 'الأدوية الموصوفة';
COMMENT ON COLUMN medical_history.surgery_history IS 'تاريخ العمليات الجراحية';
COMMENT ON COLUMN medical_history.allergies IS 'الحساسية من أدوية أو أطعمة';
COMMENT ON COLUMN medical_history.chronic_diseases IS 'الأمراض المزمنة';