export class ValidationError extends Error {
  constructor(message) {
    super(message);
    this.name = 'ValidationError';
  }
}

class Validators {
  validateEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      throw new ValidationError('البريد الإلكتروني غير صالح');
    }
  }

  validatePassword(password) {
    if (!password || password.length < 6) {
      throw new ValidationError('يجب أن تكون كلمة المرور 6 أحرف على الأقل');
    }
  }

  validateRequiredFields(fields, data) {
    for (const field of fields) {
      if (!data[field]) {
        throw new ValidationError(`الحقل ${field} مطلوب`);
      }
    }
  }
}

export const validateRegistrationData = (req, res, next) => {
  try {
    const validators = new Validators();
    const { email, password, name } = req.body;

    // التحقق من وجود الحقول المطلوبة
    validators.validateRequiredFields(['email', 'password', 'name'], req.body);

    // التحقق من صحة البريد الإلكتروني
    validators.validateEmail(email);

    // التحقق من قوة كلمة المرور
    validators.validatePassword(password);

    next();
  } catch (error) {
    if (error instanceof ValidationError) {
      return res.status(400).json({
        status: 'error',
        message: error.message
      });
    }
    next(error);
  }
};