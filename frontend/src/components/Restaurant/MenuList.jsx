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
                    key={food.itemId} 
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