import React from 'react';

// Khai báo styles ở ngoài để component gọi lúc nào cũng thấy
const styles = {
    card: { 
        position: 'relative', display: 'flex', flexDirection: 'column', height: '100%',
        borderRadius: '16px', overflow: 'hidden', transition: 'all 0.3s',
        backgroundColor: '#1c1e26', border: '1px solid #2d313d', boxShadow: '0 10px 20px rgba(0,0,0,0.2)'
    },
    cardBody: { flex: 1, display: 'flex', flexDirection: 'column', padding: '18px' },
    actionRow: { marginTop: 'auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center' },
    toggleBtn: { 
        border: 'none', borderRadius: '10px', padding: '6px 12px', fontSize: '12px', 
        cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px', fontWeight: '600' 
    },
    editBtn: { 
        padding: '8px 12px', backgroundColor: 'rgba(243, 156, 18, 0.15)', 
        color: '#f39c12', border: 'none', borderRadius: '10px', cursor: 'pointer' 
    },
    deleteBtn: { 
        padding: '8px 12px', backgroundColor: 'rgba(231, 76, 60, 0.15)', 
        color: '#e74c3c', border: 'none', borderRadius: '10px', cursor: 'pointer' 
    }
};

const MenuItemCard = ({ food, onEdit, onDelete, onToggleStatus }) => {
    const isAvailable = food.is_available === 1 || food.isAvailable === 1;
    const foodId = food.itemId || food.item_id; 
    const imageName = food.item_image || food.itemImage;

    // Ảnh mặc định bằng Base64 (Cực nhẹ, 100% hiện)
    const fallbackImage = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII=";

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
            <div className="card-img" style={{ backgroundColor: '#f0f0f0' }}>
                <img 
                    // ✅ THÊM: Timestamp ?t= để trình duyệt luôn tải ảnh mới nhất nếu cùng tên file
                    src={imageName ? `http://localhost:8080/uploads/${imageName}?t=${Date.now()}` : fallbackImage} 
                    alt={food.item_name || food.itemName}
                    style={{ 
                        width: '100%', 
                        height: '160px', 
                        objectFit: 'cover',
                        filter: isAvailable ? 'none' : 'grayscale(100%) opacity(0.7)'
                    }}
                    onError={(e) => { 
                        e.target.onerror = null; 
                        e.target.src = fallbackImage; 
                    }}
                />
            </div>

            <div className="card-body" style={{ flex: 1, display: 'flex', flexDirection: 'column', padding: '15px' }}>
                <div className="card-title" style={{ 
                    fontWeight: '600', 
                    fontSize: '16px',
                    marginBottom: '5px',
                    color: isAvailable ? '#333' : '#999'
                }}>
                    {food.item_name || food.itemName}
                </div>

                <div className="card-price" style={{ 
                    color: isAvailable ? '#28a745' : '#ccc', 
                    fontWeight: 'bold', 
                    fontSize: '15px',
                    marginBottom: '20px' 
                }}>
                    {Number(food.price).toLocaleString()} đ
                </div>

                <div style={{ 
                    marginTop: 'auto', 
                    display: 'flex', 
                    justifyContent: 'space-between', 
                    alignItems: 'center' 
                }}>
                    <button 
                        onClick={(e) => {
                            e.stopPropagation();
                            onToggleStatus(foodId, isAvailable);
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

                    <div style={{ display: 'flex', gap: '8px' }}>
                        <button 
                            onClick={() => onEdit(food)} 
                            title="Sửa"
                            style={{ 
                                padding: '8px 10px', 
                                backgroundColor: 'rgba(255, 193, 7, 0.15)', 
                                color: '#d39e00',
                                border: 'none', 
                                borderRadius: '8px', 
                                cursor: 'pointer' 
                            }}
                        >
                            <i className="fas fa-edit"></i>
                        </button>
                        <button 
                            onClick={() => onDelete(foodId)} 
                            title="Xóa"
                            style={{ 
                                padding: '8px 10px', 
                                backgroundColor: 'rgba(220, 53, 69, 0.1)', 
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