import React, { useEffect, useState, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import SockJS from 'sockjs-client';
import Stomp from 'stompjs';
import '../../style.css';

const OrderTracking = () => {
    const { orderId } = useParams();
    const navigate = useNavigate();
    const [status, setStatus] = useState("PENDING");
    const [cancellationReason, setCancellationReason] = useState("");
    
    const isConnected = useRef(false);
    const stompClientRef = useRef(null);

    const steps = ["PENDING", "CONFIRMED", "PREPARING", "SHIPPING", "COMPLETED"];
    const currentStepIndex = steps.indexOf(status);

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (!token) { navigate('/'); return; }

        const fetchCurrentStatus = async () => {
            try {
                const response = await fetch(`http://localhost:8080/api/v1/orders/${orderId}`, {
                    headers: { 'Authorization': 'Bearer ' + token }
                });
                const result = await response.json();
                if (response.ok && result.data) {
                    setStatus(result.data.orderStatus);
                    if (result.data.cancellationReason) setCancellationReason(result.data.cancellationReason);
                }
            } catch (error) { console.error("Lỗi:", error); }
        };
        fetchCurrentStatus();

        const socket = new SockJS('http://localhost:8080/ws-delivery');
        const client = Stomp.over(socket);
        client.debug = null;
        client.connect({}, () => {
            isConnected.current = true;
            stompClientRef.current = client;
            client.subscribe(`/topic/order/${orderId}`, (message) => {
                if (message.body) {
                    const [newStatus, reason] = message.body.split(':');
                    setStatus(newStatus);
                    if (reason) setCancellationReason(reason);
                }
            });
        });

        return () => {
            if (isConnected.current && stompClientRef.current) stompClientRef.current.disconnect();
        };
    }, [orderId, navigate]);

    const getStatusMessage = (s) => {
        const m = {
            "PENDING": "Yummy Hub đang tiếp nhận đơn hàng của bạn...",
            "CONFIRMED": "Nhà hàng đã xác nhận và chuẩn bị nấu rồi nè!",
            "PREPARING": "Đầu bếp đang trổ tài, món ăn sắp xong rồi...",
            "SHIPPING": "Shipper đang phóng như bay đến chỗ bạn đó!",
            "COMPLETED": "Món ngon đã cập bến! Chúc bạn ngon miệng nhé 🌸",
            "CANCELLED": "Hic, đơn hàng này đã bị hủy mất rồi..."
        };
        return m[s] || "Đang cập nhật trạng thái...";
    };

    return (
        <div className="tracking-container">
            <div className="tracking-card">
                <button onClick={() => navigate(-1)} className="btn-main" style={{marginBottom: '20px', background: '#323644', color: '#fff'}}>
                    ← Quay lại
                </button>

                <h3 className="section-title" style={{border: 'none', textAlign: 'center'}}>Đơn hàng #{orderId}</h3>

                <div className="stepper-wrapper">
                    {steps.map((step, index) => (
                        <div key={step} className={`step-item ${index <= currentStepIndex ? 'active' : ''}`}>
                            <div className="step-dot"></div>
                            <div className="step-label">{step}</div>
                            {index < steps.length - 1 && <div className="step-line"></div>}
                        </div>
                    ))}
                </div>

                <div className="status-message">
                    <h4 style={{ color: status === 'CANCELLED' ? '#e74c3c' : '#2ecc71', fontSize: '18px' }}>
                        {getStatusMessage(status)}
                    </h4>
                    {status === 'CANCELLED' && cancellationReason && (
                        <div className="cancel-reason-alert">
                            <i className="fas fa-exclamation-circle"></i>
                            <div className="reason-content">
                                <label>Lý do hủy</label>
                                <p>{cancellationReason}</p>
                            </div>
                        </div>
                    )}
                    <p style={{ marginTop: '15px' }}>Cảm ơn bạn đã tin tưởng Yummy Hub! </p>
                </div>
            </div>
        </div>
    );
};

export default OrderTracking;