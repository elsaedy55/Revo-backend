import db from './config/database.js';
import dotenv from 'dotenv';

// تحميل المتغيرات البيئية
dotenv.config();

console.log('قيم تكوين قاعدة البيانات:');
console.log('DATABASE_URL:', process.env.DATABASE_URL);

console.log('\nجاري اختبار الاتصال بقاعدة البيانات...');
db.testConnection()
    .then(success => {
        if (success) {
            console.log('✅ تم الاتصال بقاعدة البيانات بنجاح');
            process.exit(0);
        } else {
            console.log('❌ فشل الاتصال بقاعدة البيانات');
            process.exit(1);
        }
    })
    .catch(error => {
        console.error('❌ حدث خطأ:', error);
        process.exit(1);
    });