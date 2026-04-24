import React, { useState, useEffect, useCallback} from 'react';
import restaurantApi from '../../api/restaurantApi';
import RestaurantOrders from '../../components/Restaurant/Orders/RestaurantOrders';

// 1. IMPORT THƯ VIỆN WEBSOCKET
import SockJS from 'sockjs-client';
import { Stomp } from '@stomp/stompjs';

const RestaurantOrdersPage = () => {
    const [orders, setOrders] = useState([]);
    const [shippers, setShippers] = useState([]);
    const [selectedOrder, setSelectedOrder] = useState(null);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('ALL');
    const [selectedShipperId, setSelectedShipperId] = useState("");

    const resId = localStorage.getItem('resId');

    // 1. Bọc fetchOrders vào useCallback để không render nhiều lần
    const fetchOrders = useCallback(async () => {
        setLoading(true);
        try {
            const result = await restaurantApi.getOrdersByResId(resId);
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
    }, [resId, selectedOrder]); // Chỉ tạo lại khi resId hoặc selectedOrder đổi

   useEffect(() => {
    if (!resId) return;

    const socket = new SockJS('http://localhost:8080/ws-delivery');
    // FIX LỖI FACTORY: Dùng () => socket
    const stompClient = Stomp.over(() => socket);

    // Tắt mấy cái log linh tinh của thư viện cho đỡ rối mắt
    stompClient.debug = () => {}; 

    stompClient.connect({}, (frame) => {
        // Chỉ in log khi thực sự kết nối thành công
        console.log("=== KẾT NỐI WEBSOCKET THÀNH CÔNG ===");

        stompClient.subscribe(`/topic/restaurant/${resId}`, (message) => {
            // 1. Phát tiếng chuông ngay lập tức
            const audio = new Audio('/sounds/ting.mp3');
            audio.play().catch(e => console.log("Âm thanh bị chặn"));
            // 2. Hiện thông báo
            const newOrder = JSON.parse(message.body); 
            alert(`CÓ ĐƠN HÀNG MỚI: #${newOrder.orderId}`);
            // 3. Load lại danh sách
            fetchOrders();
        });
    }, (error) => {
        console.error("Lỗi kết nối WebSocket rồi", error);
    });

    // QUAN TRỌNG: Hàm dọn dẹp khi rời trang để không bị lỗi kết nối rác
    return () => {
        if (stompClient && stompClient.connected) {
            stompClient.disconnect(() => {
                console.log("Đã ngắt kết nối WebSocket");
            });
        }
    };
}, [resId]); // Chỉ chạy lại khi resId thay đổi


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