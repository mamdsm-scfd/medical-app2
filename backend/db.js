const mysql = require('mysql2');
require('dotenv').config();

const connection = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
});

// الاتصال بقاعدة البيانات
connection.connect((err) => {
    if (err) {
        console.error('Error connecting to MySQL:', err.message);
        process.exit(1); // إنهاء العملية إذا تعذر الاتصال
    } else {
        console.log('Connected to MySQL database');
    }
});

// التعامل مع إغلاق التطبيق بشكل آمن
process.on('SIGINT', () => {
    connection.end((err) => {
        if (err) {
            console.error('Error closing MySQL connection:', err.message);
        } else {
            console.log('MySQL connection closed');
        }
        process.exit(0); // إنهاء العملية
    });
});

module.exports = connection;
