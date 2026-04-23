import axiosClient from './axiosConfig';
<<<<<<< HEAD
import axios from 'axios'; 

const customerApi = {
    // 1. Nhà hàng & Menu
    getAllRestaurants: () => axiosClient.get('/restaurants'),
    getRestaurantMenu: (resId) => axiosClient.get(`/restaurants/${resId}`),

    // 2. Đơn hàng (Orders)
    createOrder: (orderData) => axiosClient.post('/orders', orderData),
    getMyOrders: (customerId) => axiosClient.get('/orders/history', { params: { customerId } }),
    getOrderDetail: (id) => axiosClient.get(`/orders/${id}`),
    
    // 3. Thanh toán & Trạng thái
    // Khớp với @PutMapping("/{orderId}/pay") ở Backend
    markAsPaid: (orderId) => axiosClient.put(`/orders/${orderId}/pay`),
    
    // 4. Tìm kiếm & Voucher
    search: (keyword) => axiosClient.get('/search', { params: { q: keyword } }),
    getVouchers: (subtotal) => axiosClient.get('/admin/vouchers/available', { 
        params: { cartValue: subtotal } 
    }),

    // 5. Cấu hình hệ thống (Sử dụng axios thuần để bypass Token nếu cần)
    getShippingConfig: () => {
        return axios.get('http://localhost:8080/api/v1/admin/shipping-config')
                    .then(res => res.data);
    },
    //
    // 6. Gửi đánh giá mới (Gửi kèm: orderId, resId, rating, comment)
    createReview: (reviewData) => axiosClient.post('/reviews', reviewData),

    // 7. Lấy danh sách đánh giá của một nhà hàng cụ thể
    getRestaurantReviews: (resId) => axiosClient.get(`/reviews/restaurant/${resId}`),
=======

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
>>>>>>> origin/main
};

export default customerApi;