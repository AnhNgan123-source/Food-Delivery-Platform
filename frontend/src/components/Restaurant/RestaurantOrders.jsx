import React, { useState, useEffect } from 'react';

const RestaurantOrders = () => {
    const [orders, setOrders] = useState([]);
    const [selectedOrder, setSelectedOrder] = useState(null);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('ALL');
    
    const resId = localStorage.getItem('resId');
    const token = localStorage.getItem('token');

    useEffect(() => {
        fetchOrders();
    }, []);

    const fetchOrders = async () => {
        setLoading(true);
        try {
            const response = await fetch(`http://localhost:8080/api/v1/orders/restaurant/${resId}`, {
                headers: { "Authorization": `Bearer ${token}` }
            });
            const result = await response.json();
            if (result.status === "success") {
                const sorted = (result.data || []).sort((a, b) => (b.order_id || b.orderId) - (a.order_id || a.orderId));
                setOrders(sorted);
                if (sorted.length > 0 && !selectedOrder) setSelectedOrder(sorted[0]);
            }
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const updateStatus = async (orderId, newStatus) => {
        try {
            const response = await fetch(`http://localhost:8080/api/v1/orders/${orderId}/status?status=${newStatus}`, {
                method: 'PUT',
                headers: { "Authorization": `Bearer ${token}` }
            });
            if (response.ok) {
                setOrders(prev => prev.map(o => (o.order_id === orderId || o.orderId === orderId) ? { ...o, order_status: newStatus, orderStatus: newStatus } : o));
                setSelectedOrder(prev => ({ ...prev, order_status: newStatus, orderStatus: newStatus }));
            }
        } catch (error) {
            alert("Lỗi!");
        }
    };

    const filteredOrders = activeTab === 'ALL' ? orders : orders.filter(o => (o.order_status || o.orderStatus) === activeTab);

    const getStatusStyle = (status) => {
        const config = {
            'PENDING': { bg: '#FFF9C4', color: '#FBC02D', text: 'Chờ duyệt' },
            'CONFIRMED': { bg: '#E1F5FE', color: '#0288D1', text: 'Đã nhận' },
            'PREPARING': { bg: '#FBE9E7', color: '#FF5722', text: 'Đang nấu' },
            'SHIPPING': { bg: '#E8F5E9', color: '#388E3C', text: 'Đang giao' },
            'CANCELLED': { bg: '#FFEBEE', color: '#D32F2F', text: 'Đã hủy' },
            'COMPLETED': { bg: '#F3E5F5', color: '#7B1FA2', text: 'Hoàn thành' }
        };
        return config[status] || config['PENDING'];
    };

    const formatOrderTime = (timeStr) => {
        if (!timeStr) return "--:--";
        return new Date(timeStr).toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' });
    };

    return (
        <div style={{ display: 'flex', gap: '20px', height: 'calc(100vh - 40px)', padding: '20px', background: '#f8f9fa', fontFamily: "'Inter', sans-serif" }}>
            <style>
                {`
                    @keyframes pulse-orange {
                        0% { transform: scale(0.98); box-shadow: 0 0 0 0 rgba(255, 152, 0, 0.4); }
                        70% { transform: scale(1); box-shadow: 0 0 0 10px rgba(255, 152, 0, 0); }
                        100% { transform: scale(0.98); box-shadow: 0 0 0 0 rgba(255, 152, 0, 0); }
                    }
                    .waiting-animate { animation: pulse-orange 2s infinite; }
                `}
            </style>
            
            <div style={{ flex: '0 0 400px', display: 'flex', flexDirection: 'column', gap: '15px' }}>
                <div style={{ background: '#fff', padding: '20px', borderRadius: '16px', boxShadow: '0 4px 20px rgba(0,0,0,0.05)' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '15px' }}>
                        <h2 style={{ margin: 0, fontSize: '20px', fontWeight: 800 }}>Đơn hàng mới</h2>
                        <button onClick={fetchOrders} style={{ border: 'none', background: '#f0f0f0', padding: '8px 12px', borderRadius: '10px', cursor: 'pointer' }}><i className="fas fa-sync-alt"></i></button>
                    </div>
                    <div style={{ display: 'flex', gap: '8px', overflowX: 'auto', whiteSpace: 'nowrap', paddingBottom: '5px' }}>
                        {['ALL', 'PENDING', 'CONFIRMED', 'PREPARING', 'SHIPPING', 'COMPLETED'].map(tab => (
                            <button key={tab} onClick={() => setActiveTab(tab)} style={{ padding: '8px 15px', borderRadius: '10px', border: 'none', fontSize: '13px', fontWeight: 'bold', background: activeTab === tab ? '#28a745' : '#f5f5f5', color: activeTab === tab ? '#fff' : '#666', cursor: 'pointer', transition: '0.3s', flexShrink: 0 }}>
                                {tab === 'ALL' ? 'Tất cả' : getStatusStyle(tab).text}
                            </button>
                        ))}
                    </div>
                </div>

                <div style={{ flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '12px', paddingRight: '5px' }}>
                    {loading ? <p style={{textAlign:'center', color:'#999'}}>Đang tải...</p> : 
                     filteredOrders.map(order => {
                        const s = getStatusStyle(order.order_status || order.orderStatus);
                        const isSelected = (selectedOrder?.order_id || selectedOrder?.orderId) === (order.order_id || order.orderId);
                        return (
                            <div key={order.order_id || order.orderId} onClick={() => setSelectedOrder(order)} style={{ background: '#fff', padding: '16px', borderRadius: '16px', cursor: 'pointer', border: isSelected ? '2px solid #28a745' : '2px solid transparent', boxShadow: isSelected ? '0 10px 20px rgba(40,167,69,0.1)' : '0 2px 8px rgba(0,0,0,0.02)', transition: '0.3s' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
                                    <span style={{ fontWeight: 700, fontSize: '15px', color: '#333' }}><i className="far fa-clock" style={{marginRight: '6px', color: '#28a745'}}></i>{formatOrderTime(order.created_at || order.createdAt)}</span>
                                    <span style={{ fontSize: '11px', padding: '4px 8px', borderRadius: '6px', background: s.bg, color: s.color, fontWeight: 700 }}>{s.text}</span>
                                </div>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                    <span style={{ fontSize: '13px', color: '#666' }}>{order.items?.length || 0} món • {order.payment_method || order.paymentMethod}</span>
                                    <span style={{ fontWeight: 800, color: '#d32f2f', fontSize: '16px' }}>{(order.final_amount || order.finalAmount || 0).toLocaleString()}đ</span>
                                </div>
                            </div>
                        )
                    })}
                </div>
            </div>

            <div style={{ flex: 1, background: '#fff', borderRadius: '20px', boxShadow: '0 4px 25px rgba(0,0,0,0.05)', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
                {selectedOrder ? (
                    <>
                        <div style={{ padding: '25px', borderBottom: '1px solid #f0f0f0', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: '#fff' }}>
                            <div>
                                <h1 style={{ margin: 0, fontSize: '22px', fontWeight: 800 }}>Chi tiết đơn hàng</h1>
                                <span style={{ color: '#28a745', fontSize: '14px', fontWeight: 600 }}>Đặt lúc: {formatOrderTime(selectedOrder.created_at || selectedOrder.createdAt)}</span>
                            </div>
                            <div style={{ textAlign: 'right' }}>
                                <div style={{ fontSize: '20px', fontWeight: 800, color: '#28a745' }}>{(selectedOrder.final_amount || selectedOrder.finalAmount || 0).toLocaleString()}đ</div>
                                <div style={{ fontSize: '12px', color: '#ff9800', fontWeight: 600 }}>{getStatusStyle(selectedOrder.order_status || selectedOrder.orderStatus).text}</div>
                            </div>
                        </div>

                        <div style={{ flex: 1, overflowY: 'auto', padding: '25px' }}>
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '30px' }}>
                                <div style={{ background: '#f8f9fa', padding: '20px', borderRadius: '15px' }}>
                                    <h4 style={{ margin: '0 0 10px 0', color: '#555', fontSize: '13px', letterSpacing: '1px' }}>ĐỊA CHỈ GIAO HÀNG</h4>
                                    <p style={{ margin: 0, fontWeight: 600, lineHeight: 1.5, fontSize: '15px' }}>{selectedOrder.delivery_address || selectedOrder.deliveryAddress}</p>
                                </div>
                                <div style={{ background: '#f8f9fa', padding: '20px', borderRadius: '15px' }}>
                                    <h4 style={{ margin: '0 0 10px 0', color: '#555', fontSize: '13px', letterSpacing: '1px' }}>GHI CHÚ ĐƠN HÀNG</h4>
                                    <p style={{ margin: 0, color: '#d32f2f', fontWeight: 600, fontSize: '15px' }}>{selectedOrder.note || 'Không có ghi chú'}</p>
                                </div>
                            </div>

                            <h4 style={{ marginBottom: '15px', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '10px' }}>
                                <i className="fas fa-utensils" style={{color: '#28a745'}}></i> DANH SÁCH MÓN ĂN
                            </h4>
                            <div style={{ border: '1px solid #f0f0f0', borderRadius: '15px', overflow: 'hidden' }}>
                                {(selectedOrder.items || []).map((item, idx) => (
                                    <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', padding: '15px 20px', borderBottom: idx === selectedOrder.items.length - 1 ? 'none' : '1px solid #f4f4f4', alignItems: 'center' }}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                                            <div style={{ width: '30px', height: '30px', background: '#e8f5e9', color: '#28a745', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: '12px' }}>{item.quantity}</div>
                                            <span style={{ fontWeight: 600 }}>{item.itemName || `Món ăn`}</span>
                                        </div>
                                        <span style={{ fontWeight: 700 }}>{(item.priceAtOrder || 0).toLocaleString()}đ</span>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div style={{ padding: '20px 25px', background: '#fff', borderTop: '1px solid #f0f0f0', display: 'flex', gap: '15px' }}>
                            {renderSmartButtons(selectedOrder, updateStatus)}
                        </div>
                    </>
                ) : (
                    <div style={{ margin: 'auto', textAlign: 'center', color: '#ccc' }}>
                        <i className="fas fa-receipt" style={{ fontSize: '80px', marginBottom: '20px', opacity: 0.2 }}></i>
                        <p>Chọn một đơn hàng để xem chi tiết</p>
                    </div>
                )}
            </div>
        </div>
    );
};

const renderSmartButtons = (order, updateStatus) => {
    const status = order.order_status || order.orderStatus;
    const id = order.order_id || order.orderId;
    const btnBase = { flex: 1, padding: '16px', borderRadius: '12px', border: 'none', color: '#fff', fontWeight: 800, cursor: 'pointer', transition: '0.3s', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px', fontSize: '14px' };

    if (status === 'PENDING') return (
        <>
            <button style={{ ...btnBase, background: '#28a745' }} onClick={() => updateStatus(id, 'CONFIRMED')}><i className="fas fa-check"></i> XÁC NHẬN ĐƠN</button>
            <button style={{ ...btnBase, background: '#dc3545', flex: '0 0 140px' }} onClick={() => {
                const reason = window.prompt("Lý do từ chối đơn?");
                if (reason) updateStatus(id, 'CANCELLED');
            }}>TỪ CHỐI</button>
        </>
    );
    
    if (status === 'CONFIRMED') return <button style={{ ...btnBase, background: '#ff9800' }} onClick={() => updateStatus(id, 'PREPARING')}><i className="fas fa-fire"></i> BẮT ĐẦU CHẾ BIẾN</button>;
    
    if (status === 'PREPARING') return (
        <div className="waiting-animate" style={{ ...btnBase, background: 'linear-gradient(90deg, #ff9800, #f57c00)', cursor: 'default', boxShadow: '0 4px 15px rgba(255,152,0,0.3)' }}>
            <i className="fas fa-utensils fa-spin"></i>
            <span>ĐÃ NẤU XONG • CHỜ SHIPPER ĐẾN LẤY</span>
        </div>
    );

    if (status === 'SHIPPING') return (
        <div style={{ ...btnBase, background: '#0288d1', cursor: 'default' }}>
            <i className="fas fa-moped fa-beat"></i> SHIPPER ĐANG GIAO HÀNG...
        </div>
    );

    if (status === 'COMPLETED') return (
        <div style={{ ...btnBase, background: '#7b1fa2', cursor: 'default' }}>
            <i className="fas fa-check-circle"></i> ĐƠN HÀNG ĐÃ HOÀN TẤT
        </div>
    );

    return <div style={{ ...btnBase, background: '#9e9e9e', cursor: 'default' }}>ĐƠN HÀNG ĐÃ KẾT THÚC</div>;
};

export default RestaurantOrders;