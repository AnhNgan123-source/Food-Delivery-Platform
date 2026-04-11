import React from 'react';
import '../../style.css';

const OrderHistoryView = ({ orderHistory, navigate, setSelectedOrderReview, setIsReviewModalOpen, reviewedOrders }) => (
    <div className="main-layout">
        <h2 className="section-title">Đơn hàng của bạn</h2>
        <div className="orders-grid">
            {orderHistory.map(order => (
                <div key={order.orderId} className="order-card-compact">
                    <div className="card-header-compact">
                        <div className="order-no">ĐƠN HÀNG <b>#{order.orderId}</b></div>
                        <span className="badge-status">{order.orderStatus}</span>
                    </div>
                    
                    <div className="card-content-compact">
                        <div className="items-summary">
                            {order.items?.map((item, idx) => (
                                <div key={idx} className="food-line">
                                    <span className="qty">{item.quantity}x</span>
                                    <span>{item.itemName}</span>
                                </div>
                            ))}
                        </div>
                        <div className="payment-method">
                            <i className="fas fa-credit-card"></i> {order.paymentMethod}
                        </div>
                    </div>

                    <div className="card-footer-compact">
                        <div className="price-tag">
                            <label>Tổng tiền</label>
                            <span>{order.finalAmount?.toLocaleString()}đ</span>
                        </div>
                        <div style={{display: 'flex', gap: '8px'}}>
                            <button 
                                onClick={() => navigate(`/order-tracking/${order.orderId}`)} 
                                className="btn-main" 
                                style={{background: '#2ecc71', color: '#fff'}}
                            >Theo dõi</button>
                            
                            {order.orderStatus === 'COMPLETED' && !reviewedOrders.includes(order.orderId) && (
                                <button 
                                    onClick={() => { setSelectedOrderReview(order); setIsReviewModalOpen(true); }} 
                                    className="btn-main"
                                    style={{background: '#f1c40f', color: '#000'}}
                                >Đánh giá</button>
                            )}
                        </div>
                    </div>
                </div>
            ))}
        </div>
    </div>
);
export default OrderHistoryView;