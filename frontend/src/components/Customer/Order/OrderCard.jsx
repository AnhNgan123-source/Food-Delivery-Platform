import React from 'react';

const OrderCard = ({ order, onUpdateStatus }) => {
    const getStatusLabel = (status) => {
        const labels = {
            'PENDING': 'CHỜ DUYỆT',
            'CONFIRMED': 'ĐÃ XÁC NHẬN',
            'PREPARING': 'ĐANG NẤU',
            'SHIPPING': 'ĐANG GIAO',
            'COMPLETED': 'HOÀN TẤT'
        };
        return labels[status] || status;
    };

    return (
        <div className="order-card-compact">
            <div className="card-header-compact">
                <span className="order-no">Đơn hàng <b>#{order.orderId}</b></span>
                <span className={`badge-status ${order.orderStatus.toLowerCase()}`}>
                    {getStatusLabel(order.orderStatus)}
                </span>
            </div>

            <div className="card-content-compact">
                {/* 1. Tên khách hàng */}
                <div className="info-item">
                    <i className="far fa-user"></i>
                    <span>{order.customerName || "Khách vãng lai"}</span>
                </div>
                {/* 2. Địa chỉ */}
                <div className="info-item">
                    <i className="far fa-map"></i>
                    <p>{order.deliveryAddress}</p>
                </div>
                
                {/*3.Phương thức thanh toán */}
                    <div className="info-item payment-method">
                        {order.paymentMethod === 'CASH' ? (
                            <>
                                <i className="fas fa-money-bill-wave" style={{ color: '#48bb78' }}></i>
                                <span style={{ color: '#48bb78', fontWeight: 'bold' }}>Tiền mặt (COD)</span>
                            </>
                        ) : (
                            <>
                                <i className="fas fa-credit-card" style={{ color: '#63b3ed' }}></i>
                                <span style={{ color: '#63b3ed', fontWeight: 'bold' }}>Đã thanh toán Online</span>
                            </>
                        )}
                    </div>
                {/*Hiển thị lý do hủy nếu đơn bị CANCELLED */}
                    {order.orderStatus === 'CANCELLED' && order.cancellationReason && (
                        <div className="cancel-reason-alert">
                            <i className="fas fa-exclamation-triangle"></i>
                        <div className="reason-content">
                            <label>Đơn hàng đã bị hủy</label>
                            <p>{order.cancellationReason}</p>
                         </div>
                        </div>
                    )}
                 {/*4. Chi tiết món ăn */}
                <div className="items-summary">
                    {order.items && order.items.map((item, idx) => (
                        <div key={idx} className="food-line">
                            <span className="qty">{item.quantity}x</span>
                            <span className="name">{item.itemName}</span>
                        </div>
                    ))}
                </div>
            </div>

            <div className="card-footer-compact">
                <div className="price-tag">
                    <label>TỔNG TIỀN</label>
                    <span>{order.finalAmount?.toLocaleString()}đ</span>
                </div>
    
                <div className="action-button-container">
                    {order.orderStatus === 'PENDING' && (
                    <>
                        <button className="btn-main prepare" onClick={() => onUpdateStatus(order.orderId, 'CONFIRMED')}>
                            <i className="fas fa-check-circle"></i> Xác nhận
                        </button>
                        <button className="btn-main cancel" 
                            style={{ background: '#e74c3c', color: 'white' }}
                            onClick={() => {
                            const reason = window.prompt("Lý do hủy đơn là gì vậy Ngân?");
                            if (reason) onUpdateStatus(order.orderId, 'CANCELLED', reason);
                        }}
                        >
                            <i className="fas fa-times-circle"></i> Hủy
                        </button>
                    </>
                    )}

                    {order.orderStatus === 'CONFIRMED' && (
                        <button className="btn-main prepare" onClick={() => onUpdateStatus(order.orderId, 'PREPARING')}>
                             <i className="fas fa-fire"></i> Chế biến
                        </button>
                    )}
                    {order.orderStatus === 'PREPARING' && (
                        <button className="btn-main ship" onClick={() => onUpdateStatus(order.orderId, 'SHIPPING')}>
                            <i className="fas fa-motorcycle"></i> Giao hàng
                        </button>
                    )}
                    {order.orderStatus === 'SHIPPING' && (
                        <button className="btn-main complete" onClick={() => onUpdateStatus(order.orderId, 'COMPLETED')}>
                             <i className="fas fa-check"></i> Hoàn tất
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
};

export default OrderCard;