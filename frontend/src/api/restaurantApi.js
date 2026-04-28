import axiosClient from './axiosConfig';

const restaurantApi = {
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
            headers: { 'Content-Type': 'multipart/form-data' }
        });
    },

    // --- QUẢN LÝ ĐƠN HÀNG (ORDERS) ---
    getOrdersByResId: (resId) => axiosClient.get("/orders/restaurant/" + resId),

    updateOrderStatus: (orderId, status, shipperId = null) => {
        let url = `/orders/${orderId}/status?status=${status}`;
        if (shipperId) url += `&shipperId=${shipperId}`;
        return axiosClient.put(url);
    },

    getShippers: (resId) => {
    return axiosClient.get(`/orders/shippers-by-restaurant/${resId}`);
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
    },
    // Lấy danh sách đánh giá theo ID nhà hàng
    getReviewsByResId: (resId) => {
        const url = `/reviews/restaurant/${resId}`; 
        // Lưu ý: Nếu axiosConfig chưa có tiền tố /api/v1, bạn hãy thêm vào: `/api/v1/reviews/restaurant/${resId}`
        return axiosClient.get(url);
    },

    replyToReview: (reviewId, replyText) => {
    const url = `/reviews/${reviewId}/reply`;
    return axiosClient.put(url, { reply: replyText });
    },

    // restaurantApi.js
    getAverageRating: (resId) => {
        return axiosClient.get(`/reviews/restaurant/${resId}/average`);
    },


};

export default restaurantApi;