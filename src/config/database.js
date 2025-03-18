import pkg from 'pg';
const { Pool } = pkg;
import dotenv from 'dotenv';

dotenv.config();

/**
 * تكوين اتصال قاعدة البيانات
 */
const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: process.env.NODE_ENV === 'production' ? {
        rejectUnauthorized: false,
        require: true
    } : false
});

// التحقق من الاتصال عند بدء التشغيل
pool.connect((err, client, release) => {
    if (err) {
        console.error('خطأ في الاتصال بقاعدة البيانات:', err.stack);
        console.log('محاولة الاتصال باستخدام:', {
            connectionString: process.env.DATABASE_URL,
            ssl: process.env.NODE_ENV === 'production'
        });
    } else {
        console.log('تم الاتصال بقاعدة البيانات بنجاح');
        release();
    }
});

/**
 * تنفيذ استعلام SQL
 * @param {string} text - نص الاستعلام
 * @param {Array} params - معلمات الاستعلام
 * @returns {Promise} نتيجة الاستعلام
 */
async function query(text, params) {
    const start = Date.now();
    try {
        const res = await pool.query(text, params);
        const duration = Date.now() - start;
        console.log('تم تنفيذ الاستعلام:', { text, duration, rows: res.rowCount });
        return res;
    } catch (error) {
        console.error('خطأ في تنفيذ الاستعلام:', error.stack);
        throw error;
    }
}

/**
 * الحصول على اتصال من المجمع لتنفيذ عدة استعلامات
 * @returns {Promise<PoolClient>} اتصال قاعدة البيانات
 */
async function getClient() {
    const client = await pool.connect();
    const query = client.query;
    const release = client.release;

    // تعديل دالة التحرير للتأكد من عدم إعادة استخدام العميل بعد تحريره
    client.release = () => {
        release.apply(client);
    };

    // تعريف دالة استعلام مخصصة للتتبع
    client.query = (...args) => {
        client.lastQuery = args;
        return query.apply(client, args);
    };

    return client;
}

/**
 * اختبار الاتصال بقاعدة البيانات
 * @returns {Promise<boolean>} نتيجة الاختبار
 */
async function testConnection() {
    try {
        await pool.query('SELECT NOW()');
        return true;
    } catch (error) {
        console.error('فشل اختبار الاتصال:', error);
        return false;
    }
}

export default {
    pool,
    query,
    getClient,
    testConnection
};