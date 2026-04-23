import React, { useState, useEffect } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import styles from './CustomerLayout.module.css'; 

const CustomerLayout = () => {
    const navigate = useNavigate();
    const [cartCount, setCartCount] = useState(0);

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

    return (
        <div className={styles.homeContainer}>
            {/* HEADER CHUNG CHO TOÀN BỘ KHÁCH HÀNG */}
            <header className={styles.wfHeader}>
                <div 
                    className={styles.logo} 
                    onClick={() => navigate('/home')} 
                    style={{ cursor: 'pointer' }}
                >
                    🍕 YUMMY HUB - TRANG CHỦ
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
                    <i 
                        className="fas fa-user-circle" 
                        onClick={() => navigate('/profile')} 
                        style={{ cursor: 'pointer' }}
                    ></i>
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