import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import passport from 'passport';
import authRoutes from './routes/auth.routes.js';
import medicalHistoryRoutes from './routes/medicalHistory.routes.js';
import { authConfig } from './config/auth.config.js';

// تحميل المتغيرات البيئية
dotenv.config();

// تهيئة التطبيق
const app = express();
const port = process.env.PORT || 3000;

// إعداد CORS
const allowedOrigins = process.env.ALLOWED_ORIGINS?.split(',') || [authConfig.server.url];
app.use(cors({
    origin: allowedOrigins,
    credentials: true
}));

// إعداد الوسائط
app.use(express.json());

// تهيئة Passport
app.use(passport.initialize());

// تكوين المسارات
app.use('/api/auth', authRoutes);
app.use('/api/medical-history', medicalHistoryRoutes);

// معالجة المسارات غير الموجودة
app.use((req, res) => {
    res.status(404).json({
        success: false,
        message: 'المسار غير موجود'
    });
});

// معالجة الأخطاء العامة
app.use((err, req, res, next) => {
    console.error('خطأ غير متوقع:', err);
    
    res.status(500).json({
        success: false,
        message: 'حدث خطأ في الخادم',
        error: process.env.NODE_ENV === 'development' ? err.message : undefined
    });
});

// تشغيل الخادم
const server = app.listen(port, () => {
    console.log(`الخادم يعمل على المنفذ: ${port}`);
    console.log(`عنوان السيرفر: ${authConfig.server.url}`);
});