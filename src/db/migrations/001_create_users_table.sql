-- إنشاء جدول المستخدمين
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    first_name VARCHAR(50) NOT NULL,
    last_name VARCHAR(50) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    phone_number VARCHAR(20),
    date_of_birth DATE NOT NULL,
    gender VARCHAR(10) CHECK (gender IN ('male', 'female')),
    blood_type VARCHAR(5),
    weight DECIMAL(5,2),
    height DECIMAL(5,2),
    emergency_contact_name VARCHAR(100),
    emergency_contact_phone VARCHAR(20),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- إضافة تعليق على الجدول
COMMENT ON TABLE users IS 'جدول يحتوي على البيانات الأساسية للمستخدمين';

-- إضافة تعليقات على الأعمدة
COMMENT ON COLUMN users.blood_type IS 'فصيلة الدم للمستخدم';
COMMENT ON COLUMN users.emergency_contact_name IS 'اسم جهة الاتصال في حالات الطوارئ';