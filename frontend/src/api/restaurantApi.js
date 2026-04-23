import axiosClient from './axiosConfig';

const restaurantApi = {
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
            headers: { 'Content-Type': 'multipart/form-data' }
        });
    },

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

};

export default restaurantApi;