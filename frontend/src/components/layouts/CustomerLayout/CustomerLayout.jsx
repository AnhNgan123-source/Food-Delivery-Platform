import React, { useState, useEffect, useRef } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import styles from './CustomerLayout.module.css'; 

const CustomerLayout = () => {
    const navigate = useNavigate();
    const [cartCount, setCartCount] = useState(0);
    const [showUserMenu, setShowUserMenu] = useState(false);

    const menuRef = useRef(null);

    // XỬ LÝ CLICK RA NGOÀI ĐỂ ĐÓNG MENU
    useEffect(() => {
        const handleClickOutside = (event) => {
            // Nếu menu đang mở VÀ vị trí click KHÔNG nằm trong menuRef (vùng UserSection)
            if (menuRef.current && !menuRef.current.contains(event.target)) {
                setShowUserMenu(false);
            }
        };

        // Đăng ký sự kiện click toàn bộ trang web
        document.addEventListener('mousedown', handleClickOutside);
        
        // Dọn dẹp sự kiện khi rời trang
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [menuRef]);

    // 1. Hàm tính toán số lượng giỏ hàng tập trung
    const updateCartCount = () => {
        const cart = JSON.parse(localStorage.getItem('cart')) || [];
        const total = cart.reduce((sum, item) => sum + item.quantity, 0);
        setCartCount(total);
    };

    
    // 2. Tự động chạy khi load và lắng nghe thay đổi
    useEffect(() => {
        updateCartCount();
        
        // Cập nhật nếu mở nhiều tab hoặc trang khác lưu vào storage
        window.addEventListener('storage', updateCartCount);
        return () => window.removeEventListener('storage', updateCartCount);
    }, []);

    const handleLogout = () => {
        if (window.confirm("Bạn chắc chắn muốn đăng xuất? ")) {
            localStorage.clear();
            navigate('/login');
        }
    };

    return (
        <div className={styles.homeContainer}>
            {/* HEADER CHUNG CHO TOÀN BỘ KHÁCH HÀNG */}
            <header className={styles.wfHeader}>
                <div 
                    className={styles.logo} 
                    onClick={() => navigate('/home')} 
                    style={{ cursor: 'pointer' }}
                >
                    🍕 YUMMY HUB 
                </div>

                <div style={{ display: 'flex', gap: '25px', alignItems: 'center' }}>
                    {/* Xem lịch sử đơn hàng */}
                    <i 
                        className="fas fa-history" 
                        onClick={() => navigate('/orders')} 
                        style={{ cursor: 'pointer' }}
                    ></i>
                    
                    {/* Giỏ hàng kèm badge số lượng xanh lá */}
                    <div 
                        style={{ position: 'relative', cursor: 'pointer' }} 
                        onClick={() => navigate('/cart')}
                    >
                        <i className="fas fa-shopping-cart"></i>
                        {cartCount > 0 && (
                            <span className={styles.cartBadge}>
                                {cartCount}
                            </span>
                        )}
                    </div>

                    {/* Trang cá nhân */}
                    <div className={styles.userSection} ref={menuRef}>
                        <i 
                            className="fas fa-user-circle" 
                            onClick={() => setShowUserMenu(!showUserMenu)}
                            style={{ cursor: 'pointer', fontSize: '20px' }}
                        ></i>

                        {showUserMenu && (
                            <div className={styles.userDropdown}>
                                <div onClick={() => { navigate('/profile'); setShowUserMenu(false); }}>
                                    <i className="fas fa-user-edit"></i> Hồ sơ cá nhân
                                </div>
                                <div onClick={() => { navigate('/orders'); setShowUserMenu(false); }}>
                                    <i className="fas fa-box-open"></i> Đơn hàng của tôi
                                </div>
                                <hr className={styles.divider} />
                                <div onClick={handleLogout} className={styles.logoutItem}>
                                    <i className="fas fa-sign-out-alt"></i> Đăng xuất
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </header>

            <main>
                {/* Gửi hàm updateCartCount qua context.
                    Các trang con như RestaurantDetailView chỉ cần gọi 
                    useOutletContext() là có thể báo cho Header cập nhật số lượng.
                */}
                <Outlet context={{ updateCartCount }} />
            </main>
        </div>
    );
};

export default CustomerLayout;