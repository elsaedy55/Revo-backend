import pkg from 'pg';
const { Pool } = pkg;

/**
 * تكوين اتصال قاعدة البيانات
 */
const pool = new Pool({
    user: process.env.POSTGRES_USER,
    host: process.env.POSTGRES_HOST,
    database: process.env.POSTGRES_DB,
    password: process.env.POSTGRES_PASSWORD,
    port: process.env.POSTGRES_PORT,
    // خيارات إضافية لتحسين الأداء
    max: 20, // الحد الأقصى لعدد الاتصالات في المجمع
    idleTimeoutMillis: 30000, // وقت انتهاء صلاحية الاتصال الخامل
    connectionTimeoutMillis: 2000, // وقت انتهاء محاولة الاتصال
});

// التحقق من الاتصال عند بدء التشغيل
pool.connect((err, client, release) => {
    if (err) {
        console.error('خطأ في الاتصال بقاعدة البيانات:', err.stack);
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
export async function query(text, params) {
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
export async function getClient() {
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

export default {
    query,
    getClient,
    pool
};