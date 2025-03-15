/**
 * التحقق من صحة بيانات تسجيل المستخدم
 * @param {Request} req - كائن الطلب
 * @param {Response} res - كائن الاستجابة
 * @param {Function} next - الدالة التالية في سلسلة الوسائط
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
 * @param {Request} req - كائن الطلب
 * @param {Response} res - كائن الاستجابة
 * @param {Function} next - الدالة التالية في سلسلة الوسائط
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
 * @param {Request} req - كائن الطلب
 * @param {Response} res - كائن الاستجابة
 * @param {Function} next - الدالة التالية في سلسلة الوسائط
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