// MenuList.jsx
import React from 'react';
import MenuItemCard from './MenuItemCard';

const MenuList = ({ foods, onEdit, onDelete, onToggleStatus }) => {
    return (
        <div className="menu-grid" style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', 
            gap: '20px',
            padding: '10px'
        }}>
            {foods.map(food => (
                <MenuItemCard 
                    // ✅ SỬA: Dùng toán tử || để lấy đúng ID dù là itemId hay item_id
                    key={food.itemId || food.item_id} 
                    food={food} 
                    onEdit={onEdit} 
                    onDelete={onDelete} 
                    onToggleStatus={onToggleStatus} 
                />
            ))}
        </div>
    );
};

export default MenuList;