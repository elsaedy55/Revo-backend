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
console.log('تكوين قاعدة البيانات:', {
  user: String(process.env.POSTGRES_USER),
  host: String(process.env.POSTGRES_HOST),
  database: String(process.env.POSTGRES_DB),
  port: parseInt(process.env.POSTGRES_PORT) || 5432
});

const pool = new Pool({
  user: String(process.env.POSTGRES_USER),
  host: String(process.env.POSTGRES_HOST),
  database: String(process.env.POSTGRES_DB),
  password: String(process.env.POSTGRES_PASSWORD),
  port: parseInt(process.env.POSTGRES_PORT) || 5432,
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