import React from 'react';

const ManageRestaurant = ({ list, onUpdateStatus, onDelete, onEdit, onRefresh }) => {
    const noLogo = "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='100' height='100' viewBox='0 0 100 100'><rect width='100' height='100' fill='%23f1f5f9'/><text x='50%25' y='50%25' font-family='Arial' font-size='10' fill='%2394a3b8' text-anchor='middle' dy='.3em'>No Image</text></svg>";

    // 1. Định nghĩa Style cơ bản cho các nút thao tác (Soft-action)
    const actionBtnBase = {
        width: '36px',
        height: '36px',
        borderRadius: '10px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        border: 'none',
        cursor: 'pointer',
        fontSize: '14px',
        transition: 'all 0.2s ease' 
    };

    // Style riêng cho từng nút (Dùng RGBA cho nền mờ)
    const editBtnStyle = { ...actionBtnBase, backgroundColor: 'rgba(59, 130, 246, 0.15)', color: '#60a5fa' };
    const lockBtnStyle = { ...actionBtnBase, backgroundColor: 'rgba(245, 158, 11, 0.15)', color: '#fbbf24' };
    const deleteBtnStyle = { ...actionBtnBase, backgroundColor: 'rgba(239, 68, 68, 0.15)', color: '#f87171' };

    return (
        <div style={{ background: '#1a1c23', borderRadius: '24px', padding: '30px', border: '1px solid #2d313d' }}>
            {/* Header: Hệ thống nhà hàng */}
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '30px', alignItems: 'center' }}>
                <div>
                    <h3 style={{ margin: 0, color: '#fff', fontSize: '20px', fontWeight: '700' }}>Hệ thống nhà hàng</h3>
                    <p style={{ margin: '5px 0 0', color: '#64748b', fontSize: '14px' }}>
                        Tổng cộng <span style={{ color: '#27ae60', fontWeight: '700' }}>{list.length}</span> đối tác
                    </p>
                </div>
                <button 
                    title="Làm mới"
                    onClick={onRefresh} 
                    style={{ width: '40px', height: '40px', borderRadius: '50%', border: 'none', background: '#2d313d', color: '#a0aec0', cursor: 'pointer', transition: '0.3s' }}
                    onMouseOver={(e) => e.currentTarget.style.background = '#3b3f4d'}
                    onMouseOut={(e) => e.currentTarget.style.background = '#2d313d'}
                >
                    <i className="fas fa-sync-alt"></i>
                </button>
            </div>
            
            <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'separate', borderSpacing: '0 12px' }}>
                    <thead>
                        <tr style={{ color: '#94a3b8', fontSize: '12px', textTransform: 'uppercase', letterSpacing: '0.1em' }}>
                            <th style={{ textAlign: 'left', padding: '0 20px' }}>Nhà hàng</th>
                            <th style={{ textAlign: 'left', padding: '0 20px' }}>Địa chỉ</th>
                            <th style={{ textAlign: 'center', padding: '0 20px' }}>Trạng thái</th>
                            <th style={{ textAlign: 'right', padding: '0 20px' }}>Thao tác</th>
                        </tr>
                    </thead>
                    <tbody>
                        {list.length > 0 ? (
                            list.map(res => (
                                <tr key={res.resId} style={{ background: '#1c1e26' }}>
                                    {/* Cột Tên Nhà hàng */}
                                    <td style={{ padding: '15px 20px', border: '1px solid #2d313d', borderRight: 'none', borderRadius: '16px 0 0 16px' }}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                                            <img 
                                                src={res.resImage ? `http://localhost:8080/uploads/${res.resImage}` : noLogo} 
                                                alt="logo" 
                                                style={{ width: '48px', height: '48px', borderRadius: '12px', objectFit: 'cover' }}
                                            />
                                            <div style={{ color: '#fff', fontWeight: '600', fontSize: '15px' }}>{res.resName}</div>
                                        </div>
                                    </td>

                                    {/* Cột Địa chỉ */}
                                    <td style={{ padding: '15px 20px', borderTop: '1px solid #2d313d', borderBottom: '1px solid #2d313d' }}>
                                        <div style={{ color: '#a0aec0', fontSize: '13px', maxWidth: '250px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                                            {res.resAddress}
                                        </div>
                                    </td>

                                    {/* Cột Trạng thái (Fix lỗi tràn chữ) */}
                                    <td style={{ padding: '15px 20px', borderTop: '1px solid #2d313d', borderBottom: '1px solid #2d313d', textAlign: 'center' }}>
                                        <span style={{ 
                                            color: res.isActive === 1 ? '#2ecc71' : '#e74c3c', 
                                            fontSize: '10px', 
                                            fontWeight: '800', 
                                            background: res.isActive === 1 ? 'rgba(46, 204, 113, 0.1)' : 'rgba(231, 76, 60, 0.1)', 
                                            padding: '4px 10px', 
                                            borderRadius: '8px',
                                            textTransform: 'uppercase',
                                            whiteSpace: 'nowrap' // Đảm bảo không nhảy dòng
                                        }}>
                                            {res.isActive === 1 ? 'Đang hoạt động' : 'Đã khóa'}
                                        </span>
                                    </td>

                                    {/* Cột Thao tác (Sửa logic Sửa/Khóa/Xóa) */}
                                    <td style={{ padding: '15px 20px', border: '1px solid #2d313d', borderLeft: 'none', borderRadius: '0 16px 16px 0', textAlign: 'right' }}>
                                        <div style={{ display: 'inline-flex', gap: '8px' }}>
                                            
                                            {/* Nút Sửa: Logic gọi onEdit(res) để mở Modal */}
                                            <button 
                                                title="Sửa thông tin" 
                                                style={editBtnStyle} 
                                                onClick={() => onEdit(res)}
                                                onMouseOver={(e) => { e.currentTarget.style.backgroundColor = '#3b82f6'; e.currentTarget.style.color = '#fff'; }}
                                                onMouseOut={(e) => { e.currentTarget.style.backgroundColor = 'rgba(59, 130, 246, 0.15)'; e.currentTarget.style.color = '#60a5fa'; }}
                                            >
                                                <i className="fas fa-pen"></i>
                                            </button>

                                            {/* Nút Khóa/Mở: Logic toggle isActive */}
                                            <button 
                                                title={res.isActive === 1 ? "Khóa nhà hàng" : "Mở khóa"} 
                                                style={lockBtnStyle} 
                                                onClick={() => onUpdateStatus(res, res.isActive === 1 ? 0 : 1)}
                                                onMouseOver={(e) => { e.currentTarget.style.backgroundColor = '#f59e0b'; e.currentTarget.style.color = '#fff'; }}
                                                onMouseOut={(e) => { e.currentTarget.style.backgroundColor = 'rgba(245, 158, 11, 0.15)'; e.currentTarget.style.color = '#fbbf24'; }}
                                            >
                                                <i className={res.isActive === 1 ? "fas fa-lock" : "fas fa-lock-open"}></i>
                                            </button>

                                            {/* Nút Xóa: Logic gọi onDelete với resId */}
                                            <button 
                                                title="Xóa vĩnh viễn" 
                                                style={deleteBtnStyle} 
                                                onClick={() => onDelete(res.resId)}
                                                onMouseOver={(e) => { e.currentTarget.style.backgroundColor = '#ef4444'; e.currentTarget.style.color = '#fff'; }}
                                                onMouseOut={(e) => { e.currentTarget.style.backgroundColor = 'rgba(239, 68, 68, 0.15)'; e.currentTarget.style.color = '#f87171'; }}
                                            >
                                                <i className="fas fa-trash-alt"></i>
                                            </button>
                                            
                                        </div>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="4" style={{ textAlign: 'center', padding: '40px', color: '#64748b' }}>Trống</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default ManageRestaurant;