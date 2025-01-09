const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const mysqlConnection = require('../db');
const authenticateToken = require('../middlewares/authMiddleware');

// تسجيل مريض جديد
router.post('/register', async (req, res) => {
    const { name, email, password, phone, address } = req.body;

    try {
        const hashedPassword = await bcrypt.hash(password, 10);
        const sql = 'INSERT INTO Patients (name, email, password, phone, address) VALUES (?, ?, ?, ?, ?)';
        mysqlConnection.query(sql, [name, email, hashedPassword, phone, address], (err, results) => {
            if (err) {
                return res.status(500).json({ error: 'Failed to register patient' });
            }
            res.status(201).json({ message: 'Patient registered successfully', patientId: results.insertId });
        });
    } catch (err) {
        res.status(500).json({ error: 'Error processing request' });
    }
});

// تسجيل الدخول
router.post('/login', async (req, res) => {
    const { email, password } = req.body;

    const sql = 'SELECT * FROM Patients WHERE email = ?';
    mysqlConnection.query(sql, [email], async (err, results) => {
        if (err) {
            res.status(500).json({ error: 'Failed to login' });
        } else if (results.length === 0) {
            res.status(404).json({ error: 'User not found' });
        } else {
            const user = results[0];
            const isMatch = await bcrypt.compare(password, user.password);

            if (isMatch) {
                const token = jwt.sign(
                    { id: user.patient_id, email: user.email },
                    process.env.JWT_SECRET || 'your_jwt_secret',
                    { expiresIn: '1h' }
                );
                res.status(200).json({ message: 'Login successful', token });
            } else {
                res.status(401).json({ error: 'Invalid credentials' });
            }
        }
    });
});

// الحصول على ملف المريض (يحتاج تسجيل الدخول)
router.get('/profile', authenticateToken, (req, res) => {
    const patient_id = req.user.id;

    const sql = 'SELECT * FROM Patients WHERE patient_id = ?';
    mysqlConnection.query(sql, [patient_id], (err, results) => {
        if (err) {
            return res.status(500).json({ error: 'Failed to fetch patient profile' });
        }
        if (results.length === 0) {
            return res.status(404).json({ error: 'Patient not found' });
        }
        res.status(200).json(results[0]);
    });
});

module.exports = router;
