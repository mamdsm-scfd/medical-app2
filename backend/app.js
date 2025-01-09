require("dotenv").config();
require("./mongo"); // اتصال MongoDB
const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const mysqlConnection = require("./db"); // اتصال MySQL
const authenticateToken = require("./middlewares/authMiddleware"); // Middleware للتوثيق

const app = express();

// إعدادات الأمان
app.use(helmet());

// إعدادات CORS
app.use(
  cors({
    origin: "http://localhost:3000", // السماح بطلبات فقط من هذا الأصل
    methods: ["GET", "POST", "PUT", "DELETE"], // السماح بهذه الطرق فقط
    allowedHeaders: ["Content-Type", "Authorization"], // السماح بهذه الرؤوس فقط
  })
);

// معالجة البيانات
app.use(express.json()); // بديل لـ body-parser
app.use(express.urlencoded({ extended: true }));

// التحقق من الاتصال مع MySQL
mysqlConnection.connect((err) => {
  if (err) {
    console.error("Failed to connect to MySQL:", err.message);
  } else {
    console.log("Connected to MySQL database successfully.");
  }
});

// نقطة البداية للتطبيق
app.get("/", (req, res) => {
  res.send("Welcome to the Healthcare API!");
});

// استخدام مسارات API
app.use("/api/patients", authenticateToken, require("./routes/patientRoutes"));
app.use("/api/doctors", authenticateToken, require("./routes/doctorRoutes"));
app.use("/api/appointments", authenticateToken, require("./routes/appointmentRoutes"));

// تحميل الملفات الثابتة
app.use("/uploads", express.static("uploads"));

// معالج أخطاء مركزي
app.use((err, req, res, next) => {
  console.error(err.stack);
  if (err.name === "ValidationError") {
    return res.status(400).json({ error: err.message });
  }
  res.status(500).json({ error: "An internal server error occurred" });
});

// إعداد المنفذ
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
