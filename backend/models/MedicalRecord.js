const mongoose = require('mongoose');

// Schema for medical records
const medicalRecordSchema = new mongoose.Schema({
    patient_id: {
        type: Number, // يمكن تغييره إلى ObjectId إذا كانت العلاقة مباشرة مع MongoDB
        required: [true, 'Patient ID is required'],
    },
    file_type: {
        type: String,
        required: [true, 'File type is required'],
        enum: ['image/jpeg', 'image/png', 'application/pdf'], // أنواع الملفات المسموح بها
    },
    file_url: {
        type: String,
        required: [true, 'File URL is required'],
        validate: {
            validator: function (v) {
                // تحقق من أن الرابط يبدأ بـ http أو https
                return /^(http|https):\/\/[^ "]+$/.test(v);
            },
            message: (props) => `${props.value} is not a valid URL`,
        },
    },
    upload_date: {
        type: Date,
        default: Date.now,
    },
});

// Export the model
module.exports = mongoose.model('MedicalRecord', medicalRecordSchema);
