import axiosClient from './axiosConfig';

const customerApi = {
    /**
     * 1. Lấy danh sách tất cả nhà hàng đang hoạt động
     * Trả về: Array các Restaurant
     */
    getAllRestaurants: () => {
        return axiosClient.get('/restaurants');
    },

    /**
     * 2. Lấy thông tin chi tiết nhà hàng và Menu của quán đó
     * @param {Integer} resId - ID của nhà hàng
     * Trả về: { restaurant: {...}, menu: [...] }
     */
    getRestaurantMenu: (resId) => {
        return axiosClient.get(`/restaurants/${resId}`);
    },

    // --- CÁC TÍNH NĂNG GỢI Ý THÊM (CẦN BACKEND TƯƠNG ỨNG) ---

    /**
     * 3. Đặt đơn hàng mới
     * @param {Object} orderData - Dữ liệu đơn hàng (userId, resId, items, total, address...)
     */
    createOrder: (orderData) => {
        return axiosClient.post('/orders', orderData);
    },

    /**
     * 4. Xem lịch sử đơn hàng của cá nhân
     */
    getMyOrders: () => {
        return axiosClient.get('/orders/my-orders');
    },

    /**
     * 5. Tìm kiếm nhà hàng hoặc món ăn theo từ khóa
     */
    search: (keyword) => {
        return axiosClient.get('/search', { params: { q: keyword } });
    },

    /**
     * 6. Lấy danh sách voucher khách hàng có thể sử dụng
     */
    getVouchers: () => {
        return axiosClient.get('/admin/vouchers/available');
    }
};

export default customerApi;