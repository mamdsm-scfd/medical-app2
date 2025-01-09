import apiRequest from './api.js';

// تسجيل الدخول
// تسجيل الدخول
document.getElementById('loginForm').addEventListener('submit', async (e) => {
    e.preventDefault();

    const email = document.getElementById('email').value.trim();
    const password = document.getElementById('password').value.trim();

    // التحقق من الحقول الفارغة
    if (!email || !password) {
        alert('Please fill in both email and password.');
        return;
    }

    // التحقق من صحة البريد الإلكتروني
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        alert('Please enter a valid email address.');
        return;
    }

    try {
        const data = await apiRequest('/patients/login', 'POST', { email, password });

        // حفظ رمز المصادقة في التخزين المحلي
        localStorage.setItem('token', data.token);
        alert('Login successful');
        window.location.href = 'dashboard.html';
    } catch (error) {
        alert(error.message);
    }
});


// التسجيل
document.getElementById('registerForm')?.addEventListener('submit', async (e) => {
    e.preventDefault();

    const name = document.getElementById('name').value.trim();
    const email = document.getElementById('email').value.trim();
    const password = document.getElementById('password').value.trim();
    const phone = document.getElementById('phone').value.trim();
    const address = document.getElementById('address').value.trim();

    // التحقق من الحقول الفارغة
    if (!name || !email || !password || !phone || !address) {
        alert('Please fill in all fields.');
        return;
    }

    // التحقق من صحة البريد الإلكتروني
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        alert('Please enter a valid email address.');
        return;
    }
    if (password.length < 8) {
        alert('Password must be at least 8 characters long.');
        return;
    }
    

    // التحقق من رقم الهاتف
    const phoneRegex = /^[0-9]{10}$/; // تعديل حسب القواعد المطلوبة
    if (!phoneRegex.test(phone)) {
        alert('Please enter a valid 10-digit phone number.');
        return;
    }

    try {
        await apiRequest('/patients/register', 'POST', { name, email, password, phone, address });

        alert('Registration successful');
        window.location.href = 'login.html';
    } catch (error) {
        alert(error.message);
    }
});
