-- تعديل نوع عمود user_id في جدول medical_history
ALTER TABLE medical_history
DROP CONSTRAINT medical_history_user_id_fkey,
ALTER COLUMN user_id TYPE VARCHAR(255);

-- تحديث تعليق العمود
COMMENT ON COLUMN medical_history.user_id IS 'معرف المستخدم من Firebase';