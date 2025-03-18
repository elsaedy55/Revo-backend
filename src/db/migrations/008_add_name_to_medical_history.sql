-- إضافة عمود name في جدول medical_history
ALTER TABLE medical_history
ADD COLUMN IF NOT EXISTS name VARCHAR(255);

-- إضافة تعليق على العمود
COMMENT ON COLUMN medical_history.name IS 'اسم المستخدم';