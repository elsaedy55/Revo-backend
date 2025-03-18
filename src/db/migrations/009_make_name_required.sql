-- حذف السجلات القديمة التي ليس لها اسم
DELETE FROM medical_history WHERE name IS NULL;

-- جعل عمود name إجباري
ALTER TABLE medical_history
ALTER COLUMN name SET NOT NULL;