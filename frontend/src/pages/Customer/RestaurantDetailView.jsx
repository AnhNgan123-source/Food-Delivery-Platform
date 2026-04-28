import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useOutletContext } from 'react-router-dom';
import customerApi from '../../api/customerApi';
import styles from './RestaurantDetailView.module.css';

import RestaurantHero from '../../components/Customer/Restaurant/RestaurantHero';
import FoodItemCard from '../../components/Customer/Menu/FoodItemCard';

const RestaurantDetailView = () => {
    const { resId } = useParams();
    const navigate = useNavigate();
    const { updateCartCount } = useOutletContext(); 
    
    const [restaurant, setRestaurant] = useState(null);
    const [menu, setMenu] = useState([]);
    // BỔ SUNG: State lưu dữ liệu đánh giá
    const [rating, setRating] = useState({ average: 0, total: 0 });

    useEffect(() => {
        const fetchAllData = async () => {
            try {
                // CHẠY SONG SONG: Lấy Menu và Rating cùng lúc cho nhanh
                const [menuRes, ratingRes] = await Promise.all([
                    customerApi.getRestaurantMenu(resId),
                    customerApi.getRestaurantRating(resId) // Gọi hàm API mới của sếp
                ]);

                // Xử lý dữ liệu Menu & Restaurant
                const menuData = menuRes?.data || menuRes;
                if (menuData) {
                    setRestaurant(menuData.restaurant);
                    setMenu(menuData.menu || []);
                    localStorage.setItem('lastVisitedResId', resId);
                }

                // Xử lý dữ liệu Rating (Điểm TB và số lượt đánh giá)
                if (ratingRes) {
                    setRating({
                        average: ratingRes.average || 0,
                        total: ratingRes.total || 0
                    });
                }
            } catch (error) {
                console.error("Lỗi lấy dữ liệu nhà hàng:", error);
            }
        };

        if (resId) fetchAllData();
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
        updateCartCount(); 
        alert(`Đã thêm ${food.itemName} vào giỏ hàng nha! `);
    };

    if (!restaurant) return <div className={styles.loading}>Đang chuẩn bị thực đơn cho bạn...</div>;

    return (
        <div style={{ paddingBottom: '50px' }}>
            <div 
                onClick={() => navigate('/home')} 
                style={{ cursor:'pointer', color:'#2ecc71', fontWeight:'bold', padding: '15px 5%' }}
            >
                &larr; QUAY LẠI TRANG CHỦ
            </div>

            {/* CẬP NHẬT: Truyền thêm prop rating cho Hero */}
            <RestaurantHero restaurant={restaurant} rating={rating} />

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