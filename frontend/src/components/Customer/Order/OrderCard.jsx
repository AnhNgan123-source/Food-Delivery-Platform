/* thẻ lịch sử đơn hàng */
import React from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './OrderCard.module.css'; // Import styles từ module

const OrderCard = ({ order, onReviewClick }) => {
    const navigate = useNavigate();

    // Định dạng nhãn trạng thái
    const getStatusInfo = (status) => {
        const labels = {
            'PENDING': { text: 'CHỜ DUYỆT', color: '#f1c40f' },
            'CONFIRMED': { text: 'ĐÃ XÁC NHẬN', color: '#3498db' },
            'PREPARING': { text: 'ĐANG NẤU', color: '#9b59b6' },
            'SHIPPING': { text: 'ĐANG GIAO', color: '#e67e22' },
            'COMPLETED': { text: 'HOÀN TẤT', color: '#2ecc71' },
            'CANCELLED': { text: 'ĐÃ HỦY', color: '#e74c3c' }
        };
        return labels[status] || { text: status, color: '#fff' };
    };

    const statusInfo = getStatusInfo(order.orderStatus);

    return (
        <div className={styles.card}>
            {/* Header: Mã đơn & Trạng thái */}
            <div className={styles.header}>
                <div>
                    <span className={styles.orderIdText}>
                        Đơn hàng <span className={styles.orderIdHighlight}>#{order.orderId}</span>
                    </span>
                    <div className={styles.date}>
                        {order.createdAt ? new Date(order.createdAt).toLocaleString('vi-VN') : 'Vừa xong'}
                    </div>
                </div>
                <span className={styles.statusTag} style={{ 
                    color: statusInfo.color, 
                    border: `1px solid ${statusInfo.color}`,
                    backgroundColor: `${statusInfo.color}15` 
                }}>
                    ● {statusInfo.text}
                </span>
            </div>

            {/* Nội dung: Địa chỉ & Thanh toán */}
            <div className={styles.contentSection}>
                <div className={styles.infoRow}>
                    <i className="fas fa-map-marker-alt" style={{ color: '#e74c3c', width: '15px' }}></i>
                    {order.deliveryAddress || 'Chưa cập nhật địa chỉ'}
                </div>
                <div className={styles.infoRow}>
                    <i className="fas fa-credit-card" style={{ color: '#3498db', width: '15px' }}></i>
                    {order.paymentMethod === 'CASH' ? 'Tiền mặt (COD)' : 'Thanh toán Online'} 
                    <span style={{ color: '#2ecc71', marginLeft: '5px' }}>- {order.paymentStatus}</span>
                </div>
            </div>

            {/* Danh sách món ăn */}
            <div className={styles.itemsBox}>
                <p className={styles.itemsTitle}>Chi tiết món</p>
                {order.items?.map((item, idx) => {
                    const price = item.priceAtOrder || 0;
                    const qty = item.quantity || 0;
                    return (
                        <div key={idx} className={styles.itemLine}>
                            <span>
                                <b>{qty}x</b> {item.itemName || 'Món không tên'}
                            </span>
                            <span style={{ color: '#fff', fontWeight: '500' }}>{(price * qty).toLocaleString()}đ</span>
                        </div>
                    );
                })}
            </div>

            {/* Phí ship và Tạm tính */}
            <div className={styles.pricingSection}>
                <div className={styles.priceRow}>
                    <span>Tạm tính:</span>
                    <span>{(order.subtotal || 0).toLocaleString()}đ</span>
                </div>
                <div className={styles.priceRow}>
                    <span>Phí vận chuyển:</span>
                    <span>+{(order.shippingFee || 0).toLocaleString()}đ</span>
                </div>

                {order.totalDiscount > 0 && (
                <div className={styles.priceRow} style={{ color: '#2ecc71', fontWeight: '500' }}>
                    <span>
                        <i style={{ marginRight: '0px' }}></i>
                        Voucher {order.voucher?.code ? `(${order.voucher.code})` : ''}:
                    </span>
                    <span>-{(order.totalDiscount || 0).toLocaleString()}đ</span>
                </div>
    )}
            </div>

            {/* Lý do hủy (nếu có) */}
            {order.orderStatus === 'CANCELLED' && (
                <div className={styles.cancelBox}>
                    <small style={{ color: '#e74c3c', fontWeight: 'bold' }}>Lý do hủy:</small>
                    <p style={{ margin: 0, fontSize: '13px', color: '#fff' }}>
                        {order.cancellationReason || "Nhà hàng không thể phục vụ"}
                    </p>
                </div>
            )}

            {/* Footer: Tổng tiền & Nút hành động */}
            <div className={styles.footer}>
                <div style={{ textAlign: 'left' }}>
                    <span className={styles.totalLabel}>TỔNG THANH TOÁN</span>
                    <div className={styles.finalPrice}>
                        {(order.finalAmount || 0).toLocaleString()}đ
                    </div>
                </div>

                <div className={styles.actions}>
                    {order.orderStatus === 'COMPLETED' && (
                        <button onClick={() => onReviewClick(order)} className={styles.reviewBtn}>
                            <i className="fas fa-star"></i> Đánh giá
                        </button>
                    )}
                    <button 
                        onClick={() => navigate(`/order-tracking/${order.orderId}`)}
                        className={styles.trackingBtn}
                    >
                        <i className="fas fa-shipping-fast" style={{ marginRight: '5px' }}></i> Theo dõi
                    </button>
                    <button 
                        onClick={() => navigate(`/restaurant/${order.resId}`)}
                        className={styles.reorderBtn}
                    >
                        Đặt lại
                    </button>
                </div>
            </div>
        </div>
    );
};

export default OrderCard;