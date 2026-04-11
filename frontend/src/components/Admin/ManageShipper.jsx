import React, { useState, useEffect } from 'react';

const ManageShipper = () => {
    const [shippers, setShippers] = useState([]);
    const [pendingOrders, setPendingOrders] = useState([]);
    const [shippingOrders, setShippingOrders] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [formData, setFormData] = useState({ shipperName: '', phone: '', vehicleNo: '' });
    const token = localStorage.getItem('token');

    useEffect(() => { fetchData(); }, []);

    const fetchData = async () => {
        try {
            const resShippers = await fetch('http://localhost:8080/api/v1/admin/shippers', {
                headers: { "Authorization": `Bearer ${token}` }
            });
            const dataShippers = await resShippers.json();
            if (dataShippers.status === "success") setShippers(dataShippers.data);

            const resOrders = await fetch('http://localhost:8080/api/v1/orders/all', {
                headers: { "Authorization": `Bearer ${token}` }
            });
            const dataOrders = await resOrders.json();
            if (dataOrders.status === "success") {
                const all = dataOrders.data || [];
                setPendingOrders(all.filter(o => (o.orderStatus || o.status) === 'PREPARING'));
                setShippingOrders(all.filter(o => (o.orderStatus || o.status) === 'SHIPPING'));
            }
        } catch (err) { console.error(err); }
    };

    const handleAssign = async (orderId, shipperId) => {
        if (!shipperId) return;
        const res = await fetch(`http://localhost:8080/api/v1/orders/${orderId}/assign-shipper/${shipperId}`, {
            method: 'PUT', headers: { "Authorization": `Bearer ${token}` }
        });
        if (res.ok) fetchData();
    };

    const handleCompleteOrder = async (orderId) => {
        if (!window.confirm("Xác nhận hoàn tất đơn này?")) return;
        const res = await fetch(`http://localhost:8080/api/v1/orders/${orderId}/status?status=COMPLETED`, {
            method: 'PUT', headers: { "Authorization": `Bearer ${token}` }
        });
        if (res.ok) fetchData();
    };

    const formatTime = (timeStr) => {
        if (!timeStr) return "--:--";
        return new Date(timeStr).toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' });
    };

    return (
        <div style={container}>
            {/* Header thanh lịch */}
            <div style={topBar}>
                <div>
                    <h2 style={brandTitle}>HỆ THỐNG ĐIỀU PHỐI <span style={{color:'#2563eb'}}>SHIPPER</span></h2>
                    <p style={brandSub}>Bảng quản trị vận hành trực tiếp</p>
                </div>
                <button onClick={() => setShowModal(true)} style={btnPrimary}>+ THÊM TÀI XẾ</button>
            </div>

            <div style={layoutGrid}>
                {/* 1. BẢNG ĐƠN HÀNG CHỜ */}
                <div style={card}>
                    <div style={cardHead}>ĐƠN HÀNG CHỜ GIAO</div>
                    <div style={listScroll}>
                        {pendingOrders.map(order => (
                            <div key={order.orderId} style={orderRow}>
                                <div style={{width: '60px'}}><span style={timeLabel}>{formatTime(order.createdAt)}</span></div>
                                <div style={{flex: 1, padding: '0 15px'}}>
                                    <div style={addrTxt}>{order.deliveryAddress}</div>
                                    <div style={cashTxt}>{order.finalAmount?.toLocaleString()}đ</div>
                                </div>
                                <div style={actionBox}>
                                    <select id={`s-${order.orderId}`} style={miniSelect}>
                                        <option value="">Chọn tài xế...</option>
                                        {shippers.filter(s => s.status === 'IDLE').map(s => (
                                            <option key={s.shipperId} value={s.shipperId}>{s.shipperName}</option>
                                        ))}
                                    </select>
                                    <button onClick={() => handleAssign(order.orderId, document.getElementById(`s-${order.orderId}`).value)} style={btnAssign}>Giao</button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* 2. BẢNG TÀI XẾ */}
                <div style={card}>
                    <div style={cardHead}>TRẠNG THÁI TÀI XẾ</div>
                    <div style={listScroll}>
                        <table style={dataTab}>
                            <thead>
                                <tr style={thStyle}>
                                    <th style={{paddingLeft:'20px'}}>TÀI XẾ / SĐT</th>
                                    <th>BIỂN SỐ</th>
                                    <th style={{textAlign:'right', paddingRight:'20px'}}>TRẠNG THÁI</th>
                                </tr>
                            </thead>
                            <tbody>
                                {shippers.map(s => (
                                    <tr key={s.shipperId} style={trStyle}>
                                        <td style={{paddingLeft:'20px'}}>
                                            <div style={nameInfo}>
                                                <div style={avatar}>{s.shipperName.charAt(0)}</div>
                                                <div>
                                                    <div style={sName}>{s.shipperName}</div>
                                                    <div style={sPhone}>{s.phone}</div>
                                                </div>
                                            </div>
                                        </td>
                                        <td><span style={plateStyle}>{s.vehicleNo}</span></td>
                                        <td style={{textAlign:'right', paddingRight:'20px'}}>
                                            <span style={s.status === 'IDLE' ? dotIdle : dotBusy}>
                                                {s.status === 'IDLE' ? 'Sẵn sàng' : 'Đang bận'}
                                            </span>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            {/* 3. BẢNG GIÁM SÁT ĐƠN ĐANG CHẠY */}
            <div style={{...card, marginTop:'25px'}}>
                <div style={{...cardHead, background:'#10b981'}}>ĐƠN HÀNG ĐANG TRÊN ĐƯỜNG</div>
                <table style={dataTab}>
                    <thead>
                        <tr style={thStyle}>
                            <th style={{paddingLeft:'20px'}}>GIỜ ĐI</th>
                            <th>ĐỊA CHỈ CHI TIẾT</th>
                            <th>GIÁ TRỊ</th>
                            <th>SHIPPER PHỤ TRÁCH</th>
                            <th style={{textAlign:'center'}}>THAO TÁC ADMIN</th>
                        </tr>
                    </thead>
                    <tbody>
                        {shippingOrders.map(o => (
                            <tr key={o.orderId} style={trStyle}>
                                <td style={{paddingLeft:'20px'}}><span style={timeLabel}>{formatTime(o.createdAt)}</span></td>
                                <td style={addrTxtSm}>{o.deliveryAddress}</td>
                                <td style={cashTxtBold}>{o.finalAmount?.toLocaleString()}đ</td>
                                <td>
                                    <div style={activeShip}>
                                        <div style={avatarSm}>{shippers.find(s => s.shipperId === o.shipperId)?.shipperName.charAt(0)}</div>
                                        {shippers.find(s => s.shipperId === o.shipperId)?.shipperName}
                                    </div>
                                </td>
                                <td style={{textAlign:'center'}}>
                                    <button onClick={() => handleCompleteOrder(o.orderId)} style={btnConfirm}>XÁC NHẬN HOÀN TẤT</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Modal */}
            {showModal && (
                <div style={overlay}>
                    <div style={modalBody}>
                        <h3 style={{marginTop:0}}>Đăng ký Shipper</h3>
                        <input style={mInput} placeholder="Tên tài xế" onChange={e => setFormData({...formData, shipperName: e.target.value})} />
                        <input style={mInput} placeholder="Số điện thoại" onChange={e => setFormData({...formData, phone: e.target.value})} />
                        <input style={mInput} placeholder="Biển số xe" onChange={e => setFormData({...formData, vehicleNo: e.target.value})} />
                        <div style={{display:'flex', gap:'10px'}}>
                            <button onClick={() => setShowModal(false)} style={btnCancel}>Đóng</button>
                            <button style={btnPrimary}>Lưu hệ thống</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

// --- CSS SYSTEM CHUẨN ---
const container = { padding: '30px', background: '#f8fafc', minHeight: '100vh', fontFamily: '-apple-system, sans-serif' };
const topBar = { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '25px' };
const brandTitle = { margin: 0, fontSize: '20px', fontWeight: '800', color: '#1e293b' };
const brandSub = { margin: 0, fontSize: '13px', color: '#64748b' };
const layoutGrid = { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '25px' };

const card = { background: '#fff', borderRadius: '12px', border: '1px solid #e2e8f0', overflow: 'hidden', boxShadow: '0 1px 2px rgba(0,0,0,0.05)' };
const cardHead = { padding: '12px 20px', background: '#1e293b', color: '#fff', fontSize: '12px', fontWeight: '700', letterSpacing: '0.5px' };
const listScroll = { maxHeight: '450px', overflowY: 'auto' };

const orderRow = { display: 'flex', alignItems: 'center', padding: '15px 20px', borderBottom: '1px solid #f1f5f9' };
const timeLabel = { fontSize: '11px', fontWeight: '800', color: '#2563eb', background: '#eff6ff', padding: '3px 6px', borderRadius: '4px' };
const addrTxt = { fontSize: '13px', fontWeight: '600', color: '#334155', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' };
const cashTxt = { fontSize: '12px', color: '#dc2626', fontWeight: '700' };

const actionBox = { display: 'flex', gap: '8px' };
const miniSelect = { padding: '6px', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '12px', outline: 'none' };
const btnAssign = { background: '#2563eb', color: '#fff', border: 'none', padding: '6px 15px', borderRadius: '6px', fontWeight: '700', fontSize: '12px', cursor: 'pointer' };

const dataTab = { width: '100%', borderCollapse: 'collapse' };
const thStyle = { textAlign: 'left', background: '#f8fafc', fontSize: '11px', color: '#64748b', height: '40px' };
const trStyle = { borderBottom: '1px solid #f1f5f9', height: '64px' };

const nameInfo = { display: 'flex', alignItems: 'center', gap: '10px' };
const avatar = { width: '32px', height: '32px', background: '#e2e8f0', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: '700', fontSize: '13px', color: '#475569' };
const sName = { fontSize: '13px', fontWeight: '700', color: '#1e293b' };
const sPhone = { fontSize: '11px', color: '#94a3b8' };
const plateStyle = { background: '#f1f5f9', padding: '4px 8px', borderRadius: '4px', border: '1px solid #cbd5e1', fontFamily: 'monospace', fontWeight: '700', fontSize: '12px' };

const dotIdle = { color: '#16a34a', fontSize: '11px', fontWeight: '700', background: '#f0fdf4', padding: '4px 10px', borderRadius: '20px' };
const dotBusy = { color: '#ea580c', fontSize: '11px', fontWeight: '700', background: '#fff7ed', padding: '4px 10px', borderRadius: '20px' };

const addrTxtSm = { fontSize: '13px', color: '#475569', maxWidth: '300px' };
const cashTxtBold = { fontWeight: '800', fontSize: '14px', color: '#1e293b' };
const activeShip = { display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px', fontWeight: '600', color: '#2563eb' };
const avatarSm = { width: '24px', height: '24px', background: '#dbeafe', color: '#2563eb', borderRadius: '50%', fontSize: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: '800' };
const btnConfirm = { background: '#10b981', color: '#fff', border: 'none', padding: '8px 16px', borderRadius: '6px', fontSize: '11px', fontWeight: '700', cursor: 'pointer' };

const btnPrimary = { background: '#2563eb', color: '#fff', border: 'none', padding: '10px 20px', borderRadius: '8px', fontWeight: '700', cursor: 'pointer', fontSize: '13px' };
const overlay = { position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center' };
const modalBody = { background: '#fff', padding: '25px', borderRadius: '12px', width: '320px' };
const mInput = { width: '100%', padding: '10px', marginBottom: '10px', borderRadius: '6px', border: '1px solid #e2e8f0' };
const btnCancel = { background: '#f1f5f9', border: 'none', padding: '10px', borderRadius: '6px', flex: 1, cursor: 'pointer' };

export default ManageShipper;