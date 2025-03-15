import authService from '../services/authService.js';

export class AuthController {
  async register(req, res) {
    try {
      // إنشاء المستخدم في Firebase
      const user = await authService.createUser(req.body.email, req.body.password);
      
      // إنشاء معرف مخصص
      const customUid = authService.generateUniqueId();

      // إنشاء كائن الاستجابة
      const responseData = this._createSuccessResponse(user.email, customUid);
      
      res.status(201).json(responseData);
    } catch (error) {
      const errorResponse = this._createErrorResponse(error);
      res.status(400).json(errorResponse);
    }
  }

  _createSuccessResponse(email, uid) {
    return {
      status: 'success',
      message: 'تم إنشاء الحساب بنجاح',
      data: {
        uid,
        email
      }
    };
  }

  _createErrorResponse(error) {
    return {
      status: 'error',
      message: error.message || 'حدث خطأ أثناء إنشاء الحساب'
    };
  }
}

export const authController = new AuthController();