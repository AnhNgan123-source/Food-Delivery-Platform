/*thẻ giỏ hàng*/
import React from 'react';
import styles from './CartItem.module.css'; 

const CartItem = ({ item, onUpdate, onToggle, isSelected, onRemove }) => {
    // Xử lý ảnh mặc định nếu server chưa kịp load
    const imageUrl = item.itemImage 
        ? `http://localhost:8080/uploads/${item.itemImage}` 
        : 'https://via.placeholder.com/100';

    return (
        <div className={styles.cartItem}>
            {/* NHÓM TRÁI: Checkbox + Ảnh + Thông tin */}
            <div className={styles.cartItemLeft}>
                <input 
                    type="checkbox" 
                    className={styles.itemCheck}
                    checked={isSelected} 
                    onChange={() => onToggle(item.itemId)} 
                />
                
                <div className={styles.cartItemImgWrapper}>
                    <img 
                        src={imageUrl} 
                        className={styles.cartItemImg}
                        alt={item.itemName} 
                        onError={(e) => { e.target.src = 'https://via.placeholder.com/100'; }}
                    />
                </div>

                <div className={styles.cartItemInfo}>
                    <h5 className={styles.itemName}>{item.itemName}</h5>
                    <p className={styles.itemPrice}>
                        {Number(item.price || 0).toLocaleString('vi-VN')}đ
                    </p>
                </div>
            </div>

            {/* NHÓM PHẢI: Số lượng + Xóa */}
            <div className={styles.cartItemRight}>
                <div className={styles.qtyBox}>
                    <button className={styles.qtyBtn} onClick={() => onUpdate(item.itemId, -1)}>-</button>
                    <span className={styles.qtyText}>{item.quantity}</span>
                    <button className={styles.qtyBtn} onClick={() => onUpdate(item.itemId, 1)}>+</button>
                </div>
                
                <button className={styles.btnRemove} onClick={() => onRemove(item.itemId)}>
                    <i className="fas fa-trash-alt"></i>
                </button>
            </div>
        </div>
    );
};

export default CartItem;