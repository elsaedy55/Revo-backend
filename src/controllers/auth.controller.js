import { authService } from '../services/auth.service.js';

class AuthController {
    /**
     * تسجيل مستخدم جديد
     */
    async register(req, res) {
        try {
            const { email, password, name } = req.body;
            
            authService.validateRequiredFields(
                { email, password, name },
                ['email', 'password', 'name']
            );

            const result = await authService.registerUser(email, password, name);
            
            res.status(201).json({
                success: true,
                message: 'تم إنشاء الحساب بنجاح',
                ...result
            });
        } catch (error) {
            this._handleAuthError(error, res);
        }
    }

    /**
     * تسجيل الدخول باستخدام البريد الإلكتروني وكلمة المرور
     */
    async login(req, res) {
        try {
            const { email, password } = req.body;
            
            authService.validateRequiredFields(
                { email, password },
                ['email', 'password']
            );

            const result = await authService.loginWithEmail(email, password);
            
            res.status(200).json({
                success: true,
                message: 'تم تسجيل الدخول بنجاح',
                ...result
            });
        } catch (error) {
            this._handleAuthError(error, res);
        }
    }

    /**
     * تسجيل الدخول باستخدام Google
     */
    async googleLogin(req, res) {
        try {
            let result;
            
            if (req.body?.idToken) {
                const { idToken } = req.body;
                authService.validateRequiredFields({ idToken }, ['idToken']);
                result = await authService.loginWithGoogle({ idToken });
            } else if (req.user) {
                result = await authService.loginWithGoogle({
                    googleUser: req.user
                });
            } else {
                throw new Error('بيانات المصادقة غير متوفرة');
            }

            res.status(200).json({
                success: true,
                message: 'تم تسجيل الدخول بنجاح باستخدام Google',
                ...result
            });
        } catch (error) {
            this._handleAuthError(error, res);
        }
    }

    /**
     * معالجة نجاح مصادقة Google
     */
    async handleGoogleCallback(req, res) {
        try {
            const result = await authService.loginWithGoogle({
                googleUser: req.user
            });
            
            res.status(200).json({
                success: true,
                message: 'تم تسجيل الدخول بنجاح باستخدام Google',
                ...result
            });
        } catch (error) {
            this._handleAuthError(error, res);
        }
    }

    /**
     * معالجة أخطاء المصادقة
     */
    /**
     * طلب إعادة تعيين كلمة المرور
     */
    async forgotPassword(req, res) {
        try {
            const { email } = req.body;
            
            if (!email) {
                return res.status(400).json({
                    success: false,
                    message: 'البريد الإلكتروني مطلوب'
                });
            }

            const result = await authService.forgotPassword(email);
            
            res.status(200).json(result);
        } catch (error) {
            console.error('خطأ في عملية نسيان كلمة المرور:', error);
            
            this._handleAuthError(error, res);
        }
    }

    /**
     * تأكيد إعادة تعيين كلمة المرور
     */
    async resetPassword(req, res) {
        try {
            const { token, newPassword } = req.body;
            
            authService.validateRequiredFields(
                { token, newPassword },
                ['token', 'newPassword']
            );

            await authService.resetPassword(token, newPassword);
            
            res.status(200).json({
                success: true,
                message: 'تم إعادة تعيين كلمة المرور بنجاح'
            });
        } catch (error) {
            this._handleAuthError(error, res);
        }
    }

    _handleAuthError(error, res) {
        console.error('خطأ في المصادقة:', error);

        const errorMapping = {
            'auth/invalid-login-credentials': { 
                status: 401, 
                message: 'البريد الإلكتروني أو كلمة المرور غير صحيحة. يرجى التحقق من بياناتك والمحاولة مرة أخرى.'
            },
            'auth/email-already-in-use': { 
                status: 400, 
                message: 'البريد الإلكتروني مستخدم بالفعل' 
            },
            'auth/user-not-found': { 
                status: 404, 
                message: 'البريد الإلكتروني غير مسجل في النظام' 
            },
            'auth/wrong-password': { 
                status: 401, 
                message: 'كلمة المرور غير صحيحة' 
            },
            'auth/invalid-email': { 
                status: 400, 
                message: 'البريد الإلكتروني غير صالح' 
            },
            'auth/weak-password': { 
                status: 400, 
                message: 'كلمة المرور ضعيفة جداً، يجب أن تكون 6 أحرف على الأقل' 
            },
            'auth/expired-action-code': { 
                status: 400, 
                message: 'انتهت صلاحية رمز إعادة تعيين كلمة المرور' 
            },
            'auth/invalid-action-code': { 
                status: 400, 
                message: 'رمز إعادة تعيين كلمة المرور غير صالح' 
            }
        };

        const errorDetails = errorMapping[error.code] || {
            status: 500,
            message: error.message || 'حدث خطأ في عملية المصادقة'
        };

        res.status(errorDetails.status).json({
            success: false,
            message: errorDetails.message
        });
    }
}

export const authController = new AuthController();