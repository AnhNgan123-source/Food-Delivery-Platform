import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Profile from './Profile';

// === 1. COMPONENT MODAL SỬA NHÀ HÀNG (BẢN DARK MODE) ===
const EditRestaurantModal = ({ resData, onClose, onSaveSuccess }) => {
    const [formData, setFormData] = useState({ ...resData });
    const noLogo = "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='250' height='250' viewBox='0 0 250 250'><rect width='250' height='250' fill='%232d313d'/><text x='50%25' y='50%25' font-family='Arial' font-size='14' fill='%23888' text-anchor='middle' dy='.3em'>No Image</text></svg>";

    const handleFileUpload = async (e) => {
        const file = e.target.files[0];
        if (!file) return;
        const uploadData = new FormData();
        uploadData.append('file', file);
        try {
            const response = await fetch(`http://localhost:8080/api/v1/restaurant/upload`, {
                method: 'POST',
                body: uploadData
            });
            if (response.ok) {
                const fileName = await response.text();
                setFormData(prev => ({ ...prev, resImage: fileName }));
            }
        } catch (error) { console.error("Lỗi upload:", error); }
    };

    const handleSave = async () => {
        try {
            const response = await fetch(`http://localhost:8080/api/v1/admin/restaurants/${formData.resId}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData)
            });
            if (response.ok) {
                onSaveSuccess();
                onClose();
            }
        } catch (error) { alert("Lỗi lưu dữ liệu!"); }
    };

    return (
        <div style={styles.modalOverlay}>
            <div style={styles.modalContent}>
                <div style={styles.modalHeader}>
                    <h3 style={styles.modalTitle}>Cập nhật nhà hàng</h3>
                    <button onClick={onClose} style={styles.closeBtn}>×</button>
                </div>
                <div style={{ display: 'flex', gap: '30px' }}>
                    <div style={{ textAlign: 'center' }}>
                        <div style={styles.imageBox}>
                            <img 
                                src={formData.resImage ? `http://localhost:8080/uploads/${formData.resImage}` : noLogo} 
                                alt="res" 
                                style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
                            />
                            <label style={styles.uploadLabel}>
                                <i className="fas fa-camera"></i>
                                <input type="file" onChange={handleFileUpload} style={{ display: 'none' }} />
                            </label>
                        </div>
                    </div>
                    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '20px' }}>
                        <div>
                            <label style={styles.inputLabel}>Tên nhà hàng</label>
                            <input 
                                style={styles.input}
                                value={formData.resName} 
                                onChange={e => setFormData({ ...formData, resName: e.target.value })} 
                            />
                        </div>
                        <div>
                            <label style={styles.inputLabel}>Địa chỉ chi tiết</label>
                            <textarea 
                                rows="3"
                                style={{...styles.input, resize: 'none'}}
                                value={formData.resAddress} 
                                onChange={e => setFormData({ ...formData, resAddress: e.target.value })} 
                            />
                        </div>
                    </div>
                </div>
                <div style={styles.modalFooter}>
                    <button style={styles.cancelBtn} onClick={onClose}>Hủy</button>
                    <button style={styles.saveBtn} onClick={handleSave}>Lưu dữ liệu</button>
                </div>
            </div>
        </div>
    );
};

// === 2. COMPONENT ADMIN CHÍNH ===
const Admin = () => {
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState('welcome');
    const [restaurants, setRestaurants] = useState([]);
    const [selectedRes, setSelectedRes] = useState(null);
    const [showEditModal, setShowEditModal] = useState(false);

    // ✅ LOGIC PHÍ SHIP TỪ BẢN 1
    const [shippingFees, setShippingFees] = useState([
        { areaName: 'Nội thành', price: 20000 },
        { areaName: 'Ngoại thành', price: 35000 }
    ]);

    useEffect(() => {
        const token = localStorage.getItem('token');
        const role = localStorage.getItem('role');
        if (!token || role !== 'ADMIN') navigate('/'); 
    }, [navigate]);

    const fetchRestaurants = async () => {
        try {
            const response = await fetch("http://localhost:8080/api/v1/admin/restaurants");
            if (response.ok) {
                const data = await response.json();
                setRestaurants(data);
            }
        } catch (error) { console.error("Lỗi:", error); }
    };

    // ✅ HÀM LẤY PHÍ SHIP TỪ DB (LOGIC BẢN 1)
    const fetchShippingFees = async () => {
        try {
            const response = await fetch("http://localhost:8080/api/v1/admin/shipping-config");
            if (response.ok) {
                const data = await response.json();
                if (data.length > 0) setShippingFees(data);
            }
        } catch (error) { console.error("Lỗi lấy phí ship:", error); }
    };

    useEffect(() => {
        if (activeTab === 'approve-res' || activeTab === 'manage-res') fetchRestaurants();
        if (activeTab === 'shipping-fee') fetchShippingFees();
    }, [activeTab]);

    const handleUpdateStatus = async (res, newStatus) => {
        try {
            const response = await fetch(`http://localhost:8080/api/v1/admin/restaurants/${res.resId}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ ...res, isActive: newStatus })
            });
            if (response.ok) fetchRestaurants();
        } catch (error) { alert("Lỗi!"); }
    };

    const handleDeleteRestaurant = async (resId) => {
        if (!window.confirm("Sếp chắc chắn muốn XÓA VĨNH VIỄN không?")) return;
        try {
            const response = await fetch(`http://localhost:8080/api/v1/admin/restaurants/${resId}`, { method: 'DELETE' });
            if (response.ok) { alert("Đã xóa xong!"); fetchRestaurants(); }
        } catch (error) { console.error(error); }
    };

    // ✅ HÀM LƯU PHÍ SHIP XUỐNG DB (LOGIC BẢN 1)
    const handleSaveShippingFees = async (e) => {
        try {
            const response = await fetch("http://localhost:8080/api/v1/admin/shipping-config", {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(shippingFees)
            });
            if (response.ok) alert("Đã cập nhật bảng giá phí ship thành công!");
        } catch (error) { alert("Lỗi lưu phí ship!"); }
    };

    const renderContent = () => {
        switch (activeTab) {
            case 'approve-res':
            case 'manage-res':
                const isApprove = activeTab === 'approve-res';
                const list = isApprove ? restaurants.filter(r => r.isActive === 0) : restaurants.filter(r => r.isActive === 1);
                return (
                    <div style={styles.sectionContainer}>
                        <div style={styles.sectionHeader}>
                            <div style={styles.statsLabel}>
                                {isApprove ? "Hồ sơ chờ duyệt: " : "Đang hoạt động: "}
                                <span style={{ color: '#2ecc71', fontWeight: 'bold' }}>{list.length}</span>
                            </div>
                            <button style={styles.refreshBtn} onClick={fetchRestaurants}>
                                <i className="fas fa-sync-alt"></i> Làm mới
                            </button>
                        </div>
                        <table style={styles.table}>
                            <thead>
                                <tr style={styles.tableHeadRow}>
                                    <th style={styles.tableTh}>ID</th>
                                    <th style={styles.tableTh}>Tên nhà hàng</th>
                                    <th style={styles.tableTh}>Trạng thái</th>
                                    <th style={{...styles.tableTh, textAlign: 'right'}}>Thao tác</th>
                                </tr>
                            </thead>
                            <tbody>
                                {list.map(res => (
                                    <tr key={res.resId} style={styles.tableRow}>
                                        <td style={styles.tableTd}>#{res.resId}</td>
                                        <td style={styles.tableTd}><span style={{fontWeight: '600'}}>{res.resName}</span></td>
                                        <td style={styles.tableTd}>
                                            <span style={{
                                                ...styles.statusBadge,
                                                color: res.isActive === 1 ? '#2ecc71' : '#e67e22',
                                                backgroundColor: res.isActive === 1 ? 'rgba(46, 204, 113, 0.1)' : 'rgba(230, 126, 34, 0.1)'
                                            }}>
                                                ● {res.isActive === 1 ? 'Hoạt động' : 'Chờ duyệt'}
                                            </span>
                                        </td>
                                        <td style={{...styles.tableTd, textAlign: 'right'}}>
                                            <div style={{ display: 'inline-flex', gap: '10px' }}>
                                                {isApprove ? (
                                                    <button style={styles.approveBtn} onClick={() => handleUpdateStatus(res, 1)}>
                                                        <i className="fas fa-check"></i> Duyệt
                                                    </button>
                                                ) : (
                                                    <>
                                                        <button style={styles.editIconBtn} onClick={() => { setSelectedRes(res); setShowEditModal(true); }}>
                                                            <i className="fas fa-edit"></i>
                                                        </button>
                                                        <button style={styles.lockIconBtn} onClick={() => handleUpdateStatus(res, 0)}>
                                                            <i className="fas fa-lock"></i>
                                                        </button>
                                                        <button style={styles.deleteIconBtn} onClick={() => handleDeleteRestaurant(res.resId)}>
                                                            <i className="fas fa-trash-alt"></i>
                                                        </button>
                                                    </>
                                                )}
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                );
            case 'shipping-fee':
                return (
                    <div style={styles.sectionContainer}>
                        <div style={{ marginBottom: '30px' }}>
                            <h3 style={styles.sectionTitle}>
                                <i className="fas fa-truck-loading" style={{color: '#2ecc71', marginRight: '10px'}}></i>
                                Cấu hình phí vận chuyển hệ thống
                            </h3>
                            <p style={{color: '#888', fontSize: '14px'}}>Thiết lập mức phí vận chuyển cố định theo khu vực (Nội thành/Ngoại thành).</p>
                        </div>
                        <div style={styles.feeGrid}>
                            {shippingFees.map((fee, idx) => (
                                <div key={idx} style={styles.feeCard}>
                                    <i className={`fas ${fee.areaName === 'Nội thành' ? 'fa-city' : 'fa-shuttle-van'}`} style={styles.feeIcon}></i>
                                    <span style={styles.feeRange}>{fee.areaName}</span>
                                    <div style={{position: 'relative'}}>
                                        <input 
                                            type="number" 
                                            value={fee.price} 
                                            onChange={(e) => {
                                                const newFees = [...shippingFees];
                                                newFees[idx].price = e.target.value;
                                                setShippingFees(newFees);
                                            }}
                                            style={styles.feeInput} 
                                        />
                                        <span style={{position: 'absolute', right: '15px', top: '50%', transform: 'translateY(-50%)', color: '#888'}}>VNĐ</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                        <div style={{marginTop: '40px', textAlign: 'right', borderTop: '1px solid #2d313d', paddingTop: '30px'}}>
                            <button style={styles.saveBtn} onClick={handleSaveShippingFees}>
                                <i className="fas fa-save" style={{marginRight: '10px'}}></i>
                                Lưu bảng giá mới
                            </button>
                        </div>
                    </div>
                );
            case 'profile': return <Profile />;
            default: return <div style={styles.welcomeBox}><h2>Chào sếp! 🎩</h2><p>Hệ thống vận hành ổn định. Sếp muốn kiểm tra mục nào?</p></div>;
        }
    };

    return (
        <div style={styles.layout}>
            <aside style={styles.sidebar}>
                <div style={styles.logo}>Yummy Hub Admin</div>
                <ul style={styles.nav}>
                    <li style={activeTab === 'approve-res' ? styles.navActive : styles.navItem} onClick={() => setActiveTab('approve-res')}><i className="fas fa-check-circle"></i> Duyệt quán</li>
                    <li style={activeTab === 'manage-res' ? styles.navActive : styles.navItem} onClick={() => setActiveTab('manage-res')}><i className="fas fa-utensils"></i> Quản lý quán</li>
                    <li style={activeTab === 'shipping-fee' ? styles.navActive : styles.navItem} onClick={() => setActiveTab('shipping-fee')}><i className="fas fa-truck"></i> Phí giao hàng</li>
                    <hr style={{margin: '20px 0', borderColor: '#2d313d'}} />
                    <li style={activeTab === 'profile' ? styles.navActive : styles.navItem} onClick={() => setActiveTab('profile')}><i className="fas fa-user-shield"></i> Cá nhân</li>
                </ul>
                <button onClick={() => navigate('/')} style={styles.logoutBtn}>Đăng xuất</button>
            </aside>
            <main style={styles.mainContent}>
                <header style={styles.header}>
                    <span style={{fontSize: '20px', fontWeight: 'bold'}}>Hệ thống Quản trị Yummy Hub</span>
                    <div style={styles.adminBadge}><i className="fas fa-user-circle"></i> Administrator</div>
                </header>
                <div style={{padding: '30px'}}>{renderContent()}</div>
            </main>
            {showEditModal && <EditRestaurantModal resData={selectedRes} onClose={() => setShowEditModal(false)} onSaveSuccess={fetchRestaurants} />}
        </div>
    );
};

// === 3. HỆ THỐNG STYLES (DARK MODE) ===
const styles = {
    layout: { display: 'flex', height: '100vh', backgroundColor: '#0f1014', color: '#fff', fontFamily: 'Inter, sans-serif' },
    sidebar: { width: '280px', backgroundColor: '#1c1e26', padding: '30px', display: 'flex', flexDirection: 'column', borderRight: '1px solid #2d313d' },
    logo: { fontSize: '22px', fontWeight: 'bold', color: '#2ecc71', marginBottom: '40px', textAlign: 'center' },
    nav: { listStyle: 'none', padding: 0, flex: 1 },
    navItem: { padding: '15px 20px', borderRadius: '12px', cursor: 'pointer', marginBottom: '8px', color: '#888', transition: '0.3s', display: 'flex', alignItems: 'center', gap: '12px' },
    navActive: { padding: '15px 20px', borderRadius: '12px', cursor: 'pointer', marginBottom: '8px', backgroundColor: 'rgba(46, 204, 113, 0.1)', color: '#2ecc71', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '12px', borderLeft: '4px solid #2ecc71' },
    logoutBtn: { backgroundColor: 'transparent', border: '1px solid #3d4251', color: '#e74c3c', padding: '12px', borderRadius: '10px', cursor: 'pointer' },
    mainContent: { flex: 1, overflowY: 'auto' },
    header: { height: '80px', borderBottom: '1px solid #2d313d', display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 40px', backgroundColor: '#1c1e26' },
    adminBadge: { color: '#888', display: 'flex', alignItems: 'center', gap: '8px', fontSize: '14px' },
    sectionContainer: { backgroundColor: '#1c1e26', borderRadius: '24px', padding: '30px', border: '1px solid #2d313d' },
    sectionTitle: { margin: 0, fontSize: '22px', fontWeight: '700' },
    sectionHeader: { display: 'flex', justifyContent: 'space-between', marginBottom: '25px' },
    refreshBtn: { backgroundColor: 'rgba(0, 86, 179, 0.2)', border: '1px solid #0056b3', color: '#fff', padding: '8px 16px', borderRadius: '10px', cursor: 'pointer' },
    table: { width: '100%', borderCollapse: 'collapse' },
    tableHeadRow: { color: '#5c6273', textTransform: 'uppercase', fontSize: '12px' },
    tableTh: { padding: '15px', borderBottom: '1px solid #2d313d', textAlign: 'left' },
    tableRow: { borderBottom: '1px solid #2d313d' },
    tableTd: { padding: '15px', color: '#ccc' },
    statusBadge: { padding: '4px 12px', borderRadius: '20px', fontSize: '12px', fontWeight: 'bold' },
    approveBtn: { backgroundColor: '#2ecc71', color: '#fff', border: 'none', padding: '8px 16px', borderRadius: '8px', cursor: 'pointer' },
    editIconBtn: { backgroundColor: '#f39c12', color: '#fff', border: 'none', width: '35px', height: '35px', borderRadius: '8px', cursor: 'pointer' },
    lockIconBtn: { backgroundColor: '#34495e', color: '#fff', border: 'none', width: '35px', height: '35px', borderRadius: '8px', cursor: 'pointer' },
    deleteIconBtn: { backgroundColor: '#e74c3c', color: '#fff', border: 'none', width: '35px', height: '35px', borderRadius: '8px', cursor: 'pointer' },
    welcomeBox: { textAlign: 'center', padding: '100px', color: '#888' },
    modalOverlay: { position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.8)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000, backdropFilter: 'blur(5px)' },
    modalContent: { background: '#1c1e26', padding: '40px', borderRadius: '24px', width: '650px', border: '1px solid #2d313d' },
    modalHeader: { display: 'flex', justifyContent: 'space-between', marginBottom: '30px' },
    modalTitle: { margin: 0, fontSize: '24px' },
    closeBtn: { background: 'none', border: 'none', color: '#888', fontSize: '24px', cursor: 'pointer' },
    imageBox: { position: 'relative', width: '180px', height: '180px', borderRadius: '20px', overflow: 'hidden', border: '2px solid #2d313d' },
    uploadLabel: { position: 'absolute', bottom: 0, left: 0, right: 0, background: 'rgba(0,0,0,0.5)', padding: '10px', cursor: 'pointer' },
    inputLabel: { color: '#5c6273', fontSize: '12px', textTransform: 'uppercase', marginBottom: '8px', display: 'block' },
    input: { width: '100%', backgroundColor: '#2d313d', border: '1px solid #3d4251', borderRadius: '12px', padding: '12px', color: '#fff' },
    modalFooter: { marginTop: '40px', display: 'flex', justifyContent: 'flex-end', gap: '15px' },
    cancelBtn: { backgroundColor: 'transparent', border: '1px solid #3d4251', color: '#888', padding: '10px 20px', borderRadius: '10px', cursor: 'pointer' },
    saveBtn: { backgroundColor: '#2ecc71', color: '#fff', border: 'none', padding: '12px 30px', borderRadius: '10px', cursor: 'pointer', fontWeight: 'bold' },
    feeGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '30px' },
    feeCard: { backgroundColor: '#2d313d', padding: '25px', borderRadius: '20px', textAlign: 'center', border: '1px solid #3d4251' },
    feeIcon: { fontSize: '35px', color: '#2ecc71', marginBottom: '15px' },
    feeRange: { display: 'block', color: '#888', fontSize: '16px', fontWeight: '600', marginBottom: '15px' },
    feeInput: { width: '100%', textAlign: 'center', backgroundColor: '#1c1e26', border: '1px solid #3d4251', color: '#fff', padding: '12px', borderRadius: '12px', fontWeight: 'bold', fontSize: '18px', outline: 'none' }
};

export default Admin;