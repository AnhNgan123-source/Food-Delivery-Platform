import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Profile from './Profile';

// === COMPONENT MODAL SỬA NHÀ HÀNG (GIỮ NGUYÊN) ===
const EditRestaurantModal = ({ resData, onClose, onSaveSuccess }) => {
    const [formData, setFormData] = useState({ 
        resId: resData.resId,
        resName: resData.resName,
        resAddress: resData.resAddress,
        resImage: resData.resImage,
        isActive: resData.isActive 
    });

    const noLogo = "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='250' height='250' viewBox='0 0 250 250'><rect width='250' height='250' fill='%23f8f9fa'/><text x='50%25' y='50%25' font-family='Arial' font-size='14' fill='%23ccc' text-anchor='middle' dy='.3em'>No Image</text></svg>";

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
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(15, 23, 42, 0.4)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000, backdropFilter: 'blur(8px)' }}>
            <div style={{ background: '#fff', padding: '40px', borderRadius: '24px', width: '600px', boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.15)', border: '1px solid rgba(255,255,255,0.1)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
                    <h3 style={{ color: '#1e293b', fontSize: '22px', margin: 0, fontWeight: '700' }}>Cập nhật thông tin</h3>
                    <button onClick={onClose} style={{ background: '#f1f5f9', border: 'none', width: '32px', height: '32px', borderRadius: '50%', cursor: 'pointer', color: '#64748b' }}>×</button>
                </div>
                
                <div style={{ display: 'flex', gap: '30px' }}>
                    <div style={{ textAlign: 'center' }}>
                        <div style={{ position: 'relative', width: '180px', height: '180px', borderRadius: '20px', overflow: 'hidden', border: '4px solid #f8f9fa', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)' }}>
                            <img 
                                src={formData.resImage ? `http://localhost:8080/uploads/${formData.resImage}` : noLogo} 
                                alt="res" 
                                style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
                            />
                            <label style={{ position: 'absolute', bottom: '0', left: 0, right: 0, background: 'rgba(0,0,0,0.5)', color: '#fff', padding: '8px', fontSize: '12px', cursor: 'pointer', backdropFilter: 'blur(4px)' }}>
                                <i className="fas fa-camera"></i> Thay ảnh
                                <input type="file" onChange={handleFileUpload} style={{ display: 'none' }} />
                            </label>
                        </div>
                    </div>
                    
                    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '20px' }}>
                        <div>
                            <label style={{ fontSize: '14px', fontWeight: '600', color: '#475569', display: 'block', marginBottom: '8px' }}>Tên nhà hàng</label>
                            <input 
                                className="form-control" 
                                value={formData.resName} 
                                onChange={e => setFormData({ ...formData, resName: e.target.value })} 
                                style={{ borderRadius: '12px', padding: '12px 16px', border: '1px solid #e2e8f0', width: '100%', outline: 'none', transition: 'border 0.2s' }} 
                            />
                        </div>
                        
                        <div>
                            <label style={{ fontSize: '14px', fontWeight: '600', color: '#475569', display: 'block', marginBottom: '8px' }}>Địa chỉ chi tiết</label>
                            <textarea 
                                className="form-control" 
                                rows="4"
                                value={formData.resAddress} 
                                onChange={e => setFormData({ ...formData, resAddress: e.target.value })} 
                                style={{ borderRadius: '12px', padding: '12px 16px', border: '1px solid #e2e8f0', width: '100%', outline: 'none', resize: 'none' }} 
                            />
                        </div>
                    </div>
                </div>

                <div style={{ marginTop: '40px', display: 'flex', justifyContent: 'flex-end', gap: '12px' }}>
                    <button 
                        style={{ background: '#f1f5f9', color: '#64748b', border: 'none', padding: '12px 24px', borderRadius: '12px', fontWeight: '600', cursor: 'pointer' }} 
                        onClick={onClose}
                    >
                        Hủy bỏ
                    </button>
                    <button 
                        className="wf-btn-primary" 
                        style={{ padding: '12px 30px', borderRadius: '12px', boxShadow: '0 4px 14px 0 rgba(0, 118, 255, 0.19)' }} 
                        onClick={handleSave}
                    >
                        Lưu dữ liệu
                    </button>
                </div>
            </div>
        </div>
    );
};

const Admin = () => {
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState('welcome');
    const [restaurants, setRestaurants] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [selectedRes, setSelectedRes] = useState(null);
    const [showEditModal, setShowEditModal] = useState(false);

    const actionBtnBase = {
        padding: '8px 16px',
        borderRadius: '10px',
        fontSize: '13px',
        fontWeight: '600',
        cursor: 'pointer',
        border: 'none',
        display: 'inline-flex',
        alignItems: 'center',
        gap: '8px',
        transition: 'transform 0.1s, opacity 0.2s',
    };

    useEffect(() => {
        const token = localStorage.getItem('token');
        const role = localStorage.getItem('role');
        if (!token || role !== 'ADMIN') {
            navigate('/'); 
        }
    }, [navigate]);

    const fetchRestaurants = async () => {
        setIsLoading(true);
        try {
            const response = await fetch("http://localhost:8080/api/v1/admin/restaurants");
            if (response.ok) {
                const data = await response.json();
                setRestaurants(data);
            }
        } catch (error) { console.error("Lỗi:", error); }
        finally { setIsLoading(false); }
    };

    useEffect(() => {
        if (activeTab === 'approve-res' || activeTab === 'manage-res') fetchRestaurants();
    }, [activeTab]);

    const handleUpdateStatus = async (res, newStatus) => {
        try {
            const response = await fetch(`http://localhost:8080/api/v1/admin/restaurants/${res.resId}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ ...res, isActive: newStatus })
            });
            if (response.ok) {
                fetchRestaurants(); 
            }
        } catch (error) { alert("Lỗi!"); }
    };

    // === HÀM XÓA NHÀ HÀNG MỚI THÊM ===
    const handleDeleteRestaurant = async (resId) => {
        if (!window.confirm("Sếp có chắc chắn muốn XÓA VĨNH VIỄN nhà hàng này không?")) return;
        try {
            const response = await fetch(`http://localhost:8080/api/v1/admin/restaurants/${resId}`, {
                method: 'DELETE'
            });
            if (response.ok) {
                alert("Đã xóa nhà hàng thành công!");
                fetchRestaurants();
            } else {
                alert("Lỗi khi xóa nhà hàng!");
            }
        } catch (error) { console.error("Lỗi:", error); }
    };

    const handleLogout = () => {
        if (window.confirm("Sếp có chắc chắn muốn đăng xuất?")) {
            localStorage.clear();
            navigate('/');
        }
    };

    const renderContent = () => {
        switch (activeTab) {
            case 'approve-res':
            case 'manage-res':
                const isApproveTab = activeTab === 'approve-res';
                // LỌC DỮ LIỆU: Tab duyệt hiện isActive=0, Tab quản lý hiện isActive=1
                const list = isApproveTab 
                    ? restaurants.filter(r => r.isActive === 0) 
                    : restaurants.filter(r => r.isActive === 1);
                
                return (
                    <div className="admin-section" style={{ background: '#fff', borderRadius: '20px', padding: '25px', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '25px', alignItems: 'center' }}>
                            <div style={{ fontSize: '15px', color: '#64748b' }}>
                                {isApproveTab ? "Danh sách chờ duyệt: " : "Danh sách đang hoạt động: "}
                                <span style={{ color: '#1e293b', fontWeight: '700' }}>{list.length}</span> nhà hàng
                            </div>
                            <button className="wf-btn-primary" onClick={fetchRestaurants} style={{ padding: '10px 20px', borderRadius: '10px', fontSize: '13px' }}>
                                <i className="fas fa-sync-alt"></i> Làm mới dữ liệu
                            </button>
                        </div>
                        
                        <table style={{ width: '100%', borderCollapse: 'separate', borderSpacing: '0 8px' }}>
                            <thead>
                                <tr style={{ color: '#94a3b8', fontSize: '13px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                                    <th style={{ textAlign: 'left', padding: '15px' }}>Mã ID</th>
                                    <th style={{ textAlign: 'left', padding: '15px' }}>Tên nhà hàng</th>
                                    <th style={{ textAlign: 'left', padding: '15px' }}>Trạng thái</th>
                                    <th style={{ textAlign: 'right', padding: '15px' }}>Thao tác quản trị</th>
                                </tr>
                            </thead>
                            <tbody>
                                {list.map(res => (
                                    <tr key={res.resId} style={{ background: '#fff', transition: 'all 0.2s' }} className="table-row-hover">
                                        <td style={{ padding: '15px', borderTop: '1px solid #f1f5f9', borderBottom: '1px solid #f1f5f9', borderLeft: '1px solid #f1f5f9', borderRadius: '12px 0 0 12px', color: '#64748b' }}>#{res.resId}</td>
                                        <td style={{ padding: '15px', borderTop: '1px solid #f1f5f9', borderBottom: '1px solid #f1f5f9' }}>
                                            <div style={{ color: '#1e293b', fontWeight: '600' }}>{res.resName}</div>
                                        </td>
                                        <td style={{ padding: '15px', borderTop: '1px solid #f1f5f9', borderBottom: '1px solid #f1f5f9' }}>
                                            {res.isActive === 1 ? 
                                                <span style={{ background: '#ecfdf5', color: '#059669', padding: '4px 12px', borderRadius: '20px', fontSize: '12px', fontWeight: '600' }}>● Hoạt động</span> : 
                                                <span style={{ background: '#fef2f2', color: '#dc2626', padding: '4px 12px', borderRadius: '20px', fontSize: '12px', fontWeight: '600' }}>● Chờ duyệt</span>
                                            }
                                        </td>
                                        <td style={{ padding: '15px', borderTop: '1px solid #f1f5f9', borderBottom: '1px solid #f1f5f9', borderRight: '1px solid #f1f5f9', borderRadius: '0 12px 12px 0', textAlign: 'right' }}>
                                            <div style={{ display: 'inline-flex', gap: '8px' }}>
                                                {isApproveTab ? (
                                                    <button style={{ ...actionBtnBase, background: '#10b981', color: '#fff' }} onClick={() => handleUpdateStatus(res, 1)}>
                                                        <i className="fas fa-check"></i> Duyệt
                                                    </button>
                                                ) : (
                                                    <>
                                                        <button style={{ ...actionBtnBase, background: '#f59e0b', color: '#fff' }} onClick={() => { setSelectedRes(res); setShowEditModal(true); }}>
                                                            <i className="fas fa-edit"></i> Sửa
                                                        </button>
                                                        <button style={{ ...actionBtnBase, background: '#ef4444', color: '#fff' }} onClick={() => handleUpdateStatus(res, 0)}>
                                                            <i className="fas fa-lock"></i> Khóa
                                                        </button>
                                                        {/* NÚT XÓA BÊN NGOÀI LIST QUẢN LÝ NHÀ HÀNG */}
                                                        <button 
                                                            style={{ ...actionBtnBase, background: '#334155', color: '#fff' }} 
                                                            onClick={() => handleDeleteRestaurant(res.resId)}
                                                        >
                                                            <i className="fas fa-trash-alt"></i> Xóa
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
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '25px' }}>
                        <div style={{ background: '#fff', borderRadius: '20px', padding: '30px', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
                            <h3 style={{ fontSize: '18px', color: '#1e293b', marginBottom: '20px', fontWeight: '700' }}>Biểu phí theo khoảng cách</h3>
                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '20px' }}>
                                {[
                                    { range: "0 - 2km", price: "15.000đ", icon: "fa-walking" },
                                    { range: "2 - 5km", price: "25.000đ", icon: "fa-bicycle" },
                                    { range: "Trên 5km", price: "+5.000đ/km", icon: "fa-motorcycle" }
                                ].map((item, idx) => (
                                    <div key={idx} style={{ padding: '20px', borderRadius: '16px', border: '1px solid #f1f5f9', background: '#f8fafc' }}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '15px', marginBottom: '15px' }}>
                                            <div style={{ width: '40px', height: '40px', background: '#fff', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#3b82f6', boxShadow: '0 2px 4px rgba(0,0,0,0.05)' }}>
                                                <i className={`fas ${item.icon}`}></i>
                                            </div>
                                            <span style={{ fontWeight: '600', color: '#475569' }}>{item.range}</span>
                                        </div>
                                        <input type="text" defaultValue={item.price} style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #e2e8f0', outline: 'none', fontWeight: '700', color: '#1e293b' }} />
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                );
            case 'profile': return <Profile />;
            default: return <div style={{ textAlign: 'center', padding: '100px 0' }}><h2 style={{ color: '#1e293b' }}>Chào mừng sếp trở lại! 👋</h2><p style={{ color: '#64748b' }}>Chọn một mục ở menu bên trái để bắt đầu quản lý hệ thống.</p></div>;
        }
    };

    return (
        <div className="dashboard-layout">
            <aside className="sidebar">
                <h3 style={{padding: '0 20px'}}><i className="fas fa-tools"></i> Admin Panel</h3>
                <ul>
                    <li className={activeTab === 'approve-res' ? 'active' : ''} onClick={() => setActiveTab('approve-res')}><i className="fas fa-check-circle"></i> Duyệt nhà hàng</li>
                    <li className={activeTab === 'manage-res' ? 'active' : ''} onClick={() => setActiveTab('manage-res')}><i className="fas fa-utensils"></i> Quản lý nhà hàng</li>
                    <li className={activeTab === 'manage-shipper' ? 'active' : ''} onClick={() => setActiveTab('manage-shipper')}><i className="fas fa-user-tie"></i> Quản lý shipper</li>
                    <li className={activeTab === 'manage-voucher' ? 'active' : ''} onClick={() => setActiveTab('manage-voucher')}><i className="fas fa-tags"></i> Quản lý voucher</li>
                    <li className={activeTab === 'shipping-fee' ? 'active' : ''} onClick={() => setActiveTab('shipping-fee')}><i className="fas fa-shuttle-van"></i> Cấu hình phí ship</li>
                    <li className={activeTab === 'reports' ? 'active' : ''} onClick={() => setActiveTab('reports')}><i className="fas fa-file-invoice-dollar"></i> Báo cáo hệ thống</li>
                    <hr style={{margin: '10px 20px', opacity: '0.1'}} />
                    <li className={activeTab === 'profile' ? 'active' : ''} onClick={() => setActiveTab('profile')}><i className="fas fa-id-card"></i> Hồ sơ cá nhân</li>
                </ul>
                <button onClick={handleLogout} className="btn-logout"><i className="fas fa-sign-out-alt"></i> Đăng xuất</button>
            </aside>
            
            <div style={{flex: 1, display: 'flex', flexDirection: 'column'}}>
                <header className="main-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '15px 35px', background: '#fff', borderBottom: '1px solid #f1f5f9' }}>
                    <h2 style={{fontSize: '18px', margin: 0, color: '#1e293b', fontWeight: '700'}}>
                        {activeTab === 'approve-res' ? 'Hồ sơ chờ duyệt' : activeTab === 'shipping-fee' ? 'Cấu hình vận chuyển' : 'Danh sách nhà hàng hệ thống'}
                    </h2>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                        <div style={{ textAlign: 'right' }}>
                            <div style={{ fontSize: '14px', fontWeight: '700', color: '#1e293b' }}>Administrator</div>
                            <div style={{ fontSize: '11px', color: '#94a3b8' }}>Hệ thống Yummy Hub</div>
                        </div>
                        <div style={{ width: '40px', height: '40px', borderRadius: '12px', background: '#e2e8f0', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#475569' }}>
                            <i className="fas fa-user"></i>
                        </div>
                    </div>
                </header>

                <main style={{ flex: 1, padding: '30px', background: '#f8fafc', overflowY: 'auto' }}>
                    {renderContent()}
                </main>
            </div>

            {showEditModal && (
                <EditRestaurantModal 
                    resData={selectedRes} 
                    onClose={() => setShowEditModal(false)} 
                    onSaveSuccess={fetchRestaurants} 
                />
            )}
        </div>
    );
};

export default Admin;