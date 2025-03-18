import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import dotenv from 'dotenv';
import { authConfig } from './auth.config.js';

dotenv.config();

/**
 * تكوين Firebase مع الإعدادات المناسبة للبيئة الحالية
 */
const firebaseConfig = {
  apiKey: process.env.FIREBASE_API_KEY,
  authDomain: process.env.FIREBASE_AUTH_DOMAIN,
  projectId: process.env.FIREBASE_PROJECT_ID,
  storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.FIREBASE_APP_ID,
  measurementId: process.env.FIREBASE_MEASUREMENT_ID
};

/**
 * مدير Firebase لإدارة الاتصال والمصادقة
 */
class FirebaseManager {
  constructor() {
    try {
      this.app = initializeApp(firebaseConfig);
      this.auth = getAuth(this.app);
      
      // تكوين عنوان إعادة التوجيه
      this.auth.config.authDomain = process.env.FIREBASE_AUTH_DOMAIN;
      this.auth.config.redirectUrl = `${authConfig.server.url}/api/auth/callback`;
      
      console.log('تم تهيئة Firebase بنجاح');
    } catch (error) {
      console.error('خطأ في تهيئة Firebase:', error);
      throw error;
    }
  }

  static getInstance() {
    if (!FirebaseManager.instance) {
      FirebaseManager.instance = new FirebaseManager();
    }
    return FirebaseManager.instance;
  }

  getAuth() {
    return this.auth;
  }

  /**
   * الحصول على عنوان إعادة التوجيه الكامل
   * @param {string} provider - اسم مزود المصادقة
   * @returns {string} - عنوان URL الكامل لإعادة التوجيه
   */
  getRedirectUrl(provider) {
    return `${authConfig.server.url}/api/auth/${provider}/callback`;
  }
}

// إنشاء نسخة وحيدة من مدير Firebase
export const firebaseManager = FirebaseManager.getInstance();
export const auth = firebaseManager.getAuth();

// تصدير المدير كقيمة افتراضية
export default firebaseManager;