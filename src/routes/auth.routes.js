import express from 'express';
import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import { authController } from '../controllers/auth.controller.js';
import {
    validateLoginData,
    validateRegisterData,
    validateGoogleLoginData,
    validateForgotPasswordData,
    validateResetPasswordData
} from '../middleware/validation.middleware.js';
import { authConfig } from '../config/auth.config.js';
import jwt from 'jsonwebtoken';

const router = express.Router();

// وسيط للتحقق من التوكن
const verifyToken = (req, res, next) => {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
        return res.status(401).json({ 
            success: false,
            message: 'التوكن غير موجود' 
        });
    }

    try {
        const decoded = jwt.verify(token, authConfig.jwt.secret);
        req.user = decoded;
        next();
    } catch (error) {
        return res.status(401).json({ 
            success: false,
            message: 'التوكن غير صالح' 
        });
    }
};

// تكوين استراتيجية Google OAuth
passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: `${authConfig.server.url}/api/auth/google/callback`
}, async (accessToken, refreshToken, profile, done) => {
    try {
        return done(null, {
            id: profile.id,
            email: profile.emails[0].value,
            name: profile.displayName,
            photoUrl: profile.photos[0].value
        });
    } catch (error) {
        return done(error, null);
    }
}));

// مسارات المصادقة
router.post('/register', validateRegisterData, authController.register.bind(authController));
router.post('/login', validateLoginData, authController.login.bind(authController));
router.post('/google/token', validateGoogleLoginData, authController.googleLogin.bind(authController));
router.post('/forgot-password', validateForgotPasswordData, authController.forgotPassword.bind(authController));
router.post('/reset-password', validateResetPasswordData, authController.resetPassword.bind(authController));

// مسارات مصادقة Google
router.get('/google', passport.authenticate('google', {
    scope: ['profile', 'email']
}));

router.get('/google/callback', passport.authenticate('google', { 
    session: false,
    failureRedirect: '/api/auth/error' 
}), authController.handleGoogleCallback.bind(authController));

// التحقق من حالة المصادقة
router.get('/status', verifyToken, (req, res) => {
    res.json({
        success: true,
        message: 'تم التحقق من المصادقة بنجاح',
        user: {
            id: req.user.id,
            name: req.user.name,
            email: req.user.email,
            photoUrl: req.user.photoUrl
        }
    });
});

// مسار تسجيل الخروج
router.get('/logout', (req, res) => {
    res.json({
        success: true,
        message: 'تم تسجيل الخروج بنجاح'
    });
});

// مسار الخطأ
router.get('/error', (req, res) => {
    res.status(401).json({
        success: false,
        message: 'فشلت عملية المصادقة'
    });
});

export default router;