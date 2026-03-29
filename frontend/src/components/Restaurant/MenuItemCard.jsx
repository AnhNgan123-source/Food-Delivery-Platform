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
    // === PHẦN LOGIC MỚI (Khớp với Java Entity) ===
    const isAvailable = food.isAvailable === 1; // Backend dùng Integer 1/0
    const foodId = food.itemId;                 // Backend dùng itemId
    const imageName = food.itemImage;           // Backend dùng itemImage

    // Ảnh mặc định nếu món chưa có ảnh
    const fallbackImage = "https://via.placeholder.com/150?text=No+Image";

    return (
        <div className="card" style={styles.card}>
            {/* PHẦN HÌNH ẢNH - Giữ nguyên Style cũ */}
            <div className="card-img" style={{ backgroundColor: '#f0f0f0' }}>
                <img 
                    // Logic ảnh mới: Gọi qua cổng /uploads/ và thêm timestamp chống cache
                    src={imageName ? `http://localhost:8080/uploads/${imageName}?t=${Date.now()}` : fallbackImage} 
                    alt={food.itemName}
                    style={{ 
                        width: '100%', 
                        height: '160px', 
                        objectFit: 'cover',
                        // Giữ nguyên hiệu ứng làm mờ khi hết hàng
                        filter: isAvailable ? 'none' : 'grayscale(100%) opacity(0.7)'
                    }}
                    onError={(e) => { 
                        e.target.onerror = null; 
                        e.target.src = fallbackImage; 
                    }}
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
                    {food.itemName}
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