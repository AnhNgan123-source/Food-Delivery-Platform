import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Profile from './Profile';

const Admin = () => {
    const navigate = useNavigate();
    
    // === STATE QUẢN LÝ TAB ĐANG MỞ ===
    // Mặc định vừa vào sẽ hiển thị màn hình 'welcome'
    const [activeTab, setActiveTab] = useState('welcome');

    // === KIỂM TRA QUYỀN TRUY CẬP ===
    useEffect(() => {
        const token = localStorage.getItem('token');
        const role = localStorage.getItem('role');

        if (!token || role !== 'ADMIN') {
            alert("Bạn không có quyền truy cập vùng Admin!");
            navigate('/'); // Đẩy về trang Login
        }
    }, [navigate]);

    // === HÀM XỬ LÝ ĐĂNG XUẤT ===
    const handleLogout = () => {
        if (window.confirm("Sếp có chắc chắn muốn đăng xuất?")) {
            localStorage.clear();
            navigate('/');
        }
    };

    // === HÀM RENDER NỘI DUNG ĐỘNG TÙY VÀO TAB ===
    const renderContent = () => {
        switch (activeTab) {
            case 'approve-res':
                return (
                    <div>
                        <h2>Duyệt nhà hàng</h2>
                        <p>Danh sách các nhà hàng đang chờ duyệt sẽ hiển thị ở đây...</p>
                        {/* Gợi ý: Lát nữa Ngân sẽ gọi API GET danh sách nhà hàng trạng thái "pending" vào đây */}
                    </div>
                );
            case 'manage-res':
                return (
                    <div>
                        <h2>Quản lý nhà hàng</h2>
                        <p>Toàn bộ nhà hàng đang hoạt động trên hệ thống...</p>
                    </div>
                );
            case 'profile':
                return < Profile />;
            default: return <h2>Chào sếp Admin!</h2>;
        }
    };

    // ==========================================
    // RENDER GIAO DIỆN CHÍNH
    // ==========================================
    return (
        <div className="dashboard-layout">
            <aside className="sidebar">
                <h3>Admin Panel</h3>
                <ul>
                    {/* onClick sẽ đổi state activeTab, từ đó giao diện bên main tự động cập nhật */}
                    <li 
                        className={activeTab === 'approve-res' ? 'active' : ''} 
                        onClick={() => setActiveTab('approve-res')}
                        style={{ cursor: 'pointer' }}
                    >
                        Duyệt nhà hàng
                    </li>
                    <li 
                        className={activeTab === 'manage-res' ? 'active' : ''} 
                        onClick={() => setActiveTab('manage-res')}
                        style={{ cursor: 'pointer' }}
                    >
                        Quản lý nhà hàng
                    </li>
                    <li 
                        className={activeTab === 'profile' ? 'active' : ''} 
                        onClick={() => setActiveTab('profile')}
                        style={{ cursor: 'pointer' }}
                    >
                        Hồ sơ cá nhân
                    </li>
                </ul>
                <button onClick={handleLogout} className="btn-logout">Đăng xuất</button>
            </aside>
            
            <main className="main-content" id="content-area">
                {/* Hàm này sẽ tự động nhả ra đoạn HTML tương ứng với Tab đang chọn */}
                {renderContent()}
            </main>
        </div>
    );
};

export default Admin;