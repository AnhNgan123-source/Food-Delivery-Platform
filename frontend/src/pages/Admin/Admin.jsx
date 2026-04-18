import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

// Import các Component con
import Profile from '../../components/Common/Profile/Profile';
import ManageVoucher from '../../components/Admin/Voucher/ManageVoucher';
import ShippingConfig from '../../components/Admin/Shipping/ShippingConfig';
import ApproveRestaurant from '../../components/Admin/RestaurantMgmt/ApproveRestaurant';
import ManageRestaurant from '../../components/Admin/RestaurantMgmt/ManageRestaurant';
import ManageShipper from '../../components/Admin/Shipper/ManageShipper';
import styles from './Admin.module.css';

const sidebarMenuItems = [
    { id: 'approve-res', label: 'Duyệt nhà hàng', icon: 'fas fa-check-circle' },
    { id: 'manage-res', label: 'Quản lý nhà hàng', icon: 'fas fa-utensils' },
    { id: 'manage-shipper', label: 'Quản lý shipper', icon: 'fas fa-user-tie' },
    { id: 'manage-voucher', label: 'Quản lý voucher', icon: 'fas fa-tags' },
    { id: 'shipping-fee', label: 'Cấu hình phí ship', icon: 'fas fa-shuttle-van' },
    { id: 'reports', label: 'Báo cáo hệ thống', icon: 'fas fa-file-invoice-dollar' },
    { id: 'profile', label: 'Hồ sơ cá nhân', icon: 'fas fa-id-card' },
];

// === COMPONENT MODAL SỬA NHÀ HÀNG ===
const EditRestaurantModal = ({ resData, onClose, onSaveSuccess }) => {
    // SỬA TẠI ĐÂY: Spread toàn bộ resData vào state để không mất trường ẩn
    const [formData, setFormData] = useState({ 
        ...resData 
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
                body: JSON.stringify(formData) // Giờ đây formData đã đầy đủ mọi trường
            });
            
            if (response.ok) {
                alert("Cập nhật thành công!");
                onSaveSuccess();
                onClose();
            } else {
                // Đọc lỗi chi tiết từ Backend để biết chính xác trường nào bị null
                const errorDetail = await response.text();
                console.error("Backend Error:", errorDetail);
                alert("Lỗi server: " + errorDetail);
            }
        } catch (error) { 
            alert("Lỗi kết nối dữ liệu!"); 
        }
    };

    return (
        <div className={styles['admin-modal-overlay']}>
            <div className={styles['admin-modal-container']}>
                <div className={styles['admin-modal-header']}>
                    <h3>Cập nhật thông tin nhà hàng</h3>
                    <button onClick={onClose} className={styles['btn-close-modal']}>×</button>
                </div>
                
                <div className={styles['admin-modal-body']}>
                    <div className={styles['modal-image-section']}>
                        <div className={styles['modal-image-wrapper']}>
                            <img 
                                src={formData.resImage ? `http://localhost:8080/uploads/${formData.resImage}` : noLogo} 
                                alt="res" 
                            />
                            <label className={styles['image-upload-label']}>
                                <i className="fas fa-camera"></i> Thay ảnh
                                <input type="file" onChange={handleFileUpload} />
                            </label>
                        </div>
                    </div>
                    
                    <div className={styles['modal-form-section']}>
                        <div className={styles['form-group']}>
                            <label>Tên nhà hàng</label>
                            <input 
                                className={styles['form-input']} 
                                value={formData.resName} 
                                onChange={e => setFormData({ ...formData, resName: e.target.value })} 
                            />
                        </div>
                        <div className={styles['form-group']}>
                            <label>Địa chỉ</label>
                            <textarea 
                                className={styles['form-textarea']} 
                                rows="3"
                                value={formData.resAddress} 
                                onChange={e => setFormData({ ...formData, resAddress: e.target.value })} 
                            />
                        </div>
                    </div>
                </div>

                <div className={styles['edit-mode-buttons']}>
                    <button onClick={onClose} className={styles['btn-cancel']}>Hủy</button>
                    <button onClick={handleSave} className={styles['btn-save']}>Lưu thay đổi</button>
                </div>
            </div>
        </div>
    );
};

// === COMPONENT ADMIN CHÍNH ===
const Admin = () => {
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState('welcome');
    const [restaurants, setRestaurants] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [selectedRes, setSelectedRes] = useState(null);
    const [showEditModal, setShowEditModal] = useState(false);
    const [shippingFees, setShippingFees] = useState([]);

    // 1. Kiểm tra quyền ADMIN
    useEffect(() => {
        const token = localStorage.getItem('token');
        const role = localStorage.getItem('role');
        if (!token || role !== 'ADMIN') navigate('/');
    }, [navigate]);

    // 2. Fetch danh sách nhà hàng
    const fetchRestaurants = async () => {
        setIsLoading(true);
        try {
            const response = await fetch("http://localhost:8080/api/v1/admin/restaurants");
            if (response.ok) {
                const data = await response.json();
                setRestaurants(data || []);
            }
        } catch (error) { console.error("Lỗi fetch nhà hàng:", error); }
        finally { setIsLoading(false); }
    };

    // 3. Fetch phí vận chuyển
    const fetchShippingFees = async () => {
        try {
            const response = await fetch("http://localhost:8080/api/v1/admin/shipping-config");
            if (response.ok) {
                const data = await response.json();
                setShippingFees(data || []);
            }
        } catch (error) { console.error("Lỗi fetch phí ship:", error); }
    };

    useEffect(() => {
        if (activeTab === 'approve-res' || activeTab === 'manage-res') fetchRestaurants();
        if (activeTab === 'shipping-fee') fetchShippingFees();
    }, [activeTab]);

    // 4. Các hàm Action
    const handleUpdateStatus = async (res, newStatus) => {
        const message = newStatus === 1 ? "Duyệt nhà hàng này?" : "Từ chối nhà hàng này?";
        if (!window.confirm(message)) return;

        try {
            const response = await fetch(`http://localhost:8080/api/v1/admin/restaurants/${res.resId}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ ...res, isActive: newStatus })
            });
            if (response.ok) fetchRestaurants();
        } catch (error) { alert("Lỗi cập nhật trạng thái!"); }
    };

    const handleDeleteRestaurant = async (resId) => {
        if (!window.confirm("Xóa vĩnh viễn nhà hàng này khỏi hệ thống?")) return;
        try {
            const response = await fetch(`http://localhost:8080/api/v1/admin/restaurants/${resId}`, {
                method: 'DELETE'
            });
            if (response.ok) {
                alert("Đã xóa thành công!");
                fetchRestaurants();
            }
        } catch (error) { alert("Lỗi khi xóa!"); }
    };

    const handleSaveShippingFees = async (updatedFees) => {
        try {
            const response = await fetch("http://localhost:8080/api/v1/admin/shipping-config", {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(updatedFees)
            });
            if (response.ok) alert("Đã cập nhật bảng giá phí ship!");
        } catch (error) { alert("Lỗi lưu phí ship!"); }
    };

    const handleLogout = () => {
        if (window.confirm("Đăng xuất khỏi hệ thống quản trị?")) {
            localStorage.clear();
            navigate('/');
        }
    };

    // 5. Render nội dung
    const renderContent = () => {
        if (isLoading) return <div className="admin-loading">Đang tải dữ liệu...</div>;

        switch (activeTab) {
            case 'approve-res':
                return (
                    <ApproveRestaurant 
                        list={restaurants.filter(r => r.isActive === 0)}
                        onUpdateStatus={handleUpdateStatus}
                        onRefresh={fetchRestaurants}
                    />
                );
            case 'manage-res':
                return (
                    <ManageRestaurant 
                        list={restaurants.filter(r => r.isActive === 1)}
                        onUpdateStatus={handleUpdateStatus}
                        onDelete={handleDeleteRestaurant}
                        onEdit={(res) => { setSelectedRes(res); setShowEditModal(true); }}
                        onRefresh={fetchRestaurants}
                    />
                );
            case 'manage-shipper': return <ManageShipper />;
            case 'manage-voucher': return <ManageVoucher />;
            case 'shipping-fee':
                return (
                    <ShippingConfig 
                        shippingFees={shippingFees} 
                        setShippingFees={setShippingFees} 
                        handleSaveShippingFees={handleSaveShippingFees} 
                    />
                );
            case 'profile': return <Profile />;
            default:
                return (
                    <div className="admin-welcome-screen">
                        <h2>Xin chào !!</h2>
                        <p>Hệ thống quản trị Yummy Hub đã sẵn sàng để điều hành.</p>
                    </div>
                );
        }
    };

    return (
        <div className={styles['dashboard-layout']}>
            <aside className={styles.sidebar}>
                <div className={styles['sidebar-logo']}>
                    <h3><i className="fas fa-tools"></i> ADMIN PANEL</h3>
                </div>
                
                <ul className={styles['sidebar-menu']}>
                    {sidebarMenuItems.map((item) => (
                        <li 
                            key={item.id}
                            className={`${styles['sidebar-item']} ${activeTab === item.id ? styles.active : ''}`} 
                            onClick={() => setActiveTab(item.id)}
                        >
                            <i className={item.icon}></i>
                            <span>{item.label}</span>
                        </li>
                    ))}
                </ul>
                
                <button className={styles['btn-logout']} onClick={handleLogout}>
                    <i className="fas fa-sign-out-alt"></i> Đăng xuất
                </button>
            </aside>

            {/* Main Area */}
            <div className={styles['main-area']}>
                <header className={styles['main-header']}>
                    <h2 className={styles['header-title']}>
                        {sidebarMenuItems.find(i => i.id === activeTab)?.label || "Dashboard"}
                    </h2>
                    
                    <div className={styles['header-user-info']}>
                        <div className={styles['user-text']}>
                            <div className={styles['user-name']}>Administrator</div>
                            <div className={styles['user-sub']}>Yummy Hub System</div>
                        </div>
                        <div className={styles['avatar-circle-header']}>
                            <i className="fas fa-user-shield"></i>
                        </div>
                    </div>
                </header>

                {/* MAIN CONTENT */}
                <main className={styles['main-content']}>
                    <div className={styles['content-container']}>
                        {renderContent()}
                    </div>
                </main>
            </div>

            {/* Modal */}
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