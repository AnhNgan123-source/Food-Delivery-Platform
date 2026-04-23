import React from 'react';
import MenuItemCard from './MenuItemCard';
import styles from './MenuManagement.module.css';

const MenuList = ({ foods, onToggleStatus, onDelete, onEdit }) => {
    if (!foods || foods.length === 0) {
        return <div style={{ textAlign: 'center', padding: '50px' }}>Chưa có món ăn nào trong thực đơn.</div>;
    }

    return (
        <div className={styles.menuGrid}>
            {foods.map((item) => (
                <MenuItemCard 
                    key={item.id || item.item_id || item.itemId} 
                    food={item} 
                    onToggleStatus={onToggleStatus}
                    onDelete={onDelete}
                    onEdit={onEdit}
                />
            ))}
        </div>
    );
};

export default MenuList;