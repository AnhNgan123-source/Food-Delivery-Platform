import React, { useState, useEffect } from 'react';

const RestaurantOrders = () => {
    const [orders, setOrders] = useState([]);
    const [selectedOrder, setSelectedOrder] = useState(null);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('ALL');
    
    const [shippers, setShippers] = useState([]);
    const [selectedShipperId, setSelectedShipperId] = useState("");
    
    const resId = localStorage.getItem('resId');
    const token = localStorage.getItem('token');

    useEffect(() => {
        fetchOrders();
        fetchShippers();
    }, []);

    useEffect(() => {
        setSelectedShipperId("");
    }, [selectedOrder]);

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

    const fetchShippers = async () => {
        try {
            const response = await fetch(`http://localhost:8080/api/v1/admin/shippers`, {
                headers: { "Authorization": `Bearer ${token}` }
            });
            const result = await response.json();
            setShippers(result.data || result || []);
        } catch (error) {
            console.error("Lỗi lấy shipper:", error);
        }
    };

    const updateStatus = async (orderId, newStatus, shipperId = null) => {
        try {
            let url = `http://localhost:8080/api/v1/orders/${orderId}/status?status=${newStatus}`;
            if (shipperId) url += `&shipperId=${shipperId}`;

            const response = await fetch(url, {
                method: 'PUT',
                headers: { "Authorization": `Bearer ${token}` }
            });
            
            if (response.ok) {
                const updatedShipper = shippers.find(s => s.shipperId === parseInt(shipperId));
                
                setOrders(prev => prev.map(o => 
                    (o.order_id === orderId || o.orderId === orderId) 
                    ? { ...o, order_status: newStatus, orderStatus: newStatus, shipper: updatedShipper } 
                    : o
                ));
                
                setSelectedOrder(prev => ({ 
                    ...prev, 
                    order_status: newStatus, 
                    orderStatus: newStatus,
                    shipper: updatedShipper || prev.shipper
                }));
            }
        } catch (error) {
            alert("Lỗi cập nhật!");
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

    const renderActionButtons = () => {
        if (!selectedOrder) return null;
        const status = selectedOrder.order_status || selectedOrder.orderStatus;
        const id = selectedOrder.order_id || selectedOrder.orderId;
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
            <div style={{ display: 'flex', gap: '10px', width: '100%' }}>
                <select 
                    value={selectedShipperId}
                    onChange={(e) => setSelectedShipperId(e.target.value)}
                    style={{ flex: 1, padding: '12px', borderRadius: '12px', border: '2px solid #ff9800', fontWeight: 600, outline: 'none' }}
                >
                    <option value="">-- Chọn Shipper để giao --</option>
                    {shippers.map(s => <option key={s.shipperId} value={s.shipperId}>{s.shipperName} - {s.phone}</option>)}
                </select>
                <button 
                    disabled={!selectedShipperId}
                    style={{ ...btnBase, background: selectedShipperId ? '#28a745' : '#ccc', flex: '0 0 180px' }} 
                    onClick={() => updateStatus(id, 'SHIPPING', selectedShipperId)}
                >
                    <i className="fas fa-shipping-fast"></i> GIAO HÀNG
                </button>
            </div>
        );

        if (status === 'SHIPPING') return (
            <button style={{ ...btnBase, background: '#0288d1' }} onClick={() => updateStatus(id, 'COMPLETED')}>
                <i className="fas fa-check-double"></i> XÁC NHẬN ĐÃ GIAO XONG
            </button>
        );

        return (
            <div style={{ ...btnBase, background: getStatusStyle(status).bg, color: getStatusStyle(status).color, cursor: 'default' }}>
                <i className="fas fa-info-circle"></i> ĐƠN HÀNG {getStatusStyle(status).text.toUpperCase()}
            </div>
        );
    };

    return (
        <div style={{ display: 'flex', gap: '20px', height: 'calc(100vh - 40px)', padding: '20px', background: '#f8f9fa', fontFamily: "'Inter', sans-serif" }}>
            <div style={{ flex: '0 0 400px', display: 'flex', flexDirection: 'column', gap: '15px' }}>
                <div style={{ background: '#fff', padding: '20px', borderRadius: '16px', boxShadow: '0 4px 20px rgba(0,0,0,0.05)' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '15px' }}>
                        <h2 style={{ margin: 0, fontSize: '20px', fontWeight: 800 }}>Đơn hàng mới</h2>
                        <button onClick={fetchOrders} style={{ border: 'none', background: '#f0f0f0', padding: '8px 12px', borderRadius: '10px', cursor: 'pointer' }}><i className="fas fa-sync-alt"></i></button>
                    </div>
                    <div style={{ display: 'flex', gap: '8px', overflowX: 'auto', whiteSpace: 'nowrap', paddingBottom: '5px' }}>
                        {['ALL', 'PENDING', 'CONFIRMED', 'PREPARING', 'SHIPPING', 'COMPLETED'].map(tab => (
                            <button key={tab} onClick={() => setActiveTab(tab)} style={{ padding: '8px 15px', borderRadius: '10px', border: 'none', fontSize: '13px', fontWeight: 'bold', background: activeTab === tab ? '#28a745' : '#f5f5f5', color: activeTab === tab ? '#fff' : '#666', cursor: 'pointer', flexShrink: 0 }}>
                                {tab === 'ALL' ? 'Tất cả' : getStatusStyle(tab).text}
                            </button>
                        ))}
                    </div>
                </div>

                <div style={{ flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    {loading ? <p style={{textAlign:'center', color:'#999'}}>Đang tải...</p> : 
                     filteredOrders.map(order => {
                        const s = getStatusStyle(order.order_status || order.orderStatus);
                        const isSelected = (selectedOrder?.order_id || selectedOrder?.orderId) === (order.order_id || order.orderId);
                        // HIỂN THỊ TIỀN Ở DANH SÁCH BÊN TRÁI
                        const amount = order.final_amount || order.finalAmount || 0;
                        return (
                            <div key={order.order_id || order.orderId} onClick={() => setSelectedOrder(order)} style={{ background: '#fff', padding: '16px', borderRadius: '16px', cursor: 'pointer', border: isSelected ? '2px solid #28a745' : '2px solid transparent', boxShadow: '0 2px 8px rgba(0,0,0,0.02)' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
                                    <span style={{ fontWeight: 700, fontSize: '15px' }}><i className="far fa-clock" style={{color: '#28a745'}}></i> {formatOrderTime(order.created_at || order.createdAt)}</span>
                                    <span style={{ fontSize: '11px', padding: '4px 8px', borderRadius: '6px', background: s.bg, color: s.color, fontWeight: 700 }}>{s.text}</span>
                                </div>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                    <span style={{ fontSize: '13px', color: '#666' }}>{order.items?.length || 0} món</span>
                                    <span style={{ fontWeight: 800, color: '#d32f2f', fontSize: '16px' }}>{amount.toLocaleString()}đ</span>
                                </div>
                            </div>
                        )
                    })}
                </div>
            </div>

            <div style={{ flex: 1, background: '#fff', borderRadius: '20px', boxShadow: '0 4px 25px rgba(0,0,0,0.05)', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
                {selectedOrder ? (
                    <>
                        <div style={{ padding: '25px', borderBottom: '1px solid #f0f0f0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <div>
                                <h1 style={{ margin: 0, fontSize: '22px', fontWeight: 800 }}>Chi tiết đơn hàng</h1>
                                <span style={{ color: '#28a745', fontSize: '14px', fontWeight: 600 }}>#{selectedOrder.order_id || selectedOrder.orderId} - {formatOrderTime(selectedOrder.created_at || selectedOrder.createdAt)}</span>
                            </div>
                            <div style={{ textAlign: 'right' }}>
                                {/* HIỂN THỊ TIỀN Ở CHI TIẾT BÊN PHẢI */}
                                <div style={{ fontSize: '24px', fontWeight: 800, color: '#28a745' }}>
                                    {(selectedOrder.final_amount || selectedOrder.finalAmount || 0).toLocaleString()}đ
                                </div>
                                <div style={{ fontSize: '12px', color: '#ff9800', fontWeight: 600 }}>{getStatusStyle(selectedOrder.order_status || selectedOrder.orderStatus).text}</div>
                            </div>
                        </div>

                        <div style={{ flex: 1, overflowY: 'auto', padding: '25px' }}>
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '30px' }}>
                                <div style={{ background: '#f8f9fa', padding: '20px', borderRadius: '15px' }}>
                                    <h4 style={{ margin: '0 0 10px 0', color: '#555', fontSize: '11px', fontWeight: 800 }}>ĐỊA CHỈ GIAO HÀNG</h4>
                                    <p style={{ margin: 0, fontWeight: 600, fontSize: '14px' }}>{selectedOrder.delivery_address || selectedOrder.deliveryAddress}</p>
                                </div>
                                <div style={{ background: '#f8f9fa', padding: '20px', borderRadius: '15px' }}>
                                    <h4 style={{ margin: '0 0 10px 0', color: '#555', fontSize: '11px', fontWeight: 800 }}>THÔNG TIN SHIPPER</h4>
                                    {selectedOrder.shipper ? (
                                        <p style={{ margin: 0, fontWeight: 700, color: '#0288d1' }}>
                                            <i className="fas fa-user-motorcycle"></i> {selectedOrder.shipper.shipperName} <br/>
                                            <small>{selectedOrder.shipper.phone}</small>
                                        </p>
                                    ) : <p style={{ margin: 0, color: '#ccc' }}>Chưa gán shipper</p>}
                                </div>
                            </div>

                            <h4 style={{ marginBottom: '15px', fontWeight: 800 }}><i className="fas fa-utensils"></i> DANH SÁCH MÓN</h4>
                            <div style={{ border: '1px solid #f0f0f0', borderRadius: '15px' }}>
                                {(selectedOrder.items || []).map((item, idx) => (
                                    <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', padding: '15px 20px', borderBottom: idx === selectedOrder.items.length - 1 ? 'none' : '1px solid #f4f4f4' }}>
                                        <span><b>{item.quantity}x</b> {item.itemName}</span>
                                        <span style={{ fontWeight: 700 }}>{(item.priceAtOrder || 0).toLocaleString()}đ</span>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div style={{ padding: '20px 25px', background: '#fff', borderTop: '1px solid #f0f0f0', display: 'flex', gap: '15px' }}>
                            {renderActionButtons()}
                        </div>
                    </>
                ) : (
                    <div style={{ margin: 'auto', textAlign: 'center', color: '#ccc' }}>
                        <i className="fas fa-receipt" style={{ fontSize: '80px', opacity: 0.2 }}></i>
                        <p>Chọn đơn hàng để xử lý</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default RestaurantOrders;