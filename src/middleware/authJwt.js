import jwt from 'jsonwebtoken';
import { authConfig } from '../config/auth.config.js';

const AUTH_SCHEME = 'Bearer';

class AuthError extends Error {
    constructor(status, message, details = {}) {
        super(message);
        this.status = status;
        this.details = details;
    }
}

function extractAndVerifyToken(authHeader) {
    if (!authHeader) {
        throw new AuthError(403, 'لم يتم توفير هيدر Authorization', {
            required: 'Authorization: Bearer <token>'
        });
    }

    if (!authHeader.startsWith(`${AUTH_SCHEME} `)) {
        throw new AuthError(403, 'صيغة هيدر Authorization غير صحيحة', {
            required: 'Authorization: Bearer <token>'
        });
    }

    const token = authHeader.replace(`${AUTH_SCHEME} `, '');
    
    if (!token) {
        throw new AuthError(403, 'لم يتم توفير التوكن', {
            required: 'Authorization: Bearer <token>',
            tip: 'تأكد من وضع Bearer مرة واحدة فقط قبل التوكن'
        });
    }

    try {
        const decoded = jwt.verify(token, authConfig.jwt.secret);
        // التحقق من وجود معرف المستخدم في أي من الحقلين
        const userId = decoded.uid || decoded.id;
        if (!userId) {
            throw new AuthError(401, 'التوكن لا يحتوي على معرف المستخدم');
        }
        return userId;
    } catch (error) {
        if (error instanceof AuthError) {
            throw error;
        }
        throw new AuthError(401, 'التوكن غير صالح', { error: error.message });
    }
}

export function verifyToken(req, res, next) {
    try {
        const userId = extractAndVerifyToken(req.headers.authorization);
        // تخزين معرف المستخدم في الطلب
        req.userId = userId;
        next();
    } catch (error) {
        const response = {
            success: false,
            message: error.message,
            ...error.details
        };
        return res.status(error.status).json(response);
    }
}