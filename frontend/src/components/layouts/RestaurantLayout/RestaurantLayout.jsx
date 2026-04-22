// src/components/layouts/RestaurantLayout/RestaurantLayout.jsx
import React from 'react';
import { NavLink, Outlet, useNavigate, useLocation, Link } from 'react-router-dom';
import styles from './RestaurantLayout.module.css';

const restaurantMenuItems = [
    { path: 'menu-management', label: 'Quản lý thực đơn', icon: 'fas fa-utensils' },
    { path: 'orders', label: 'Đơn hàng', icon: 'fas fa-clipboard-list' },
    { path: 'analytics', label: 'Thống kê doanh thu', icon: 'fas fa-chart-line' },
    { path: 'info', label: 'Thông tin nhà hàng', icon: 'fas fa-store' },
    { path: 'profile', label: 'Hồ sơ cá nhân', icon: 'fas fa-user-circle' },
];

const RestaurantLayout = () => {
    const navigate = useNavigate();
    const location = useLocation();

    // Lấy tiêu đề dựa trên route hiện tại
    const currentPath = location.pathname.split('/').pop();
    const currentModule = restaurantMenuItems.find(item => item.path === currentPath);
    const pageTitle = currentModule ? currentModule.label : "Kênh người bán";

    return (
        <div className={styles.resContainer}>
            <aside className={styles.sidebar}>
                <Link to="/restaurant" className={styles.logoLink}>
                    <div className={styles.logo}>
                        <i className="fas fa-store"></i> MERCHANT PANEL
                    </div>
                </Link>
                
                <nav className={styles.navMenu}>
                    {restaurantMenuItems.map((item) => (
                        <NavLink 
                            key={item.path} 
                            to={`/restaurant/${item.path}`}
                            className={({ isActive }) => 
                                isActive ? `${styles.navItem} ${styles.active}` : styles.navItem
                            }
                        >
                            <i className={item.icon}></i>
                            <span>{item.label}</span>
                        </NavLink>
                    ))}
                </nav>

                <div className={styles.logoutSection}>
                    <button className={styles.btnLogout} onClick={() => navigate('/login')}>
                        <i className="fas fa-sign-out-alt"></i> Đăng xuất
                    </button>
                </div>
            </aside>

            <div className={styles.mainWrapper}>
                <header className={styles.topHeader}>
                    <span className={styles.pageTitle}>{pageTitle}</span>
                    
                    <div className={styles.headerUserInfo}>
                        <div className={styles.userInfoText}>
                            <div className={styles.userName}>Chủ cửa hàng</div>
                            <div className={styles.userRole}>Đối tác Merchant</div>
                        </div>
                        <div className={styles.avatarCircle}>
                            <i className="fas fa-user"></i>
                        </div>
                    </div>
                </header>

                <main className={styles.contentArea}>
                    <Outlet />
                </main>
            </div>
        </div>
    );
};

export default RestaurantLayout;