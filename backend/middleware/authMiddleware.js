const jwt = require('jsonwebtoken');

const authenticateToken = (req, res, next) => {
    try {
        // استخراج التوكن من الهيدر
        const authHeader = req.headers['authorization'];

        if (!authHeader) {
            return res.status(403).json({ error: 'Access denied: No token provided' });
        }

        // إزالة كلمة "Bearer" إذا كانت موجودة
        const token = authHeader.startsWith('Bearer ')
            ? authHeader.slice(7, authHeader.length)
            : authHeader;

        // التحقق من صحة التوكن
        jwt.verify(token, process.env.JWT_SECRET || 'your_jwt_secret', (err, user) => {
            if (err) {
                return res.status(401).json({ error: 'Invalid or expired token' });
            }

            // إرفاق بيانات المستخدم بطلب المستخدم
            req.user = user;
            next();
        });
    } catch (err) {
        console.error('Auth Middleware Error:', err.message); // تسجيل داخلي للخطأ
        res.status(500).json({ error: 'An unexpected error occurred during authentication' });
    }
};

module.exports = authenticateToken;
