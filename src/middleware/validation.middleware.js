import { validationResult } from 'express-validator';

/**
 * وسيط للتحقق من صحة البيانات
 */
export const validate = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({
            success: false,
            errors: errors.array()
        });
    }
    next();
};

/**
 * التحقق من صحة بيانات تسجيل المستخدم
 */
export const validateRegisterData = (req, res, next) => {
    const { email, password, name } = req.body;

    // التحقق من وجود البريد الإلكتروني
    if (!email) {
        return res.status(400).json({
            message: 'البريد الإلكتروني مطلوب'
        });
    }

    // التحقق من صحة تنسيق البريد الإلكتروني
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        return res.status(400).json({
            message: 'تنسيق البريد الإلكتروني غير صحيح'
        });
    }

    // التحقق من كلمة المرور
    if (!password) {
        return res.status(400).json({
            message: 'كلمة المرور مطلوبة'
        });
    }

    // التحقق من طول كلمة المرور
    if (password.length < 6) {
        return res.status(400).json({
            message: 'كلمة المرور يجب أن تكون 6 أحرف على الأقل'
        });
    }

    // التحقق من الاسم
    if (!name) {
        return res.status(400).json({
            message: 'الاسم مطلوب'
        });
    }

    if (name.length < 2) {
        return res.status(400).json({
            message: 'الاسم يجب أن يكون حرفين على الأقل'
        });
    }

    next();
};

/**
 * التحقق من صحة بيانات تسجيل الدخول
 */
export const validateLoginData = (req, res, next) => {
    const { email, password } = req.body;

    // التحقق من وجود البريد الإلكتروني
    if (!email) {
        return res.status(400).json({
            message: 'البريد الإلكتروني مطلوب'
        });
    }

    // التحقق من صحة تنسيق البريد الإلكتروني
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        return res.status(400).json({
            message: 'تنسيق البريد الإلكتروني غير صحيح'
        });
    }

    // التحقق من كلمة المرور
    if (!password) {
        return res.status(400).json({
            message: 'كلمة المرور مطلوبة'
        });
    }

    next();
};

/**
 * التحقق من صحة بيانات تسجيل الدخول باستخدام Google
 */
export const validateGoogleLoginData = (req, res, next) => {
    const { idToken } = req.body;

    if (!idToken) {
        return res.status(400).json({
            message: 'رمز المصادقة من Google مطلوب'
        });
    }

    next();
};

/**
 * التحقق من صحة بيانات طلب إعادة تعيين كلمة المرور
 */
export const validateForgotPasswordData = (req, res, next) => {
    const { email } = req.body;

    // التحقق من وجود البريد الإلكتروني
    if (!email) {
        return res.status(400).json({
            message: 'البريد الإلكتروني مطلوب'
        });
    }

    // التحقق من صحة تنسيق البريد الإلكتروني
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        return res.status(400).json({
            message: 'تنسيق البريد الإلكتروني غير صحيح'
        });
    }

    next();
};

/**
 * التحقق من صحة بيانات إعادة تعيين كلمة المرور
 */
export const validateResetPasswordData = (req, res, next) => {
    const { token, newPassword } = req.body;

    // التحقق من وجود الرمز
    if (!token) {
        return res.status(400).json({
            message: 'رمز إعادة التعيين مطلوب'
        });
    }

    // التحقق من كلمة المرور الجديدة
    if (!newPassword) {
        return res.status(400).json({
            message: 'كلمة المرور الجديدة مطلوبة'
        });
    }

    // التحقق من طول كلمة المرور
    if (newPassword.length < 6) {
        return res.status(400).json({
            message: 'كلمة المرور يجب أن تكون 6 أحرف على الأقل'
        });
    }

    next();
};