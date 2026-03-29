import React, { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';

const PaymentVNPay = () => {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const orderId = searchParams.get('orderId');
    const amount = searchParams.get('amount');

    const [timeLeft, setTimeLeft] = useState(600);

    useEffect(() => {
        const timer = setInterval(() => {
            setTimeLeft(prev => (prev > 0 ? prev - 1 : 0));
        }, 1000);
        return () => clearInterval(timer);
    }, []);

    const formatTime = (seconds) => {
        const m = Math.floor(seconds / 60);
        const s = seconds % 60;
        return `${m}:${s < 10 ? '0' : ''}${s}`;
    };

    // hàm chuyên trạng thái thanh toán
    const handleConfirmPayment = async () => {
    const token = localStorage.getItem('token');
    
    if (timeLeft === 0) {
        alert("Thời gian thanh toán đã hết, Ngân vui lòng đặt lại đơn mới nhé!");
        navigate('/home');
        return;
    }

    if (!orderId) {
        alert("Không tìm thấy mã đơn hàng!");
        return;
    }

    try {
        const response = await fetch(`http://localhost:8080/api/v1/orders/${orderId}/pay`, {
            method: 'PUT', // Khớp với markAsPaid ở Backend của Ngân
            headers: { 
                'Authorization': 'Bearer ' + token,
                'Content-Type': 'application/json' 
            }
        });

        if (response.status === 401 || response.status === 403) {
            alert("Phiên làm việc hết hạn!");
            navigate('/'); // Sửa lại cho khớp App.jsx của Ngân
            return;
        }
        
        const result = await response.json();

        if (result.status === 'success') {
            alert("Xác nhận thanh toán thành công! Đang chuyển đến trang theo dõi...");
            // Chuyển sang trang Tracking mà tụi mình vừa làm nè
            navigate(`/order-tracking/${orderId}`); 
        }
    } catch (error) {
        console.error("Lỗi:", error);
        alert("Lỗi kết nối server rồi sếp ơi!");
    }
};


    return (
        <div style={styles.container}>
            <div style={styles.paymentCard}>
                {/* Header với Badge Timer */}
                <div style={styles.header}>
                    <img 
                        src="./image/vnpay2.jpg" 
                        alt="VNPay" 
                        style={styles.vnpayLogo} 
                    />
                    <div style={styles.timerBadge}>
                        <i className="fas fa-clock" style={{marginRight: '5px'}}></i>
                        {formatTime(timeLeft)}
                    </div>
                </div>

                <div style={styles.orderSummary}>
                    <p style={styles.orderIdText}>Mã đơn hàng: <span style={{color: '#fff'}}>#{orderId}</span></p>
                    <p style={styles.label}>Số tiền cần thanh toán</p>
                    <h2 style={styles.totalAmount}>
                        {parseInt(amount).toLocaleString('vi-VN')} <span style={{fontSize: '18px'}}>đ</span>
                    </h2>
                </div>

                {/* QR Section với Khung quét */}
                <div style={styles.qrWrapper}>
                    <div style={styles.qrContainer}>
                        {/* 4 Góc trang trí cho QR */}
                        <div style={{...styles.corner, top: -2, left: -2, borderTop: '4px solid #0056b3', borderLeft: '4px solid #0056b3'}}></div>
                        <div style={{...styles.corner, top: -2, right: -2, borderTop: '4px solid #0056b3', borderRight: '4px solid #0056b3'}}></div>
                        <div style={{...styles.corner, bottom: -2, left: -2, borderBottom: '4px solid #0056b3', borderLeft: '4px solid #0056b3'}}></div>
                        <div style={{...styles.corner, bottom: -2, right: -2, borderBottom: '4px solid #0056b3', borderRight: '4px solid #0056b3'}}></div>
                        
                        <img 
                            src={`https://api.qrserver.com/v1/create-qr-code/?size=180x180&data=PAY_ORDER_${orderId}_AMT_${amount}`} 
                            alt="QR Code" 
                            style={styles.qrImage}
                        />
                    </div>
                    <p style={styles.qrInstruction}>Quét mã qua ứng dụng <b>Ngân hàng</b> hoặc <b>Ví VNPay</b></p>
                </div>

                <div style={styles.footerActions}>
                    <button style={styles.secondaryBtn} onClick={() => navigate('/home')}>
                        Hủy giao dịch
                    </button>
                    <button style={styles.primaryBtn} onClick={handleConfirmPayment}>
                        Xác nhận đã chuyển
                    </button>
                </div>

                <div style={styles.securityNote}>
                    <i className="fas fa-shield-alt"></i> Giao dịch an toàn & bảo mật bởi VNPay
                </div>
            </div>
        </div>
    );
};

const styles = {
    container: {
        backgroundColor: '#0f1014',
        minHeight: '100vh',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif"
    },
    paymentCard: {
        backgroundColor: '#1c1e26',
        width: '400px',
        borderRadius: '24px',
        padding: '32px',
        boxShadow: '0 20px 50px rgba(0,0,0,0.5)',
        textAlign: 'center',
        border: '1px solid #2d313d'
    },
    header: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '40px'
    },
    vnpayLogo: { height: '28px' },
    timerBadge: {
        backgroundColor: 'rgba(231, 76, 60, 0.15)',
        color: '#e74c3c',
        padding: '6px 12px',
        borderRadius: '20px',
        fontSize: '13px',
        fontWeight: 'bold',
        border: '1px solid rgba(231, 76, 60, 0.3)'
    },
    orderSummary: { marginBottom: '32px' },
    orderIdText: { color: '#888', fontSize: '14px', marginBottom: '8px' },
    label: { color: '#aaa', fontSize: '14px' },
    totalAmount: { color: '#2ecc71', fontSize: '36px', margin: '10px 0', textShadow: '0 0 15px rgba(46, 204, 113, 0.3)' },
    qrWrapper: {
        backgroundColor: '#fff',
        borderRadius: '20px',
        padding: '24px',
        marginBottom: '32px'
    },
    qrContainer: {
        position: 'relative',
        display: 'inline-block',
        padding: '10px',
        backgroundColor: '#fff'
    },
    corner: { position: 'absolute', width: '20px', height: '20px' },
    qrImage: { width: '180px', height: '180px', display: 'block' },
    qrInstruction: { color: '#444', fontSize: '13px', marginTop: '16px', lineHeight: '1.5' },
    footerActions: { display: 'flex', gap: '12px', marginBottom: '24px' },
    secondaryBtn: {
        flex: 1, padding: '14px', borderRadius: '12px', border: '1px solid #3d4251',
        backgroundColor: 'transparent', color: '#aaa', cursor: 'pointer', transition: '0.3s'
    },
    primaryBtn: {
        flex: 1, padding: '14px', borderRadius: '12px', border: 'none',
        backgroundColor: '#0056b3', color: '#fff', fontWeight: 'bold', cursor: 'pointer', boxShadow: '0 4px 15px rgba(0, 86, 179, 0.3)'
    },
    securityNote: { fontSize: '11px', color: '#5c6273', textTransform: 'uppercase', letterSpacing: '1px' }
};

export default PaymentVNPay;