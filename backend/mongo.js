const mongoose = require('mongoose');
require('dotenv').config();

const mongoURI = process.env.MONGO_URI || 'mongodb://localhost:27017/medical_records';

const connectToMongoDB = async () => {
    try {
        await mongoose.connect(mongoURI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            autoIndex: true, // إنشاء الفهارس تلقائيًا
            serverSelectionTimeoutMS: 5000, // مهلة الاتصال بالخادم
        });
        console.log('Connected to MongoDB');
    } catch (err) {
        console.error('Error connecting to MongoDB:', err.message);
        process.exit(1); // إنهاء التطبيق إذا تعذر الاتصال
    }
};

// التعامل مع الأحداث
mongoose.connection.on('disconnected', () => {
    console.warn('MongoDB connection lost');
});

mongoose.connection.on('reconnected', () => {
    console.log('MongoDB connection reestablished');
});

// إغلاق الاتصال عند إنهاء التطبيق
process.on('SIGINT', async () => {
    try {
        await mongoose.connection.close();
        console.log('MongoDB connection closed');
        process.exit(0);
    } catch (err) {
        console.error('Error closing MongoDB connection:', err.message);
        process.exit(1);
    }
});

connectToMongoDB();

module.exports = mongoose;

