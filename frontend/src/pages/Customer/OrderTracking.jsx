import React, { useEffect, useState, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import SockJS from 'sockjs-client';
import Stomp from 'stompjs';
import axiosClient from '../../api/axiosConfig'; 
import '../../style.css'; 

const OrderTracking = () => {
    const { orderId } = useParams();
    const navigate = useNavigate();
    
    // === STATE ===
    const [status, setStatus] = useState("PENDING");
    const [cancellationReason, setCancellationReason] = useState(""); // Thêm state này để không bị lỗi undefined
    
    const isConnected = useRef(false);
    const stompClientRef = useRef(null);

    const steps = ["PENDING", "CONFIRMED", "PREPARING", "SHIPPING", "COMPLETED"];
    const currentStepIndex = Math.max(0, steps.indexOf(status));

    useEffect(() => {
        // Kiểm tra quyền nhanh
        const token = localStorage.getItem('token');
        if (!token) { navigate('/'); return; }

        // BƯỚC 1: Lấy trạng thái thực tế từ DB dùng axiosClient
        const fetchCurrentStatus = async () => {
            try {
                // baseURL đã là /api/v1 nên chỉ cần gọi /orders/ID
                const result = await axiosClient.get(`/orders/${orderId}`);
                
                // AxiosClient mình sửa lúc nãy đã trả về thẳng data sạch
                if (result) {
                    setStatus(result.orderStatus);
                    if (result.cancellationReason) setCancellationReason(result.cancellationReason);
                }
            } catch (error) {
                console.error("Lỗi lấy trạng thái ban đầu:", error);
            }
        };

        fetchCurrentStatus();

        // BƯỚC 2: WebSocket (Giữ nguyên logic gốc của bạn)
        const socket = new SockJS('http://localhost:8080/ws-delivery');
        const client = Stomp.over(socket);
        client.debug = null;

        client.connect({}, () => {
            console.log(">>> [Tracking] WebSocket Đã thông!");
            isConnected.current = true;
            stompClientRef.current = client;

            client.subscribe(`/topic/order/${orderId}`, (message) => {
                if (message.body) {
                    // Tách chữ để lấy đúng trạng thái (Logic của bạn rất hay)
                    const [newStatus, reason] = message.body.split(':');
                    setStatus(newStatus);
                    if (reason) setCancellationReason(reason);
                }
            });
        }, (err) => {
            console.error("Lỗi kết nối WebSocket:", err);
        });

        return () => {
            if (isConnected.current && stompClientRef.current) {
                stompClientRef.current.disconnect();
                isConnected.current = false;
            }
        };
    }, [orderId, navigate]);

    const getStatusMessage = (s) => {
        const m = {
            "PENDING": "Hệ thống đang tiếp nhận đơn hàng...",
            "CONFIRMED": "Nhà hàng đã xác nhận đơn rồi nè!",
            "PREPARING": "Đầu bếp đang chuẩn bị món ăn cho bạn...",
            "SHIPPING": "Shipper đang trên đường giao đến bạn rồi nha!",
            "COMPLETED": "Đơn hàng đã được giao thành công. Chúc bạn ngon miệng!",
            "CANCELLED": "Hic, đơn hàng này đã bị hủy mất rồi..."
        };
        return m[s] || "Đang cập nhật...";
    };

    return (
        <div className="tracking-container">
            <div className="tracking-card">
                <button onClick={() => navigate('/home')} className="secondaryBtn" 
                        style={{marginBottom: '20px', padding: '8px 15px', cursor: 'pointer', borderRadius: '8px', border: 'none', background: '#323644', color: '#fff'}}>
                    ← Quay lại trang chủ
                </button>
                
                <h3>Trạng thái đơn hàng #{orderId}</h3>
                
                {/* Stepper giữ nguyên style cũ của bạn */}
                <div className="stepper-wrapper">
                    {steps.map((step, index) => (
                        <div key={step} className={`step-item ${index <= currentStepIndex ? 'active' : ''}`}>
                            <div className="step-dot"></div>
                            <div className="step-label" style={{fontSize: '10px'}}>{step}</div>
                            {index < steps.length - 1 && <div className="step-line"></div>}
                        </div>
                    ))}
                </div>

                <div className="status-message">
                    <h4 style={{color: status === 'CANCELLED' ? '#e74c3c' : '#4CAF50', fontSize: '18px'}}>
                        {getStatusMessage(status)}
                    </h4>
                    
                    {/* Hiển thị lý do nếu bị hủy */}
                    {status === 'CANCELLED' && cancellationReason && (
                        <p style={{color: '#e74c3c', fontStyle: 'italic'}}>Lý do: {cancellationReason}</p>
                    )}

                    <p style={{color: '#a0aec0'}}>Cảm ơn bạn đã tin tưởng Yummy Hub! 🌸</p>
                </div>
            </div>
        </div>
    );
};

export default OrderTracking;