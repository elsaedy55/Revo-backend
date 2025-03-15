import jwt from 'jsonwebtoken';
import { auth } from '../config/firebase.config.js';
import { authConfig } from '../config/auth.config.js';
import {
    signInWithEmailAndPassword,
    createUserWithEmailAndPassword,
    updateProfile,
    GoogleAuthProvider,
    signInWithCredential
} from 'firebase/auth';

class AuthService {
    /**
     * إنشاء JWT token للمستخدم
     */
    createToken(user) {
        return jwt.sign(
            {
                id: user.uid || user.id,
                email: user.email,
                name: user.displayName || user.name,
                iss: authConfig.server.url
            },
            authConfig.jwt.secret,
            { 
                expiresIn: authConfig.jwt.expirationTime,
                audience: authConfig.server.url
            }
        );
    }

    /**
     * إنشاء مستخدم جديد
     */
    async registerUser(email, password, name) {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;

        await updateProfile(user, { displayName: name });
        const token = this.createToken(user);

        return {
            user: this._formatUserData(user),
            token
        };
    }

    /**
     * تسجيل الدخول باستخدام البريد الإلكتروني وكلمة المرور
     */
    async loginWithEmail(email, password) {
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;
        const token = this.createToken(user);

        return {
            user: this._formatUserData(user),
            token
        };
    }

    /**
     * تسجيل الدخول باستخدام Google
     * @param {Object} options - خيارات تسجيل الدخول
     * @param {string} [options.idToken] - توكن المصادقة من Google
     * @param {Object} [options.googleUser] - بيانات المستخدم من passport
     */
    async loginWithGoogle(options) {
        let userData;

        if (options.idToken) {
            // تسجيل الدخول باستخدام idToken
            const credential = GoogleAuthProvider.credential(options.idToken);
            const userCredential = await signInWithCredential(auth, credential);
            userData = userCredential.user;
        } else if (options.googleUser) {
            // استخدام بيانات المستخدم من passport مباشرة
            userData = options.googleUser;
        } else {
            throw new Error('بيانات المصادقة غير صالحة');
        }

        const token = this.createToken(userData);

        return {
            user: this._formatUserData(userData),
            token
        };
    }

    /**
     * تنسيق بيانات المستخدم للإرجاع
     */
    _formatUserData(user) {
        return {
            id: user.uid || user.id,
            email: user.email,
            name: user.displayName || user.name,
            photoUrl: user.photoURL || user.photoUrl || `${authConfig.server.url}/images/default-avatar.png`
        };
    }

    /**
     * التحقق من صحة البيانات المطلوبة
     */
    validateRequiredFields(data, requiredFields) {
        for (const field of requiredFields) {
            if (!data[field]) {
                throw new Error(`الحقل ${field} مطلوب`);
            }
        }
    }
}

export const authService = new AuthService();
export default authService;