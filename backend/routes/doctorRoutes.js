const express = require('express');
const router = express.Router();
const mysqlConnection = require('../db');
const authenticateToken = require('../middlewares/authMiddleware');

// تسجيل طبيب جديد
router.post('/register', (req, res) => {
    const { name, email, password, phone, specialty } = req.body;
    const sql = 'INSERT INTO Doctors (name, email, password, phone, specialty) VALUES (?, ?, ?, ?, ?)';
    mysqlConnection.query(sql, [name, email, password, phone, specialty], (err, results) => {
        if (err) {
            res.status(500).json({ error: 'Failed to register doctor' });
        } else {
            res.status(201).json({ message: 'Doctor registered successfully', doctorId: results.insertId });
        }
    });
});

// الحصول على جميع الأطباء (يحتاج تسجيل الدخول)
router.get('/', authenticateToken, (req, res) => {
    const sql = 'SELECT * FROM Doctors';
    mysqlConnection.query(sql, (err, results) => {
        if (err) {
            res.status(500).json({ error: 'Failed to fetch doctors' });
        } else {
            res.status(200).json(results);
        }
    });
});

module.exports = router;
