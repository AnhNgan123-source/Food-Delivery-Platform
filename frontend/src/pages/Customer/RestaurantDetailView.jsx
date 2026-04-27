import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useOutletContext } from 'react-router-dom';
import customerApi from '../../api/customerApi';
import styles from './RestaurantDetailView.module.css';

import RestaurantHero from '../../components/Customer/Restaurant/RestaurantHero';
import FoodItemCard from '../../components/Customer/Menu/FoodItemCard';

const RestaurantDetailView = () => {
    const { resId } = useParams();
    const navigate = useNavigate();
    const { updateCartCount } = useOutletContext(); // Nhận hàm từ Layout để báo nhảy số giỏ hàng
    const [restaurant, setRestaurant] = useState(null);
    const [menu, setMenu] = useState([]);

    useEffect(() => {
        const fetchMenu = async () => {
            try {
                const res = await customerApi.getRestaurantMenu(resId);
                const actualData = res?.data || res;
                if (actualData) {
                    setRestaurant(actualData.restaurant);
                    setMenu(actualData.menu || []);
                    localStorage.setItem('lastVisitedResId', resId);
                }
            } catch (error) {
                console.error("Lỗi lấy thực đơn:", error);
            }
        };
        if (resId) fetchMenu();
    }, [resId]);

    const handleAddToCart = (food) => {
        let cart = JSON.parse(localStorage.getItem('cart')) || [];
        const exist = cart.find(item => item.itemId === food.itemId);
        
        if (exist) {
            exist.quantity += 1;
        } else {
            cart.push({ ...food, quantity: 1, resId: parseInt(resId) });
        }
        
        localStorage.setItem('cart', JSON.stringify(cart));
        localStorage.setItem('lastVisitedResId', resId);
        updateCartCount(); // Báo cho Header cập nhật số lượng ngay lập tức
        alert(`Đã thêm ${food.itemName} vào giỏ hàng nha! `);
    };

    if (!restaurant) return <div className={styles.loading}>Đang chuẩn bị thực đơn cho bạn...</div>;

    return (
        <div style={{ paddingBottom: '50px' }}>
            <div 
                onClick={() => navigate('/home')} 
                style={{ cursor:'pointer', color:'#2ecc71', fontWeight:'bold', padding: '15px 5%' }}
            >
                ← QUAY LẠI TRANG CHỦ
            </div>

            {/* Banner riêng của quán */}
            <RestaurantHero restaurant={restaurant} />

            <main style={{ padding: '0 5%' }}>
                <h3 className={styles.sectionTitle}>Thực đơn hôm nay</h3>
                <div className={styles.menuGrid}>
                    {menu.length > 0 ? (
                        menu.map(item => (
                            <FoodItemCard 
                                key={item.itemId} 
                                item={item} 
                                onAdd={handleAddToCart} 
                            />
                        ))
                    ) : (
                        <p style={{color: '#888', textAlign: 'center'}}>Quán hiện chưa cập nhật món ăn!</p>
                    )}
                </div>
            </main>
        </div>
    );
};

export default RestaurantDetailView;