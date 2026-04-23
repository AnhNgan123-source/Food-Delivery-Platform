import React from 'react';
import styles from './Restaurant.module.css';

const RestaurantHero = ({ restaurant }) => {
    // Ảnh nền mặc định nếu quán chưa có ảnh
    const bgImage = restaurant?.resImage 
        ? `http://localhost:8080/uploads/${restaurant.resImage}` 
        : 'https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b';

    return (
        <section 
            className={styles.resHero}
            style={{ backgroundImage: `url(${bgImage})` }}
        >
            <div className={styles.resHeroOverlay}>
                <div className={styles.resHeroContainer}>
                    <h1 className={styles.resName}>
                        {restaurant?.resName || "Đang tải tên quán..."}
                    </h1>
                    
                    <p className={styles.resAddress}>
                        <i className="fas fa-map-marker-alt"></i> 
                        {restaurant?.resAddress || "Đang cập nhật địa chỉ..."}
                    </p>
                    
                    <div className={styles.resInfoRow}>
                        <div className={styles.infoBadge}>
                            <i className="fas fa-star"></i>
                            <span>4.8 (500+ đánh giá)</span>
                        </div>
                        <div className={styles.infoBadge}>
                            <i className="fas fa-clock"></i>
                            <span>20-30 phút</span>
                        </div>
                        <div className={styles.infoBadge}>
                            <i className="fas fa-check-circle"></i>
                            <span>Đối tác YumFood</span>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default RestaurantHero;