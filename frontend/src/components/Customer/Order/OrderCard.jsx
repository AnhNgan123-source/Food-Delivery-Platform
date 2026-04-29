/* thẻ lịch sử đơn hàng */
import React from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './OrderCard.module.css'; // Import styles từ module

const OrderCard = ({ order, onReviewClick, onCancelClick }) => {
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

                {/* Hiển thị Voucher nếu có giảm giá */}
                {order.totalDiscount > 0 && (
                    <div className={styles.priceRow} style={{ color: '#2ecc71', fontWeight: '600' }}>
                        <span>
                            <i className="fas fa-tags" style={{ marginRight: '8px' }}></i>
                            Ưu đãi từ Voucher 
                            {/* Hiển thị mã code nếu Backend có trả về field voucherCode hoặc voucher.code */}
                            {order.voucherCode ? ` [${order.voucherCode}]` : (order.voucher?.code ? ` [${order.voucher.code}]` : '')}:
                        </span>
                        <span>-{(order.totalDiscount || 0).toLocaleString()}đ</span>
                    </div>
                )}
            </div>

            {/* Lý do hủy (nếu có) */}
            {order.orderStatus === 'CANCELLED' && (
                <div className={styles.cancelBox} style={{ backgroundColor: '#ff4d4f10', padding: '8px', borderRadius: '4px' }}>
                    <small style={{ color: '#ff4d4f', fontWeight: 'bold', display: 'block' }}>
                        <i className="fas fa-info-circle"></i> Chi tiết hủy đơn:
                    </small>
                    <p style={{ margin: '4px 0 0', fontSize: '13px', color: '#0a0a0a', fontStyle: 'italic' }}>
                        "{order.cancellationReason || "Đơn hàng đã bị hủy từ nhà hàng"}"
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

                    {(order.orderStatus === 'PENDING' || order.orderStatus === 'AWAITING_PAYMENT') && (
                        <button 
                            className={styles.cancelBtn} 
                            onClick={() => onCancelClick(order.orderId)}
                        >
                            <i className="fas fa-times-circle"></i> Hủy đơn
                        </button>
                    )}
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