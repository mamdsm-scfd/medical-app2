const API_BASE_URL = 'http://localhost:5000/api'; // عنوان الواجهة الخلفية

async function apiRequest(endpoint, method = 'GET', body = null, authToken = null) {
    const headers = {
        'Content-Type': 'application/json',
    };

    // إذا كان هناك رمز مصادقة
    if (authToken) {
        headers['Authorization'] = `Bearer ${authToken}`;
    }

    const options = {
        method,
        headers,
    };

    // إذا كان هناك بيانات لإرسالها
    if (body) {
        options.body = JSON.stringify(body);
    }

    try {
        const response = await fetch(`${API_BASE_URL}${endpoint}`, options);
        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.error || 'Something went wrong');
        }

        return data;
    } catch (error) {
        console.error('API Error:', error.message);
        throw error;
    }
}

// تصدير الدالة لاستخدامها في الملفات الأخرى
export default apiRequest;
