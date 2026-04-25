import axiosClient from './axiosConfig';
import axios from 'axios'; 

const customerApi = {
    // 1. Nhà hàng & Menu
    getAllRestaurants: () => axiosClient.get('/restaurants'),
    getRestaurantMenu: (resId) => axiosClient.get(`/restaurants/${resId}`),

    // 2. Đơn hàng (Orders)
    createOrder: (orderData) => axiosClient.post('/orders', orderData),
    getMyOrders: (customerId) => axiosClient.get('/orders/history', { params: { customerId } }),
    getOrderDetail: (id) => axiosClient.get(`/orders/${id}`),
    cancelOrder: (orderId, reason) => axiosClient.put(`/orders/${orderId}/cancel`, null, {
    params: { reason: reason } // Gửi qua query param cho đơn giản
}),
    // 3. Thanh toán & Trạng thái
    // Khớp với @PutMapping("/{orderId}/pay") ở Backend
    markAsPaid: (orderId) => axiosClient.put(`/orders/${orderId}/pay`),
    
    // 4. Tìm kiếm & Voucher
    search: (keyword) => axiosClient.get('/search', { params: { q: keyword } }),
    getVouchers: (subtotal, userId) => axiosClient.get('/admin/vouchers/available', { 
    params: { 
        cartValue: subtotal,
        userId: userId 
    } 
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
};

export default customerApi;