import axiosClient from './axiosConfig';

const adminApi = {
    // === QUẢN LÝ NHÀ HÀNG (AdminRestaurantController) ===
    getAllRestaurants: () => axiosClient.get('/admin/restaurants'),
    getRestaurantById: (id) => axiosClient.get(`/admin/restaurants/${id}`),
    getPendingRestaurants: () => axiosClient.get('/admin/restaurants/pending'),
    getActiveRestaurants: () => axiosClient.get('/admin/restaurants/active'),
    createRestaurant: (data) => axiosClient.post('/admin/restaurants', data),
    
    // Dùng cho cả sửa thông tin và Duyệt/Khóa (isActive)
    updateRestaurant: (id, data) => axiosClient.put(`/admin/restaurants/${id}`, data),
    
    deleteRestaurant: (id) => axiosClient.delete(`/admin/restaurants/${id}`),

    // === QUẢN LÝ SHIPPER (AdminShipperController) ===
    getAllShippers: () => axiosClient.get('/admin/shippers'),
    
    createShipper: (data) => axiosClient.post('/admin/shippers', data),
    
    deleteShipper: (id) => axiosClient.delete(`/admin/shippers/${id}`),

    // === CẤU HÌNH PHÍ SHIP (AdminShippingController) ===
    getShippingConfigs: () => axiosClient.get('/admin/shipping-config'),
    
    updateShippingConfigs: (configs) => axiosClient.post('/admin/shipping-config', configs),

    // === THỐNG KÊ - BÁO CÁO (AdminStatsController) ===
    getStatsOverview: () => axiosClient.get('/admin/stats/overview'),
    
    getRevenueHistory: () => axiosClient.get('/admin/stats/revenue-history'),
    
    getTopPerformers: () => axiosClient.get('/admin/stats/top-performers'),

    // === QUẢN LÝ VOUCHER (VoucherController) ===
    getAllVouchers: () => axiosClient.get('/admin/vouchers'),
    
    createVoucher: (data) => axiosClient.post('/admin/vouchers', data),
};

export default adminApi;