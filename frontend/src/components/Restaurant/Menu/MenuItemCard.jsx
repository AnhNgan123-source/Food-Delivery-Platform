import React from 'react';
import styles from '../Menu/MenuManagement.module.css';

const MenuItemCard = ({ food, onEdit, onDelete, onToggleStatus }) => {
    // 1. Kiểm tra dữ liệu (Nếu không có food, không render để tránh lỗi)
    if (!food) return null;

    // 2. ÉP KIỂU DỮ LIỆU: Thử mọi trường hợp Backend có thể trả về
    const foodName = food.item_name || food.itemName || food.ItemName || "Món chưa đặt tên";
    const foodPrice = food.price || food.item_price || 0;
    const imageName = food.item_image || food.itemImage || food.image;
    const isAvailable = food.is_available === 1 || food.isAvailable === 1 || food.status === 1;
    const foodId = food.itemId || food.item_id || food.id;

    // 3. ẢNH MẶC ĐỊNH (Base64 - Không bao giờ lỗi kết nối)
    const localPlaceholder = "data:image/svg+xml;charset=UTF-8,%3Csvg%20width%3D%22150%22%20height%3D%22150%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%3E%3Crect%20width%3D%22100%25%22%20height%3D%22100%25%22%20fill%3D%22%23eeeeee%22%3E%3C%2Frect%3E%3Ctext%20x%3D%2250%25%22%20y%3D%2250%25%22%20font-family%3D%22sans-serif%22%20font-size%3D%2212%22%20fill%3D%22%23999999%22%20text-anchor%3D%22middle%22%20dy%3D%22.3em%22%3ENo%20Image%3C%2Ftext%3E%3C%2Fsvg%3E";

    // 4. Xử lý đường dẫn ảnh
    const imageSrc = imageName 
        ? `http://localhost:8080/uploads/${imageName}` 
        : localPlaceholder;

    return (
        <div className={`${styles.card} ${!isAvailable ? styles.unavailable : ''}`}>
            {/* HÌNH ẢNH */}
            <div className={styles.imageContainer}>
                <img 
                    src={imageSrc} 
                    alt={foodName}
                    style={{ backgroundColor: '#f8f9fa' }}
                    onError={(e) => { 
                        e.target.onerror = null; 
                        e.target.src = localPlaceholder; 
                    }}
                />
                {!isAvailable && <div className={styles.overlayText}>Tạm ẩn</div>}
            </div>

            {/* NỘI DUNG */}
            <div className={styles.cardContent}>
                <div className={styles.foodName}>
                    {foodName}
                </div>

                <div className={styles.foodPrice}>
                    {Number(foodPrice).toLocaleString()} đ
                </div>

                <div className={styles.actions}>
                    <button 
                        className={`${styles.btnIcon} ${styles.btnToggle}`}
                        onClick={(e) => {
                            e.stopPropagation();
                            if (onToggleStatus) onToggleStatus(foodId, isAvailable);
                        }}
                    >
                        <i className={`fas ${isAvailable ? 'fa-eye' : 'fa-eye-slash'}`}></i>
                        <span style={{ fontSize: '10px', marginLeft: '4px' }}>
                            {isAvailable ? 'Hiện' : 'Ẩn'}
                        </span>
                    </button>

                    <div style={{ display: 'flex', gap: '5px' }}>
                        <button 
                            className={`${styles.btnIcon} ${styles.btnEdit}`}
                            onClick={() => onEdit && onEdit(food)} 
                        >
                            <i className="fas fa-edit" style={{ color: '#f59e0b' }}></i>
                        </button>
                        
                        <button 
                            className={`${styles.btnIcon} ${styles.btnDelete}`}
                            onClick={() => onDelete && onDelete(foodId)} 
                        >
                            <i className="fas fa-trash" style={{ color: '#ef4444' }}></i>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default MenuItemCard;