import pkg from 'pg';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

// تحميل المتغيرات البيئية
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.join(__dirname, '../../.env') });

const { Pool } = pkg;

// تكوين الاتصال بقاعدة البيانات PostgreSQL
console.log('تكوين قاعدة البيانات: PostgreSQL');

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false
});

// دالة للتحقق من الاتصال بقاعدة البيانات
const testConnection = async () => {
  try {
    const client = await pool.connect();
    console.log('تم الاتصال بقاعدة البيانات PostgreSQL بنجاح');
    client.release();
    return true;
  } catch (error) {
    console.error('خطأ في الاتصال بقاعدة البيانات:', error.message);
    return false;
  }
};

export { pool, testConnection };