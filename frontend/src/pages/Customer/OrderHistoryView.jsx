import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import customerApi from '../../api/customerApi';
import OrderCard from '../../components/Customer/Order/OrderCard';
import OrderList from '../../components/Customer/Order/OrderList';
import ReviewModal from '../../components/Customer/Modal/ReviewModal';
import styles from './OrderHistoryView.module.css';
import SockJS from 'sockjs-client';
import Stomp from 'stompjs';

const OrderHistoryView = () => {
    const navigate = useNavigate();
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);

    const [selectedOrder, setSelectedOrder] = useState(null); // Lưu đơn hàng đang được chọn để review
    const [isReviewOpen, setIsReviewOpen] = useState(false);
    
    // Lấy userId từ localStorage (Đảm bảo lúc Login đã setItem 'userId')
    const customerId = localStorage.getItem('userId');

    // 1. Hàm lấy dữ liệu từ API
    const fetchOrders = useCallback(async () => {
        if (!customerId) return;
        setLoading(true);
        try {
            const data = await customerApi.getMyOrders(customerId);
            
            if (Array.isArray(data)) {
                setOrders(data.sort((a, b) => b.orderId - a.orderId));
            } else if (data && data.data) {
                // Phòng trường hợp interceptor chưa bóc tách hết
                setOrders(data.data.sort((a, b) => b.orderId - a.orderId));
            }
        } catch (err) {
            console.error("Lỗi lấy đơn hàng:", err);
        } finally {
            setLoading(false);
        }
    }, [customerId]);

    const openReview = (order) => {
        setSelectedOrder(order);
        setIsReviewOpen(true);
    };

    useEffect(() => {
        // Gọi API lần đầu
        fetchOrders();

        // 2. Thiết lập WebSocket để cập nhật trạng thái "Sống"
        // Phải khớp với registerStompEndpoints: /ws-delivery
        const socket = new SockJS('http://localhost:8080/ws-delivery');
        const client = Stomp.over(socket);
        
        // Tắt log loằng ngoằng trong console cho sạch
        client.debug = null;

        client.connect({}, () => {
            console.log(">>> [WebSocket] Đã kết nối cổng /ws-delivery");
            
            // Đăng ký nhận thông báo thay đổi đơn hàng
            // Khớp với destination ở Backend: /topic/orders/{customerId}
            client.subscribe(`/topic/orders/${customerId}`, (message) => {
                if (message.body) {
                    const updatedOrder = JSON.parse(message.body);
                    console.log(">>> [WebSocket] Có cập nhật đơn hàng:", updatedOrder);
                    
                    // Cập nhật lại danh sách orders ngay lập tức mà không cần F5
                    setOrders(prevOrders => 
                        prevOrders.map(o => o.orderId === updatedOrder.orderId ? updatedOrder : o)
                    );
                }
            });
        }, (error) => {
            console.error(">>> [WebSocket] Lỗi kết nối:", error);
        });

        // Cleanup: Ngắt kết nối khi rời khỏi trang
        return () => {
            if (client && client.connected) {
                client.disconnect();
            }
        };
    }, [customerId, fetchOrders]);

    return (
    <main className={styles.historyContainer}>
        {/* Nút quay lại */}
        <div className={styles.backBtn} onClick={() => navigate('/home')}>
            <i className="fas fa-arrow-left"></i> QUAY LẠI TRANG CHỦ
        </div>

        {/* Header Row */}
        <div className={styles.headerRow}>
            <h3 className={styles.sectionTitle}>Lịch sử đơn hàng</h3>
            <button 
                onClick={fetchOrders} 
                className={styles.refreshBtn}
            >
                <i className={`fas fa-sync-alt ${loading ? styles.spinning : ''}`}></i> 
                Làm mới
            </button>
        </div>

        {/* Hiển thị danh sách hoặc Loading */}
        {loading ? (
            <div className={styles.loadingState}>
                <i className={`fas fa-spinner fa-spin ${styles.loadingIcon}`}></i>
                <p>Đang tải đơn hàng...</p>
            </div>
        ) : (
            <OrderList 
                orders={orders}
                onReviewClick={openReview}
                emptyMessage="Bạn chưa có đơn hàng nào cả!" 
            />
        )}

        {/* MODAL REVIEW */}
        <ReviewModal 
            isOpen={isReviewOpen}
            order={selectedOrder}
            onClose={() => setIsReviewOpen(false)}
            onReviewSuccess={fetchOrders}
        />
    </main>
);
};

export default OrderHistoryView;