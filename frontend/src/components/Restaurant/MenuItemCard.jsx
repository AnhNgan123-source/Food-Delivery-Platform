import React from 'react';

const MenuItemCard = ({ food, onEdit, onDelete, onToggleStatus }) => {
    const isAvailable = food.is_available === 1;

    return (
        <div className="card" style={{ 
            position: 'relative', 
            display: 'flex', 
            flexDirection: 'column', 
            height: '100%',
            borderRadius: '12px',
            overflow: 'hidden',
            transition: 'transform 0.2s',
            backgroundColor: '#fff',
            boxShadow: '0 4px 12px rgba(0,0,0,0.05)'
        }}>
            {/* PHẦN HÌNH ẢNH */}
            <div className="card-img">
                <img 
                    src={`http://localhost:8080/api/menu${food.item_image || '/uploads/default.jpg'}`} 
                    alt={food.item_name}
                    style={{ 
                        width: '100%', 
                        height: '160px', 
                        objectFit: 'cover',
                        filter: isAvailable ? 'none' : 'grayscale(100%) opacity(0.7)'
                    }}
                    onError={(e) => { e.target.src = 'https://via.placeholder.com/150?text=No+Image'; }}
                />
            </div>

            {/* NỘI DUNG CARD */}
            <div className="card-body" style={{ flex: 1, display: 'flex', flexDirection: 'column', padding: '15px' }}>
                <div className="card-title" style={{ 
                    fontWeight: '600', 
                    fontSize: '16px',
                    marginBottom: '5px',
                    color: isAvailable ? '#333' : '#999'
                }}>
                    {food.item_name}
                </div>

                <div className="card-price" style={{ 
                    color: isAvailable ? '#28a745' : '#ccc', 
                    fontWeight: 'bold', 
                    fontSize: '15px',
                    marginBottom: '20px' 
                }}>
                    {Number(food.price).toLocaleString()} đ
                </div>

                {/* DÒNG CHÂN CARD HIỆN ĐẠI */}
                <div style={{ 
                    marginTop: 'auto', 
                    display: 'flex', 
                    justifyContent: 'space-between', 
                    alignItems: 'center' 
                }}>
                    
                    {/* NÚT BẬT/TẮT (GÓC TRÁI) - Dùng icon cũ của bạn */}
                    <button 
                        onClick={(e) => {
                            e.stopPropagation();
                            onToggleStatus(food.itemId, isAvailable);
                        }}
                        style={{
                            backgroundColor: isAvailable ? 'rgba(40, 167, 69, 0.1)' : 'rgba(108, 117, 125, 0.1)',
                            color: isAvailable ? '#28a745' : '#6c757d',
                            border: 'none',
                            borderRadius: '8px',
                            padding: '6px 10px',
                            fontSize: '12px',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '6px',
                            fontWeight: '500'
                        }}
                    >
                        <i className={`fas ${isAvailable ? 'fa-eye' : 'fa-eye-slash'}`}></i>
                        {isAvailable ? 'Hiện' : 'Ẩn'}
                    </button>

                    {/* CỤM NÚT SỬA/XÓA (GÓC PHẢI) - Màu nhạt trong suốt */}
                    <div style={{ display: 'flex', gap: '8px' }}>
                        <button 
                            onClick={() => onEdit(food)} 
                            title="Sửa"
                            style={{ 
                                padding: '8px 10px', 
                                backgroundColor: 'rgba(255, 193, 7, 0.15)', // Vàng nhạt trong suốt
                                color: '#d39e00',
                                border: 'none', 
                                borderRadius: '8px', 
                                cursor: 'pointer' 
                            }}
                        >
                            <i className="fas fa-edit"></i>
                        </button>
                        <button 
                            onClick={() => onDelete(food.itemId)} 
                            title="Xóa"
                            style={{ 
                                padding: '8px 10px', 
                                backgroundColor: 'rgba(220, 53, 69, 0.1)', // Đỏ nhạt trong suốt
                                color: '#dc3545',
                                border: 'none', 
                                borderRadius: '8px', 
                                cursor: 'pointer' 
                            }}
                        >
                            <i className="fas fa-trash"></i>
                        </button>
                    </div>

                </div>
            </div>
        </div>
    );
};

export default MenuItemCard;