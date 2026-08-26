import axios from 'axios';

// Gán tạm token mới vào localStorage khi khởi chạy
localStorage.setItem(
    'crs_token',
    'eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJhZG1pbiIsInJvbGUiOiJBRE1JTiIsImlhdCI6MTc4NzcyNjI4NywiZXhwIjoxNzg3ODEyNjg3fQ.iR7WHp7lBlHppxy5h5H5oozCcHlVYkk_NUmu7uyZmdg'
);

const axiosClient = axios.create({
    baseURL: import.meta.env.VITE_API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

axiosClient.interceptors.request.use((config) => {
    const token = localStorage.getItem('crs_token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

export default axiosClient;