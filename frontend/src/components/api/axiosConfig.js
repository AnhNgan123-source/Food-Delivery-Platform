import axios from 'axios';

const axiosClient = axios.create({
    baseURL: 'http://localhost:8080/api/v1',
    headers: {
        'Content-Type': 'application/json',
    },
});

// TỰ ĐỘNG ĐÍNH KÈM TOKEN VÀO MỌI REQUEST
axiosClient.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// XỬ LÝ LỖI TẬP TRUNG (Ví dụ: Token hết hạn)
axiosClient.interceptors.response.use(
    (response) => {
        const res = response.data;
        // Nếu Backend trả về dạng wrap { data: ... } thì lấy data ra luôn.
        // Nếu Backend trả về mảng/object trực tiếp thì giữ nguyên.
        if (res && res.status === "success" && res.data !== undefined) {
            return res.data; 
        }
        
        return res; 
    },
    (error) => {
        if (error.response && error.response.status === 401) {
            // Nếu lỗi 401 (Unauthorized), đưa về trang đăng nhập
            localStorage.clear();
            window.location.href = '/';
        }
        return Promise.reject(error);
    }
);

export default axiosClient;