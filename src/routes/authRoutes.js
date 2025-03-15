import express from 'express';
import { authController } from '../controllers/authController.js';
import { validateRegistrationData } from '../middleware/validators.js';

const router = express.Router();

// مسار تسجيل مستخدم جديد مع إضافة middleware للتحقق
router.post('/register', validateRegistrationData, authController.register.bind(authController));

export default router;