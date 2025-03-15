const jwt = require('jsonwebtoken');
const authConfig = require('../config/auth.config.js');

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
        return decoded.id || decoded.uid;
    } catch (error) {
        throw new AuthError(401, 'غير مصرح به!', { error: error.message });
    }
}

function verifyToken(req, res, next) {
    try {
        const userId = extractAndVerifyToken(req.headers.authorization);
        req.userId = userId;
        next();
    } catch (error) {
        const response = {
            message: error.message,
            ...error.details
        };
        return res.status(error.status).json(response);
    }
}

module.exports = {
    verifyToken
};