// src/components/layouts/AdminLayout/AdminLayout.jsx
import React from 'react';
import { NavLink, Outlet, useNavigate, useLocation, Link } from 'react-router-dom';
import styles from './AdminLayout.module.css';

const sidebarMenuItems = [
    { path: 'reports', label: 'Báo cáo hệ thống', icon: 'fas fa-chart-line' },
    { path: 'approve-res', label: 'Duyệt nhà hàng', icon: 'fas fa-check-circle' },
    { path: 'manage-res', label: 'Quản lý nhà hàng', icon: 'fas fa-utensils' },
    { path: 'manage-shippers', label: 'Quản lý shipper', icon: 'fas fa-user-tie' },
    { path: 'manage-vouchers', label: 'Quản lý voucher', icon: 'fas fa-tags' },
    { path: 'shipping-config', label: 'Cấu hình phí ship', icon: 'fas fa-shuttle-van' },
    { path: 'profile', label: 'Hồ sơ cá nhân', icon: 'fas fa-id-card' },
];

const AdminLayout = () => {
    const navigate = useNavigate();
    const location = useLocation();

    const currentPath = location.pathname.split('/').pop();
    const currentModule = sidebarMenuItems.find(item => item.path === currentPath);
    const pageTitle = currentModule ? currentModule.label : "Tổng quan hệ thống";

    return (
        <div className={styles.adminContainer}>
            <aside className={styles.sidebar}>
                <Link to="/admin" className={styles.logoLink}>
                    <div className={styles.logo}><i className="fas fa-tools"></i> ADMIN PANEL</div>
                </Link>
                <nav className={styles.navMenu}>
                    {sidebarMenuItems.map((item) => (
                        <NavLink 
                            key={item.path} to={`/admin/${item.path}`}
                            className={({ isActive }) => isActive ? `${styles.navItem} ${styles.active}` : styles.navItem}
                        >
                            <i className={item.icon}></i>
                            <span>{item.label}</span>
                        </NavLink>
                    ))}
                </nav>
                <div className={styles.logoutSection}>
                    <button className={styles.btnLogout} onClick={() => navigate('/')}>
                        <i className="fas fa-sign-out-alt"></i> Đăng xuất
                    </button>
                </div>
            </aside>

            <div className={styles.mainWrapper}>
                <header className={styles.topHeader}>
                    <span className={styles.pageTitle}>{pageTitle}</span>
                    {/* */}
                </header>
                <main className={styles.contentArea}>
                    <Outlet /> {/* Nơi chứa ApproveResPage */}
                </main>
            </div>
        </div>
    );
};

export default AdminLayout;