import React from 'react';
import styles from './FoodItemCard.module.css';

const FoodItemCard = ({ item, onAdd }) => {
    return (
        <div className={styles.foodCard}>
            <img 
                src={item.itemImage ? `http://localhost:8080/uploads/${item.itemImage}` : '/image/load.jpg'} 
                alt={item.itemName} 
                className={styles.foodImg}
            />
            <div className={styles.foodContent}>
                <h5 style={{ margin: 0, fontSize: '16px' }}>{item.itemName}</h5>
                <div className={styles.foodFooter}>
                    <span style={{ fontWeight: 'bold' }}>{item.price?.toLocaleString()} đ</span>
                    <button className={styles.btnPrimary} onClick={() => onAdd(item)}>
                        <i className="fas fa-plus"></i> Thêm giỏ hàng
                    </button>
                </div>
            </div>
        </div>
    );
};

export default FoodItemCard;