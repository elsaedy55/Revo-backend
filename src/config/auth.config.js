/**
 * تكوين المصادقة والأمان
 */
export const authConfig = {
    jwt: {
        secret: process.env.JWT_SECRET || 'revo-secret-key',
        expirationTime: process.env.JWT_EXPIRATION || '24h'
    },
    server: {
        url: process.env.SERVER_URL || 'http://localhost:3000'
    },
    google: {
        clientId: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        callbackUrl: process.env.GOOGLE_CALLBACK_URL || `${process.env.SERVER_URL}/api/auth/google/callback`
    }
};

export default authConfig;