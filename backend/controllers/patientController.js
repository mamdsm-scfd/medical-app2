const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const mysqlConnection = require('../db');

// Get all patients (Admin only)
exports.getPatients = (req, res) => {
  if (req.user.role !== 'admin') {
    return res.status(403).json({ error: 'Access denied: Admins only' });
  }

  const sql = 'SELECT * FROM Patients';
  mysqlConnection.query(sql, (err, results) => {
    if (err) {
      return res.status(500).json({ error: 'Failed to fetch patients' });
    }
    res.json(results);
  });
};

// Add a new patient
exports.addPatient = async (req, res) => {
  const { FullName, Email, Password } = req.body;

  try {
    const hashedPassword = await bcrypt.hash(Password, 10);
    const sql = 'INSERT INTO Patients (FullName, Email, PasswordHash) VALUES (?, ?, ?)';

    mysqlConnection.query(sql, [FullName, Email, hashedPassword], (err, result) => {
      if (err) {
        return res.status(500).json({ error: 'Failed to add patient' });
      }
      res.status(201).json({ message: 'Patient added successfully', patientId: result.insertId });
    });
  } catch (err) {
    res.status(500).json({ error: 'Error processing request' });
  }
};

// Login a patient
exports.loginPatient = async (req, res) => {
  const { Email, Password } = req.body;

  const sql = 'SELECT * FROM Patients WHERE Email = ?';
  mysqlConnection.query(sql, [Email], async (err, results) => {
    if (err) {
      return res.status(500).json({ error: 'Failed to login' });
    }

    if (results.length === 0) {
      return res.status(404).json({ error: 'Patient not found' });
    }

    const patient = results[0];
    const isPasswordMatch = await bcrypt.compare(Password, patient.PasswordHash);

    if (!isPasswordMatch) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const token = jwt.sign(
      { id: patient.PatientID, email: patient.Email, role: 'patient' },
      process.env.JWT_SECRET || 'your_jwt_secret',
      { expiresIn: '1h' }
    );

    res.status(200).json({ message: 'Login successful', token });
  });
};

// Get profile of authenticated patient
exports.getPatientProfile = (req, res) => {
  const patientID = req.user.id;

  const sql = 'SELECT * FROM Patients WHERE PatientID = ?';
  mysqlConnection.query(sql, [patientID], (err, results) => {
    if (err) {
      return res.status(500).json({ error: 'Failed to fetch profile' });
    }

    if (results.length === 0) {
      return res.status(404).json({ error: 'Patient not found' });
    }

    res.json(results[0]);
  });
};
