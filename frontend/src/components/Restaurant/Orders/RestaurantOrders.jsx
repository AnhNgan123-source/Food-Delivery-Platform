import React from 'react';
import styles from './RestaurantOrders.module.css';

const RestaurantOrders = ({ 
    orders, shippers, selectedOrder, setSelectedOrder, 
    activeTab, setActiveTab, onUpdateStatus, onRefresh,
    selectedShipperId, setSelectedShipperId, loading 
}) => {

    const getStatusConfig = (status) => {
        const config = {
            'PENDING': { bg: '#FFF9C4', color: '#B78103', text: 'Chờ duyệt', icon: 'fa-clock' },
            'CONFIRMED': { bg: '#E1F5FE', color: '#0288D1', text: 'Đã xác nhận', icon: 'fa-check-circle' },
            'PREPARING': { bg: '#FFE8D6', color: '#FF6B00', text: 'Đang nấu', icon: 'fa-fire' },
            'SHIPPING': { bg: '#E2FBE7', color: '#05CD99', text: 'Đang giao', icon: 'fa-motorcycle' },
            'CANCELLED': { bg: '#FFF5F5', color: '#EE5D50', text: 'Đã hủy', icon: 'fa-times-circle' },
            'COMPLETED': { bg: '#F4F7FE', color: '#4318FF', text: 'Hoàn thành', icon: 'fa-flag-checkered' }
        };
        return config[status] || config['PENDING'];
    };

    const formatPrice = (amount) => (amount || 0).toLocaleString() + 'đ';

    return (
        <div className={styles.container}>
            {/* BÊN TRÁI: DANH SÁCH ĐƠN */}
            <div className={styles.sidebar}>
                <div className={styles.filterCard}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '15px', alignItems: 'center' }}>
                        <span style={{ fontWeight: 800, color: '#2b3674', fontSize: '18px' }}>Quản lý đơn</span>
                        <button onClick={onRefresh} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#4318FF' }}>
                            <i className="fas fa-sync-alt"></i>
                        </button>
                    </div>
                    <div className={styles.tabWrapper}>
                        {['ALL', 'PENDING', 'CONFIRMED', 'PREPARING', 'SHIPPING', 'COMPLETED'].map(tab => (
                            <button 
                                key={tab} 
                                onClick={() => setActiveTab(tab)}
                                className={`${styles.tabBtn} ${activeTab === tab ? styles.tabActive : ''}`}
                            >
                                {tab === 'ALL' ? 'Tất cả' : getStatusConfig(tab).text}
                            </button>
                        ))}
                    </div>
                </div>

                <div className={styles.orderList}>
                    {loading ? (
                        <div style={{ textAlign: 'center', padding: '20px', color: '#a3aed0' }}>Đang tải đơn hàng...</div>
                    ) : orders.map(order => {
                        const s = getStatusConfig(order.order_status || order.orderStatus);
                        const isSelected = (selectedOrder?.orderId || selectedOrder?.order_id) === (order.orderId || order.order_id);
                        return (
                            <div 
                                key={order.orderId || order.order_id} 
                                className={`${styles.orderItem} ${isSelected ? styles.orderItemActive : ''}`}
                                onClick={() => setSelectedOrder(order)}
                            >
                                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                                    <span style={{ fontWeight: 700, color: '#2b3674' }}>
                                        {new Date(order.createdAt).toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })}
                                    </span>
                                    <span style={{ fontSize: '11px', padding: '4px 10px', borderRadius: '8px', background: s.bg, color: s.color, fontWeight: 800 }}>
                                        {s.text}
                                    </span>
                                </div>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
                                    <span style={{ color: '#a3aed0', fontSize: '13px' }}>{order.items?.length || 0} món ăn</span>
                                    <span style={{ fontWeight: 800, color: '#4318FF', fontSize: '15px' }}>
                                        {formatPrice(order.finalAmount || order.final_amount)}
                                    </span>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>

            {/* BÊN PHẢI: CHI TIẾT */}
            <div className={styles.detailView}>
                {selectedOrder ? (
                    <>
                        <div className={styles.detailHeader}>
                            <div>
                                <h2 style={{ margin: 0, color: '#2b3674', fontWeight: 800 }}>Chi tiết đơn hàng</h2>
                                <span style={{ color: '#a3aed0', fontSize: '14px' }}>Cập nhật trạng thái và điều phối shipper</span>
                            </div>
                            <div style={{ textAlign: 'right' }}>
                                <div style={{ fontSize: '24px', fontWeight: 800, color: '#4318FF' }}>
                                    {formatPrice(selectedOrder.finalAmount || selectedOrder.final_amount)}
                                </div>
                                <div style={{ color: '#05CD99', fontWeight: 700, fontSize: '13px' }}>Thanh toán khi nhận hàng</div>
                            </div>
                        </div>

                        <div className={styles.detailContent}>
                            <div className={styles.infoGrid}>
                                <div className={styles.infoBox}>
                                    <div style={{ color: '#a3aed0', fontSize: '11px', fontWeight: 800, marginBottom: '8px', letterSpacing: '1px' }}>ĐỊA CHỈ GIAO</div>
                                    <div style={{ color: '#2b3674', fontWeight: 600, lineHeight: '1.5' }}>
                                        <i className="fas fa-map-marker-alt" style={{ marginRight: '8px', color: '#ff5b5b' }}></i>
                                        {selectedOrder.deliveryAddress || selectedOrder.delivery_address}
                                    </div>
                                </div>
                                <div className={styles.infoBox}>
                                    <div style={{ color: '#a3aed0', fontSize: '11px', fontWeight: 800, marginBottom: '8px', letterSpacing: '1px' }}>THÔNG TIN SHIPPER</div>
                                    {selectedOrder.shipper ? (
                                        <div style={{ color: '#2b3674', fontWeight: 700 }}>
                                            <i className="fas fa-user-ninja" style={{ marginRight: '8px', color: '#4318FF' }}></i>
                                            {selectedOrder.shipper.shipperName}
                                            <div style={{ fontWeight: 400, color: '#a3aed0', marginLeft: '22px', fontSize: '13px' }}>{selectedOrder.shipper.phone}</div>
                                        </div>
                                    ) : (
                                        <div style={{ color: '#cbd5e0', fontStyle: 'italic' }}>Chưa chỉ định shipper</div>
                                    )}
                                </div>
                            </div>

                            <h3 style={{ color: '#2b3674', fontSize: '16px', fontWeight: 800, marginBottom: '15px' }}>Món đã đặt</h3>
                            <table className={styles.itemTable}>
                                <tbody>
                                    {selectedOrder.items?.map((item, idx) => (
                                        <tr key={idx} className={styles.itemRow}>
                                            <td style={{ fontWeight: 700, color: '#4318FF', width: '40px' }}>{item.quantity}x</td>
                                            <td style={{ fontWeight: 600, color: '#2b3674' }}>{item.itemName || item.item_name}</td>
                                            <td style={{ textAlign: 'right', fontWeight: 700, color: '#2b3674' }}>
                                                {formatPrice(item.priceAtOrder || item.price_at_order)}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>

                        <div className={styles.actionFooter}>
                            {/* LOGIC NÚT BẤM */}
                            {(selectedOrder.orderStatus || selectedOrder.order_status) === 'PENDING' && (
                                <>
                                    <button className={styles.btnMain} style={{ background: '#05CD99', color: '#fff' }} onClick={() => onUpdateStatus(selectedOrder.orderId || selectedOrder.order_id, 'CONFIRMED')}>
                                        <i className="fas fa-check"></i> XÁC NHẬN ĐƠN
                                    </button>
                                    <button className={`${styles.btnMain} ${styles.btnCancel}`} onClick={() => onUpdateStatus(selectedOrder.orderId || selectedOrder.order_id, 'CANCELLED')}>
                                        HỦY ĐƠN
                                    </button>
                                </>
                            )}

                            {(selectedOrder.orderStatus || selectedOrder.order_status) === 'CONFIRMED' && (
                                <button className={styles.btnMain} style={{ background: '#FFB800', color: '#fff' }} onClick={() => onUpdateStatus(selectedOrder.orderId || selectedOrder.order_id, 'PREPARING')}>
                                    <i className="fas fa-fire"></i> BẮT ĐẦU CHẾ BIẾN
                                </button>
                            )}

                            {(selectedOrder.orderStatus || selectedOrder.order_status) === 'PREPARING' && (
                                <>
                                    <select 
                                        className={styles.selectShipper} 
                                        value={selectedShipperId} 
                                        onChange={(e) => setSelectedShipperId(e.target.value)}
                                    >
                                        <option value="">-- Chọn Shipper --</option>
                                        {shippers.map(s => <option key={s.shipperId} value={s.shipperId}>{s.shipperName}</option>)}
                                    </select>
                                    <button 
                                        disabled={!selectedShipperId} 
                                        className={styles.btnMain} 
                                        style={{ background: selectedShipperId ? '#4318FF' : '#e0e5f2', color: '#fff', flex: '0 0 200px' }} 
                                        onClick={() => onUpdateStatus(selectedOrder.orderId || selectedOrder.order_id, 'SHIPPING', selectedShipperId)}
                                    >
                                        <i className="fas fa-shipping-fast"></i> GIAO HÀNG
                                    </button>
                                </>
                            )}

                            {(selectedOrder.orderStatus || selectedOrder.order_status) === 'SHIPPING' && (
                                <button className={styles.btnMain} style={{ background: '#4318FF', color: '#fff' }} onClick={() => onUpdateStatus(selectedOrder.orderId || selectedOrder.order_id, 'COMPLETED')}>
                                    XÁC NHẬN HOÀN TẤT
                                </button>
                            )}
                        </div>
                    </>
                ) : (
                    <div style={{ margin: 'auto', textAlign: 'center' }}>
                        <img src="https://cdn-icons-png.flaticon.com/512/4076/4076549.png" width="120" style={{ opacity: 0.1, marginBottom: '20px' }} />
                        <p style={{ color: '#a3aed0', fontWeight: 600 }}>Chọn một đơn hàng để xem chi tiết</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default RestaurantOrders;