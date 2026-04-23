import axiosClient from './axiosConfig';

const restaurantApi = {
<<<<<<< HEAD
    // --- QUẢN LÝ THÔNG TIN QUÁN ---

    /**
     * Lấy thông tin quán theo ID chủ sở hữu
     */
    getRestaurantByOwner: (ownerId) => {
        return axiosClient.get(`/restaurant/owner/${ownerId}`);
    },

    /**
     * Cập nhật thông tin quán (Tên, địa chỉ, mô tả...)
     */
    updateRestaurant: (id, data) => {
        return axiosClient.put(`/restaurant/${id}`, data);
    },

    /**
     * Upload ảnh nhà hàng/món ăn
     * @param {File} file - Đối tượng file từ input
     */
    uploadImage: (file) => {
        const formData = new FormData();
        formData.append('file', file);
        return axiosClient.post('/restaurant/upload', formData, {
=======
    // --- QUẢN LÝ THÔNG TIN NHÀ HÀNG (INFO) ---
    getRestaurantByOwner: (ownerId) => {
        const url = `/restaurant/owner/${ownerId}`;
        return axiosClient.get(url);
    },

    updateRestaurant: (resId, data) => {
        const url = `/restaurant/${resId}`;
        return axiosClient.put(url, data);
    },

    uploadResImage: (file) => {
        const url = `/restaurant/upload`;
        const formData = new FormData();
        formData.append('file', file);
        return axiosClient.post(url, formData, {
>>>>>>> origin/main
            headers: { 'Content-Type': 'multipart/form-data' }
        });
    },

<<<<<<< HEAD
    // --- QUẢN LÝ SHIPPER CỦA QUÁN ---

    /**
     * Lấy danh sách shipper thuộc quán
     */
    getShippers: (resId) => {
        return axiosClient.get(`/restaurant/${resId}/shippers`);
    },

    /**
     * Cập nhật trạng thái shipper (ONLINE, OFFLINE, BUSY...)
     */
    updateShipperStatus: (shipperId, status) => {
        // Vì Backend dùng @RequestParam nên truyền qua params của axios
        return axiosClient.put(`/restaurant/shipper/${shipperId}/status`, null, {
            params: { status }
        });
    },

    // --- QUẢN LÝ ĐÁNH GIÁ (REVIEWS) ---

    /**
     * Lấy danh sách đánh giá của quán
     */
    getReviews: (resId) => {
        return axiosClient.get(`/reviews/restaurant/${resId}`);
    },

    /**
     * Gửi phản hồi đánh giá (Hoặc khách hàng tạo đánh giá)
     */
    createReview: (reviewData) => {
        return axiosClient.post('/reviews', reviewData);
    },

    // --- QUẢN LÝ VOUCHER (DÀNH CHO ADMIN/QUÁN) ---

    /**
     * Lấy toàn bộ danh sách voucher
     */
    getAllVouchers: () => {
        return axiosClient.get('/admin/vouchers');
    },

    /**
     * Lấy voucher có hiệu lực dựa trên giá trị giỏ hàng
     */
    getAvailableVouchers: (cartValue) => {
        return axiosClient.get('/admin/vouchers/available', {
            params: { cartValue }
        });
    },

=======
    // --- QUẢN LÝ ĐƠN HÀNG (ORDERS) ---
    getOrdersByResId: (resId) => {
        const url = `/orders/restaurant/${resId}`;
        return axiosClient.get(url);
    },

    updateOrderStatus: (orderId, status, shipperId = null) => {
        let url = `/orders/${orderId}/status?status=${status}`;
        if (shipperId) url += `&shipperId=${shipperId}`;
        return axiosClient.put(url);
    },

    getShippers: () => {
        return axiosClient.get('/admin/shippers');
    },

    // --- THỐNG KÊ DOANH THU (STATS) ---
    getRestaurantStats: (resId) => {
        const url = `/orders/restaurant/${resId}/stats`; 
        return axiosClient.get(url);
    },

    // --- QUẢN LÝ THỰC ĐƠN (MENU) ---
    getMenuByResId: (resId) => {
        const url = `/menu/restaurant/${resId}`;
        return axiosClient.get(url);
    },

    addMenuItem: (formData) => {
        const url = `/menu`;
        return axiosClient.post(url, formData, {
            headers: { 'Content-Type': 'multipart/form-data' }
        });
    },

    updateMenuItem: (itemId, formData) => {
        const url = `/menu/${itemId}`;
        return axiosClient.put(url, formData, {
            headers: { 'Content-Type': 'multipart/form-data' }
        });
    },

    deleteMenuItem: (itemId) => {
        const url = `/menu/${itemId}`;
        return axiosClient.delete(url);
    },

    toggleMenuStatus: (itemId) => {
        const url = `/menu/${itemId}/toggle`;
        return axiosClient.put(url);
    },

    getCategories: () => {
        return axiosClient.get('/categories');
    },

    getMenuItemById: (itemId) => {
        const url = `/menu/${itemId}`;
        return axiosClient.get(url);
    }
>>>>>>> origin/main
};

export default restaurantApi;