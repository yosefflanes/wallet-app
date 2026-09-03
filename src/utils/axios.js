import axios from 'axios';

const api = axios.create({
    baseURL: 'http://127.0.0.1:8000/api',
    headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
    },
});

// Interceptor Request: Sisipkan token jika ada
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

// Interceptor Response: Penanganan Error Global
api.interceptors.response.use(
    (response) => response,
    (error) => {
        const { response } = error;
        
        if (response) {
            if (response.status === 401) {
                localStorage.removeItem('token');
                localStorage.removeItem('user');
                window.location.href = '/login';
            }
            let errorMessage = response.data?.message || 'Terjadi kesalahan pada server';
            
            if (response.status === 422 && response.data.errors) {
                const firstErrorKey = Object.keys(response.data.errors)[0];
                errorMessage = response.data.errors[firstErrorKey][0];
            }
            return Promise.reject(new Error(errorMessage));
        }
        return Promise.reject(new Error('Gagal terhubung ke server. Periksa koneksi Anda.'));
    }
);

export default api;