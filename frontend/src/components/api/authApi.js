import axiosClient from './axiosConfig';

const authApi = {
    /**
     * Đăng nhập hệ thống
     * @param {Object} credentials - { username, password }
     * @returns {Promise} - Trả về object chứa { token, role, id, username, restaurantId }
     */
    login: (credentials) => {
        const url = '/auth/login';
        return axiosClient.post(url, credentials);
    },

    /**
     * Đăng ký tài khoản mới
     * @param {Object} userData - Object User (username, passWord, email, fullName, address, role,...)
     * @returns {Promise} - Trả về { status: "success", message: "..." }
     */
    register: (userData) => {
        const url = '/auth/register';
        return axiosClient.post(url, userData);
    },

    /**
     * Đăng xuất (Client-side)
     */
    logout: () => {
        localStorage.removeItem('token');
        // Bạn có thể xóa thêm các thông tin khác như role, userId nếu cần
        window.location.href = '/';
    }
};

export default authApi;