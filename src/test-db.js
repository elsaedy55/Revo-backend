import { testConnection } from './config/database.js';
import dotenv from 'dotenv';

// تحميل المتغيرات البيئية
dotenv.config();

console.log('قيم تكوين قاعدة البيانات:');
console.log('POSTGRES_USER:', process.env.POSTGRES_USER);
console.log('POSTGRES_HOST:', process.env.POSTGRES_HOST);
console.log('POSTGRES_DB:', process.env.POSTGRES_DB);
console.log('POSTGRES_PASSWORD:', process.env.POSTGRES_PASSWORD);
console.log('POSTGRES_PORT:', process.env.POSTGRES_PORT);

console.log('\nجاري اختبار الاتصال بقاعدة البيانات...');
testConnection()
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