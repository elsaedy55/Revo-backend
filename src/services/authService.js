import { createUserWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../config/firebase.js';

class AuthService {
  async createUser(email, password) {
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      return userCredential.user;
    } catch (error) {
      throw this._handleFirebaseError(error);
    }
  }

  generateUniqueId() {
    return Math.floor(100000 + Math.random() * 900000).toString();
  }

  _handleFirebaseError(error) {
    const errorMessages = {
      'auth/email-already-in-use': 'البريد الإلكتروني مستخدم بالفعل',
      'auth/invalid-email': 'البريد الإلكتروني غير صالح',
      'auth/operation-not-allowed': 'تسجيل الحساب غير مفعل حالياً',
      'auth/weak-password': 'كلمة المرور ضعيفة جداً'
    };

    return {
      code: error.code,
      message: errorMessages[error.code] || 'حدث خطأ أثناء إنشاء الحساب'
    };
  }
}

export default new AuthService();