const jwt = require('jsonwebtoken');

const SECRET_KEY = process.env.JWT_SECRET || 'your_default_secret_key'; // جلب المفتاح السري من متغير البيئة
const TOKEN_EXPIRATION = process.env.JWT_EXPIRATION || '1h'; // مدة صلاحية الرمز الافتراضية

/**
 * إنشاء رمز JWT
 * @param {Object} user - معلومات المستخدم (id, role)
 * @returns {string} الرمز المُنشأ
 */
const generateToken = (user) => {
  return jwt.sign(
    { id: user.id, role: user.role }, // الحمولة (Payload)
    SECRET_KEY, // المفتاح السري
    { expiresIn: TOKEN_EXPIRATION, algorithm: 'HS256' } // الخيارات
  );
};

/**
 * التحقق من صحة رمز JWT
 * @param {string} token - الرمز المراد التحقق منه
 * @returns {Object} البيانات المضمّنة في الرمز إذا كان صالحًا
 * @throws {Error} إذا كان الرمز غير صالح
 */
const verifyToken = (token) => {
  try {
    return jwt.verify(token, SECRET_KEY, { algorithms: ['HS256'] });
  } catch (err) {
    if (err.name === 'TokenExpiredError') {
      throw new Error('Token has expired');
    } else if (err.name === 'JsonWebTokenError') {
      throw new Error('Invalid token');
    }
    throw new Error('Failed to verify token');
  }
};

module.exports = { generateToken, verifyToken };
