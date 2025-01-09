const MedicalFile = require('../models/MedicalFiles');

// Upload a medical file
exports.uploadMedicalFile = async (req, res) => {
  const { FileName, FilePath, FileType } = req.body;

  try {
    const patientID = req.user.id; // استخدم ID من التوكن

    await MedicalFile.updateOne(
      { PatientID: patientID },
      {
        $push: {
          Files: { FileName, FilePath, FileType, UploadDate: new Date() },
        },
      },
      { upsert: true }
    );

    res.status(201).json({ message: 'File uploaded successfully' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to upload file' });
  }
};

// Get medical files for the authenticated patient
exports.getMedicalFiles = async (req, res) => {
  try {
    const patientID = req.user.id; // استخدم ID من التوكن

    const result = await MedicalFile.findOne({ PatientID: patientID });
    res.json(result ? result.Files : []);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch medical files' });
  }
};
