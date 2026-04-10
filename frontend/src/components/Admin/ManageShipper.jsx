import React, { useState, useEffect } from 'react';

const ManageShipper = () => {
    const [shippers, setShippers] = useState([]);
    const [restaurants, setRestaurants] = useState([]); 
    const [showModal, setShowModal] = useState(false);
    const [formData, setFormData] = useState({ shipperName: '', phone: '', vehicleNo: '', resId: '' });
    const token = localStorage.getItem('token');

    useEffect(() => { 
        fetchShippers(); 
        fetchRestaurants();
    }, []);

    const fetchShippers = async () => {
        try {
            const res = await fetch('http://localhost:8080/api/v1/admin/shippers', {
                headers: { "Authorization": `Bearer ${token}` }
            });
            const data = await res.json();
            // Kiểm tra bọc dữ liệu của ResponseData (data.data)
            if (data.status === "success") setShippers(data.data || []);
            else if (Array.isArray(data)) setShippers(data);
        } catch (err) { console.error("Lỗi lấy ds shipper:", err); }
    };

    const fetchRestaurants = async () => {
        try {
            const res = await fetch('http://localhost:8080/api/v1/restaurants', {
                headers: { "Authorization": `Bearer ${token}` }
            });
            const data = await res.json();
            
            // FIX LỖI .MAP Ở ĐÂY: Kiểm tra kỹ định dạng trả về
            if (Array.isArray(data)) {
                setRestaurants(data);
            } else if (data && data.data && Array.isArray(data.data)) {
                setRestaurants(data.data);
            } else {
                setRestaurants([]); // Nếu không phải mảng thì gán mảng rỗng để tránh crash
            }
        } catch (err) { 
            console.error("Lỗi lấy ds nhà hàng:", err); 
            setRestaurants([]); 
        }
    };

    const handleSave = async () => {
        if (!formData.shipperName || !formData.resId) return alert("Vui lòng điền tên và chọn nhà hàng!");
        
        try {
            const res = await fetch('http://localhost:8080/api/v1/admin/shippers', {
                method: 'POST',
                headers: { 
                    "Authorization": `Bearer ${token}`,
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    shipperName: formData.shipperName,
                    phone: formData.phone,
                    vehicleNo: formData.vehicleNo,
                    restaurant: { resId: parseInt(formData.resId) }
                })
            });
            if (res.ok) {
                setShowModal(false);
                fetchShippers();
                setFormData({ shipperName: '', phone: '', vehicleNo: '', resId: '' });
            }
        } catch (err) { console.error(err); }
    };

    const handleDelete = async (id) => {
        if (!window.confirm("Xóa tài xế này khỏi hệ thống?")) return;
        const res = await fetch(`http://localhost:8080/api/v1/admin/shippers/${id}`, {
            method: 'DELETE', headers: { "Authorization": `Bearer ${token}` }
        });
        if (res.ok) fetchShippers();
    };

    return (
        <div style={container}>
            <div style={topBar}>
                <div>
                    <h2 style={brandTitle}>QUẢN LÝ NHÂN SỰ <span style={{color:'#2563eb'}}>SHIPPER</span></h2>
                    <p style={brandSub}>Admin quản lý danh sách tài xế toàn hệ thống</p>
                </div>
                <button onClick={() => setShowModal(true)} style={btnPrimary}>+ THÊM TÀI XẾ MỚI</button>
            </div>

            <div style={card}>
                <div style={cardHead}>DANH SÁCH TÀI XẾ CHI TIẾT</div>
                <table style={dataTab}>
                    <thead>
                        <tr style={thStyle}>
                            <th style={{paddingLeft:'20px'}}>TÀI XẾ / SĐT</th>
                            <th>THUỘC NHÀ HÀNG</th>
                            <th>BIỂN SỐ</th>
                            <th>TRẠNG THÁI</th>
                            <th style={{textAlign:'center', paddingRight:'20px'}}>THAO TÁC</th>
                        </tr>
                    </thead>
                    <tbody>
                        {shippers?.map(s => (
                            <tr key={s.shipperId} style={trStyle}>
                                <td style={{paddingLeft:'20px'}}>
                                    <div style={nameInfo}>
                                        <div style={avatar}>{s.shipperName?.charAt(0)}</div>
                                        <div>
                                            <div style={sName}>{s.shipperName}</div>
                                            <div style={sPhone}>{s.phone}</div>
                                        </div>
                                    </div>
                                </td>
                                <td style={resNameTxt}>{s.restaurant?.resName || "N/A"}</td>
                                <td><span style={plateStyle}>{s.vehicleNo}</span></td>
                                <td>
                                    <span style={s.status === 'IDLE' ? dotIdle : dotBusy}>
                                        {s.status === 'IDLE' ? 'Sẵn sàng' : 'Đang đi đơn'}
                                    </span>
                                </td>
                                <td style={{textAlign:'center', paddingRight:'20px'}}>
                                    <button onClick={() => handleDelete(s.shipperId)} style={btnDelete}>Xóa</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {showModal && (
                <div style={overlay}>
                    <div style={modalBody}>
                        <h3 style={{marginTop:0, fontSize:'18px'}}>Đăng ký Shipper</h3>
                        <p style={{fontSize:'12px', color:'#64748b', marginBottom:'15px'}}>Gán tài xế vào một nhà hàng cụ thể</p>
                        
                        <input style={mInput} placeholder="Tên tài xế" value={formData.shipperName} onChange={e => setFormData({...formData, shipperName: e.target.value})} />
                        <input style={mInput} placeholder="Số điện thoại" value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} />
                        <input style={mInput} placeholder="Biển số xe" value={formData.vehicleNo} onChange={e => setFormData({...formData, vehicleNo: e.target.value})} />
                        
                        <select style={mInput} value={formData.resId} onChange={e => setFormData({...formData, resId: e.target.value})}>
                            <option value="">-- Chọn nhà hàng quản lý --</option>
                            {/* Dùng Optional Chaining để an toàn tuyệt đối */}
                            {restaurants?.map(r => (
                                <option key={r.resId} value={r.resId}>{r.resName}</option>
                            ))}
                        </select>

                        <div style={{display:'flex', gap:'10px', marginTop:'10px'}}>
                            <button onClick={() => setShowModal(false)} style={btnCancel}>Hủy</button>
                            <button onClick={handleSave} style={btnPrimary}>Lưu vào hệ thống</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

// --- CSS SYSTEM --- (Giữ nguyên các style của sếp)
const container = { padding: '30px', background: '#f8fafc', minHeight: '100vh', fontFamily: 'Inter, sans-serif' };
const topBar = { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '25px' };
const brandTitle = { margin: 0, fontSize: '20px', fontWeight: '800', color: '#1e293b' };
const brandSub = { margin: 0, fontSize: '13px', color: '#64748b' };
const card = { background: '#fff', borderRadius: '12px', border: '1px solid #e2e8f0', overflow: 'hidden', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)' };
const cardHead = { padding: '15px 20px', background: '#1e293b', color: '#fff', fontSize: '12px', fontWeight: '700', letterSpacing: '1px' };
const dataTab = { width: '100%', borderCollapse: 'collapse' };
const thStyle = { textAlign: 'left', background: '#f8fafc', fontSize: '11px', color: '#64748b', height: '45px', textTransform: 'uppercase' };
const trStyle = { borderBottom: '1px solid #f1f5f9', height: '70px' };
const nameInfo = { display: 'flex', alignItems: 'center', gap: '12px' };
const avatar = { width: '36px', height: '36px', background: '#3b82f6', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: '700', color: '#fff' };
const sName = { fontSize: '14px', fontWeight: '700', color: '#1e293b' };
const sPhone = { fontSize: '12px', color: '#64748b' };
const resNameTxt = { fontSize: '13px', fontWeight: '600', color: '#2563eb' };
const plateStyle = { background: '#f1f5f9', padding: '5px 10px', borderRadius: '4px', border: '1px solid #cbd5e1', fontFamily: 'monospace', fontWeight: '700' };
const dotIdle = { color: '#16a34a', fontSize: '11px', fontWeight: '700', background: '#f0fdf4', padding: '4px 12px', borderRadius: '20px', border: '1px solid #bbf7d0' };
const dotBusy = { color: '#ea580c', fontSize: '11px', fontWeight: '700', background: '#fff7ed', padding: '4px 12px', borderRadius: '20px', border: '1px solid #fed7aa' };
const btnDelete = { background: '#fee2e2', color: '#dc2626', border: 'none', padding: '6px 12px', borderRadius: '6px', fontSize: '12px', fontWeight: '700', cursor: 'pointer' };
const btnPrimary = { background: '#2563eb', color: '#fff', border: 'none', padding: '10px 20px', borderRadius: '8px', fontWeight: '700', cursor: 'pointer' };
const overlay = { position: 'fixed', inset: 0, background: 'rgba(15, 23, 42, 0.7)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 };
const modalBody = { background: '#fff', padding: '30px', borderRadius: '16px', width: '380px', boxShadow: '0 20px 25px -5px rgba(0,0,0,0.1)' };
const mInput = { width: '100%', padding: '12px', marginBottom: '12px', borderRadius: '8px', border: '1px solid #e2e8f0', outline: 'none', boxSizing: 'border-box' };
const btnCancel = { background: '#f1f5f9', border: 'none', padding: '12px', borderRadius: '8px', flex: 1, cursor: 'pointer', fontWeight: '600' };

export default ManageShipper;