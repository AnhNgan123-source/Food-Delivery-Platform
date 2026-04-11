import React, { useEffect, useState, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import SockJS from 'sockjs-client';
import Stomp from 'stompjs';
import '../style.css'; 

const OrderTracking = () => {
    const { orderId } = useParams();
    const navigate = useNavigate();
    const [status, setStatus] = useState("PENDING");
    
    const isConnected = useRef(false);
    const stompClientRef = useRef(null);

    const steps = ["PENDING", "CONFIRMED", "PREPARING", "SHIPPING", "COMPLETED"];
    const currentStepIndex = Math.max(0, steps.indexOf(status));

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (!token) {
            navigate('/');
            return;
        }

        //BƯỚC 1: Lấy trạng thái thực tế từ Database ngay khi vừa vào trang
        const fetchCurrentStatus = async () => {
            try {
                // Sếp check lại đường dẫn API này ở Backend nhé
                const response = await fetch(`http://localhost:8080/api/v1/orders/${orderId}`, {
                    headers: { 'Authorization': 'Bearer ' + token }
                });
                const result = await response.json();
                
                // Nếu Backend trả về thành công, cập nhật status ngay
                if (response.ok && result.data) {
                    setStatus(result.data.orderStatus);
                }
            } catch (error) {
                console.error("Lỗi lấy trạng thái ban đầu:", error);
            }
        };

        fetchCurrentStatus();

        //BƯỚC 2: Thiết lập kết nối WebSocket để nghe các thay đổi "tiếp theo"
        const socket = new SockJS('http://localhost:8080/ws-delivery');
        const client = Stomp.over(socket);
        client.debug = null;

        client.connect({}, () => {
            console.log(">>> [Tracking] WebSocket Đã thông!");
            isConnected.current = true;
            stompClientRef.current = client;

            client.subscribe(`/topic/order/${orderId}`, (message) => {
                if (message.body) {
                    console.log("Cập nhật trạng thái mới:", message.body);
                    const [newStatus, reason] = message.body.split(':');//tách chữ để lấy đúng trạng thái
                    // Cập nhật status để React tự động vẽ lại giao diện (Re-render)
                    setStatus(newStatus);
                    // Nếu có làm thêm lý do hủy thì lưu vào state riêng
                    if (reason) {
                        setCancellationReason(reason); 
                    }
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
            "CANCELLED": "Đơn hàng đã bị hủy rồi"
        };
        return m[s] || "Đang cập nhật...";
    };

    return (
        <div className="tracking-container">
            <div className="tracking-card">
                <button onClick={() => navigate('/home')} className="secondaryBtn" 
                        style={{marginBottom: '20px', padding: '8px 15px', cursor: 'pointer', borderRadius: '8px'}}>
                    ← Quay lại trang chủ
                </button>
                
                <h3>Trạng thái đơn hàng #{orderId}</h3>
                
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
                    <h4 style={{color: '#4CAF50', fontSize: '18px'}}>{getStatusMessage(status)}</h4>
                    <p style={{color: '#a0aec0'}}>Cảm ơn bạn đã tin tưởng Yummy Hub! 🌸</p>
                </div>
            </div>
        </div>
    );
};

export default OrderTracking;