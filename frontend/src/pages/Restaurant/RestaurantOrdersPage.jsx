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


    const handleSelectOrder = (order) => {
    setSelectedOrder(order);
    setSelectedShipperId(""); };  // Reset ô chọn shipper để không bị dính đơn cũ


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
    const stompClient = Stomp.over(() => socket);

    // Tắt mấy cái log debug của thư viện cho đỡ rối console
    stompClient.debug = () => {}; 

    stompClient.connect({}, (frame) => {
        console.log("=== KẾT NỐI WEBSOCKET THÀNH CÔNG ===");

        // Đăng ký kênh nhận thông báo riêng cho nhà hàng này
        stompClient.subscribe(`/topic/restaurant/${resId}`, (message) => {
            const updatedOrder = JSON.parse(message.body);
            console.log("Dữ liệu WebSocket nhận được:", updatedOrder);

            // --- 1. XỬ LÝ THÔNG BÁO (SOUND & ALERT) ---
            if (updatedOrder.orderStatus === 'CANCELLED') {
                // Chỉ báo khi đơn bị hủy
                const audio = new Audio('/sounds/cancel.mp3');
                audio.play().catch(e => {});
                alert(`ĐƠN HÀNG #${updatedOrder.orderId} ĐÃ BỊ HỦY!`);
            } 
            else if (updatedOrder.orderStatus === 'PENDING') {
                // CHỈ báo "ĐƠN MỚI" khi trạng thái là PENDING (lúc khách vừa đặt xong)
                const audio = new Audio('/sounds/ting.mp3');
                audio.play().catch(e => {});
                alert(`CÓ ĐƠN HÀNG MỚI: #${updatedOrder.orderId}`);
            }
            // Các trạng thái khác như SHIPPING, CONFIRMED... sẽ chạy ngầm, không hiện alert gây phiền

            // --- 2. CẬP NHẬT DANH SÁCH ĐƠN HÀNG (SIDEBAR) ---
            setOrders(prevOrders => {
                const isExist = prevOrders.find(o => o.orderId === updatedOrder.orderId);
                if (isExist) {
                    // Nếu đơn đã có (cập nhật trạng thái), thì map lại phần tử đó
                    return prevOrders.map(o => o.orderId === updatedOrder.orderId ? updatedOrder : o);
                } else {
                    // Nếu là đơn mới hoàn toàn, đẩy lên đầu danh sách
                    return [updatedOrder, ...prevOrders];
                }
            });

            // --- 3. CẬP NHẬT KHUNG CHI TIẾT ĐANG XEM (CHI TIẾT BÊN PHẢI) ---
            setSelectedOrder(prev => {
                // Nếu đang mở xem đúng cái đơn vừa có thay đổi, thì cập nhật nó luôn
                if (prev?.orderId === updatedOrder.orderId) {
                    return updatedOrder;
                }
                return prev;
            });
        });
    }, (error) => {
        console.error("Lỗi kết nối WebSocket rồi:", error);
    });

    // HÀM DỌN DẸP: Khi rời trang hoặc resId đổi thì ngắt kết nối để tiết kiệm tài nguyên
    return () => {
        if (stompClient && stompClient.connected) {
            stompClient.disconnect(() => {
                console.log("Đã ngắt kết nối WebSocket an toàn");
            });
        }
    };
}, [resId]); // dependency resId là chuẩn bài

    const fetchShippers = useCallback(async () => {
        try {
            // Giả sử API nhận resId để lọc tài xế của quán đó
            const result = await restaurantApi.getShippers(resId); 
            setShippers(result.data || result || []);
        } catch (error) {
            console.error("Lỗi tải shipper:", error);
        }
    }, [resId]);

    // 2. Cập nhật useEffect để fetch cả Đơn và Shipper ban đầu
    useEffect(() => {
        if (resId) {
            fetchOrders();
            fetchShippers();
        }
    }, [resId, fetchOrders, fetchShippers]);

    const handleUpdateStatus = async (orderId, newStatus, shipperId = null) => {
    try {
        setLoading(true); // Hiện loading để tránh bấm nhầm
        
        // 1. Gọi API cập nhật trạng thái đơn & gán shipper
        // Backend PHẢI xử lý: Update Order status, Update Shipper status = BUSY
        await restaurantApi.updateOrderStatus(orderId, newStatus, shipperId);

        // 2. QUAN TRỌNG: Gọi lại cả 2 hàm lấy dữ liệu mới nhất từ DATABASE
        // Việc này đảm bảo thông tin Shipper được lưu vĩnh viễn vào danh sách orders
        await fetchOrders(); 
        await fetchShippers();

        // 3. Cập nhật lại cái Đơn đang xem để nó hiện Shipper ngay lập tức
        // Mình tìm lại đơn vừa update trong danh sách mới nhất
        setOrders(prevOrders => {
            const updatedList = [...prevOrders];
            const targetOrder = updatedList.find(o => o.orderId === orderId);
            if (targetOrder) setSelectedOrder(targetOrder);
            return updatedList;
        });

        // 4. Reset ô chọn shipper về rỗng cho những đơn sau này
        setSelectedShipperId("");

        alert("Thao tác thành công!");
    } catch (error) {
        console.error("Lỗi cập nhật:", error);
        alert("Có lỗi xảy ra, vui lòng thử lại!");
    } finally {
        setLoading(false);
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
            setSelectedOrder={handleSelectOrder}
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