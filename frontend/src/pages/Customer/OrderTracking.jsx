import React, { useEffect, useState, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import SockJS from 'sockjs-client';
import Stomp from 'stompjs';
<<<<<<< HEAD
import customerApi from '../../api/customerApi';
import styles from './OrderTracking.module.css'; 
=======
import axiosClient from '../../api/axiosConfig'; 
import '../../style.css'; 
>>>>>>> origin/main

const OrderTracking = () => {
    const { orderId } = useParams();
    const navigate = useNavigate();
    
    const [status, setStatus] = useState("PENDING");
    const [cancellationReason, setCancellationReason] = useState("");
    const stompClientRef = useRef(null);

    const steps = [
        { key: "PENDING", label: "Tiếp nhận", icon: "fas fa-file-invoice" },
        { key: "CONFIRMED", label: "Xác nhận", icon: "fas fa-check-circle" },
        { key: "PREPARING", label: "Chế biến", icon: "fas fa-utensils" },
        { key: "SHIPPING", label: "Đang giao", icon: "fas fa-motorcycle" },
        { key: "COMPLETED", label: "Đã giao", icon: "fas fa-box-open" }
    ];

    const currentStepIndex = steps.findIndex(s => s.key === status);

    useEffect(() => {
        const initData = async () => {
            try {
                const data = await customerApi.getOrderDetail(orderId);
                if (data) {
                    setStatus(data.orderStatus);
                    if (data.cancellationReason) setCancellationReason(data.cancellationReason);
                }
            } catch (error) { console.error(error); }
        };
        initData();

        const socket = new SockJS('http://localhost:8080/ws-delivery');
        const client = Stomp.over(socket);
        client.debug = null;
        client.connect({}, () => {
            stompClientRef.current = client;
            client.subscribe(`/topic/order/${orderId}`, (message) => {
                if (message.body) {
                    const [newStatus, reason] = message.body.split(':');
                    setStatus(newStatus);
                    if (reason) setCancellationReason(reason);
                }
            });
        });
        return () => { if (stompClientRef.current) stompClientRef.current.disconnect(); };
    }, [orderId]);

    const getStatusInfo = (s) => {
        const info = {
            "PENDING": { title: "Đang chờ xác nhận", desc: "Hệ thống đã nhận đơn của bạn." },
            "CONFIRMED": { title: "Đã xác nhận", desc: "Nhà hàng đang xem thực đơn." },
            "PREPARING": { title: "Đang chế biến", desc: "Món ăn đang được chuẩn bị tâm huyết!" },
            "SHIPPING": { title: "Đang giao hàng", desc: "Tài xế đang tăng tốc đến chỗ bạn." },
            "COMPLETED": { title: "Giao thành công", desc: "Chúc bạn ngon miệng nhé!" },
            "CANCELLED": { title: "Đã hủy đơn", desc: `Lý do: ${cancellationReason}` }
        };
        return info[s] || { title: "Đang cập nhật", desc: "Vui lòng chờ..." };
    };

    return (
        <div className={styles.newTrackingPage}>
            <div className={styles.trackingBlob}></div>
            <div className={styles.trackingBlob2}></div>
            
            <div className={styles.trackingWrapper}>
                <header className={styles.trackingHeader}>
                    <button onClick={() => navigate('/home')} className={styles.btnBack}>
                        <i className="fas fa-arrow-left"></i>
                    </button>
                    <div className={styles.headerInfo}>
                        <h2>Đơn hàng #{orderId}</h2>
                        <span className={styles.liveBadge}>● LIVE TRACKING</span>
                    </div>
                </header>

                <div className={styles.mainCard}>
                    <div className={styles.statusHero}>
                        <div className={`${styles.statusIconMain} ${status === 'CANCELLED' ? styles.cancelled : ''}`}>
                            <i className={status === 'CANCELLED' ? 'fas fa-times' : steps[Math.max(0, currentStepIndex)]?.icon}></i>
                        </div>
                        <h1 className={status === 'CANCELLED' ? styles.textRed : ''}>{getStatusInfo(status).title}</h1>
                        <p>{getStatusInfo(status).desc}</p>
                    </div>

                    {status !== 'CANCELLED' && (
                        <div className={styles.modernStepper}>
                            {steps.map((step, index) => (
                                <div key={step.key} className={`${styles.modernStep} ${index <= currentStepIndex ? styles.active : ''} ${index === currentStepIndex ? styles.pulse : ''}`}>
                                    <div className={styles.iconWrap}>
                                        <i className={step.icon}></i>
                                    </div>
                                    <span>{step.label}</span>
                                    {index < steps.length - 1 && <div className={styles.lineConnector}></div>}
                                </div>
                            ))}
                        </div>
                    )}

                    <div className={styles.cardFooter}>
                        <div className={styles.helpBox}>
                            <i className="fas fa-headset"></i>
                            <span>Cần hỗ trợ? Gọi 1900 1234</span>
                        </div>
                        <button className={styles.btnDetail} onClick={() => navigate('/orders')}>
                            Xem chi tiết hóa đơn
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default OrderTracking;