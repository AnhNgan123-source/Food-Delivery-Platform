import React, { useState, useEffect } from 'react';
import restaurantApi from '../../api/restaurantApi';
import RestaurantOrders from '../../components/Restaurant/Orders/RestaurantOrders';

const RestaurantOrdersPage = () => {
    const [orders, setOrders] = useState([]);
    const [shippers, setShippers] = useState([]);
    const [selectedOrder, setSelectedOrder] = useState(null);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('ALL');
    const [selectedShipperId, setSelectedShipperId] = useState("");

    const resId = localStorage.getItem('resId');

    const fetchOrders = async () => {
        setLoading(true);
        try {
            const result = await restaurantApi.getOrdersByResId(resId);
            // axiosClient thường trả về trực tiếp response.data, 
            // check lại cấu trúc object backend của ông (result.status hoặc result trực tiếp)
            const data = result.status === "success" ? (result.data || []) : (result || []);
            
            const sortedData = [...data].sort((a, b) => b.orderId - a.orderId);
            setOrders(sortedData);
            
            if (sortedData.length > 0 && !selectedOrder) {
                setSelectedOrder(sortedData[0]);
            }
        } catch (error) {
            console.error("Lỗi tải đơn hàng:", error);
        } finally {
            setLoading(false);
        }
    };

    const fetchShippers = async () => {
        try {
            const result = await restaurantApi.getShippers();
            setShippers(result.data || result || []);
        } catch (error) {
            console.error("Lỗi tải shipper:", error);
        }
    };

    useEffect(() => {
        if (resId) {
            fetchOrders();
            fetchShippers();
        }
    }, [resId]);

    const handleUpdateStatus = async (orderId, newStatus, shipperId = null) => {
        try {
            await restaurantApi.updateOrderStatus(orderId, newStatus, shipperId);
            
            // Cập nhật UI local
            setOrders(prev => prev.map(o => o.orderId === orderId ? {...o, orderStatus: newStatus} : o));
            setSelectedOrder(prev => ({...prev, orderStatus: newStatus}));
            
            // Nếu giao cho shipper, nên reload để lấy thông tin shipper hiển thị
            if (newStatus === 'SHIPPING') fetchOrders();
            
            alert("Cập nhật trạng thái thành công!");
        } catch (error) {
            console.error("Lỗi cập nhật:", error);
            alert("Không thể cập nhật trạng thái đơn hàng");
        }
    };

    const filteredOrders = activeTab === 'ALL' 
        ? orders 
        : orders.filter(o => (o.orderStatus || o.order_status) === activeTab);

    return (
        <RestaurantOrders 
            orders={filteredOrders}
            shippers={shippers}
            selectedOrder={selectedOrder}
            setSelectedOrder={setSelectedOrder}
            activeTab={activeTab}
            setActiveTab={setActiveTab}
            onUpdateStatus={handleUpdateStatus}
            onRefresh={fetchOrders}
            selectedShipperId={selectedShipperId}
            setSelectedShipperId={setSelectedShipperId}
            loading={loading}
        />
    );
};

export default RestaurantOrdersPage;