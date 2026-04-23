import React from 'react';
import styles from './Restaurant.module.css';

const RestaurantCard = ({ res, onClick }) => {
    // Xử lý ID linh hoạt cho cả snake_case và camelCase từ DB
    const id = res.resId || res.res_id;
    
    // Đường dẫn ảnh dự phòng nếu bị lỗi
    const imageUrl = res.resImage 
        ? `http://localhost:8080/uploads/${res.resImage}` 
        : 'https://via.placeholder.com/400x250?text=No+Image';

    return (
        <div className={styles.restaurantCard} onClick={() => onClick(id)}>
            <div className={styles.imageWrapper}>
                <img 
                    src={imageUrl} 
                    className={styles.resImage} 
                    alt={res.resName} 
                />
                <div className={styles.overlay}>
                    <span>Xem thực đơn</span>
                </div>
            </div>
            
            <div className={styles.resContent}>
                <h4 className={styles.resName}>{res.resName}</h4>
                <p className={styles.resAddress}>
                    <i className="fas fa-map-marker-alt"></i> {res.resAddress}
                </p>
                
                {/* Thêm phần tag cho xịn xò */}
                <div className={styles.resTags}>
                    <span className={styles.tagLabel}>Đối tác YumFood</span>
                    <span className={styles.tagTime}>30-45 phút</span>
                </div>
            </div>
        </div>
    );
};

export default RestaurantCard;