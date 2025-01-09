import apiRequest from './api.js';

document.addEventListener('DOMContentLoaded', async () => {
    const token = localStorage.getItem('token');
    if (!token) {
        alert('Please log in first.');
        window.location.href = 'login.html';
        return;
    }

    try {
        // 1. استرجاع معلومات المستخدم
        const userInfo = await apiRequest('/patients/details', 'GET', null, token);
        document.getElementById('userName').textContent = userInfo.patient.name;
        document.getElementById('userEmail').textContent = userInfo.patient.email;

        // 2. استرجاع المواعيد
        const appointments = await apiRequest('/appointments', 'GET', null, token);
        const appointmentsTable = document.getElementById('appointmentsTable');
        appointments.forEach((appointment) => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${appointment.appointment_id}</td>
                <td>${appointment.doctor_name}</td>
                <td>${appointment.appointment_date}</td>
                <td>${appointment.status}</td>
            `;
            appointmentsTable.appendChild(row);
        });

        // 3. استرجاع الملفات الطبية
        const medicalRecords = await apiRequest(`/patients/records`, 'GET', null, token);
        const recordsList = document.getElementById('recordsList');
        medicalRecords.forEach((record) => {
            const listItem = document.createElement('li');
            listItem.innerHTML = `
                <a href="${record.file_url}" target="_blank">${record.file_type}</a>
            `;
            recordsList.appendChild(listItem);
        });
    } catch (error) {
        alert(error.message);
    }
});

// رفع الملفات الطبية
document.getElementById('uploadForm').addEventListener('submit', async (e) => {
    e.preventDefault();

    const token = localStorage.getItem('token');
    if (!token) {
        alert('Please log in first.');
        window.location.href = 'login.html';
        return;
    }

    const fileInput = document.getElementById('fileInput');
    const formData = new FormData();
    formData.append('file', fileInput.files[0]);

    try {
        const response = await fetch('http://localhost:5000/api/patients/upload', {
            method: 'POST',
            headers: {
                Authorization: `Bearer ${token}`,
            },
            body: formData,
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.error || 'File upload failed');
        }

        alert('File uploaded successfully');
        window.location.reload();
    } catch (error) {
        alert(error.message);
    }
});

// تسجيل الخروج
document.getElementById('logoutBtn').addEventListener('click', () => {
    localStorage.removeItem('token');
    alert('Logged out successfully');
    window.location.href = 'login.html';
});
