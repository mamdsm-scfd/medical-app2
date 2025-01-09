const express = require('express');
const router = express.Router();
const mysqlConnection = require('../db');
const authenticateToken = require('../middlewares/authMiddleware');

// إنشاء موعد جديد (يتطلب تسجيل الدخول)
router.post('/', authenticateToken, (req, res) => {
    const { patient_id, doctor_id, appointment_date } = req.body;
    const sql = 'INSERT INTO Appointments (patient_id, doctor_id, appointment_date) VALUES (?, ?, ?)';
    mysqlConnection.query(sql, [patient_id, doctor_id, appointment_date], (err, results) => {
        if (err) {
            res.status(500).json({ error: 'Failed to create appointment' });
        } else {
            res.status(201).json({ message: 'Appointment created successfully', appointmentId: results.insertId });
        }
    });
});

// الحصول على جميع المواعيد (للمستخدمين المصرح لهم فقط)
router.get('/', authenticateToken, (req, res) => {
    const sql = 'SELECT * FROM Appointments';
    mysqlConnection.query(sql, (err, results) => {
        if (err) {
            res.status(500).json({ error: 'Failed to fetch appointments' });
        } else {
            res.status(200).json(results);
        }
    });
});

// تحديث حالة الموعد (للمستخدمين المصرح لهم فقط)
router.put('/:id', authenticateToken, (req, res) => {
    const { id } = req.params;
    const { status } = req.body;
    const sql = 'UPDATE Appointments SET status = ? WHERE appointment_id = ?';
    mysqlConnection.query(sql, [status, id], (err) => {
        if (err) {
            res.status(500).json({ error: 'Failed to update appointment' });
        } else {
            res.status(200).json({ message: 'Appointment status updated successfully' });
        }
    });
});

module.exports = router;
