import React from 'react';

const ManageRestaurant = ({ list, onUpdateStatus, onDelete, onEdit, onRefresh, actionBtnBase }) => {
    const noLogo = "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='100' height='100' viewBox='0 0 100 100'><rect width='100' height='100' fill='%23f1f5f9'/><text x='50%25' y='50%25' font-family='Arial' font-size='10' fill='%2394a3b8' text-anchor='middle' dy='.3em'>No Image</text></svg>";

    return (
        <div className="admin-section" style={{ background: '#fff', borderRadius: '24px', padding: '30px', boxShadow: '0 4px 20px rgba(0,0,0,0.03)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '30px', alignItems: 'center' }}>
                <div>
                    <h3 style={{ margin: 0, color: '#1e293b', fontSize: '20px', fontWeight: '700' }}>Hệ thống nhà hàng</h3>
                    <p style={{ margin: '5px 0 0', color: '#64748b', fontSize: '14px' }}>
                        Tổng cộng <span style={{ color: '#0ea5e9', fontWeight: '700' }}>{list.length}</span> đối tác
                    </p>
                </div>
                {/* Button Làm mới chỉ có icon, tròn trịa, sang xịn mịn */}
                <button 
                    title="Làm mới dữ liệu"
                    onClick={onRefresh} 
                    style={{ 
                        width: '45px', 
                        height: '45px', 
                        borderRadius: '50%', 
                        border: 'none',
                        background: '#f1f5f9', 
                        color: '#64748b', 
                        display: 'flex', 
                        alignItems: 'center', 
                        justifyContent: 'center',
                        cursor: 'pointer',
                        transition: 'all 0.2s'
                    }}
                    onMouseOver={(e) => e.currentTarget.style.background = '#e2e8f0'}
                    onMouseOut={(e) => e.currentTarget.style.background = '#f1f5f9'}
                >
                    <i className="fas fa-sync-alt" style={{ fontSize: '16px' }}></i>
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
                                <tr key={res.resId} style={{ background: '#fff' }}>
                                    <td style={{ padding: '15px 20px', borderTop: '1px solid #f8fafc', borderBottom: '1px solid #f8fafc', borderLeft: '1px solid #f8fafc', borderRadius: '16px 0 0 16px' }}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                                            <img 
                                                src={res.resImage ? `http://localhost:8080/uploads/${res.resImage}` : noLogo} 
                                                alt="logo" 
                                                style={{ width: '48px', height: '48px', borderRadius: '12px', objectFit: 'cover' }}
                                            />
                                            <div style={{ color: '#1e293b', fontWeight: '600', fontSize: '15px' }}>{res.resName}</div>
                                        </div>
                                    </td>
                                    <td style={{ padding: '15px 20px', borderTop: '1px solid #f8fafc', borderBottom: '1px solid #f8fafc' }}>
                                        <div style={{ color: '#64748b', fontSize: '13px', maxWidth: '200px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                                            {res.resAddress}
                                        </div>
                                    </td>
                                    <td style={{ padding: '15px 20px', borderTop: '1px solid #f8fafc', borderBottom: '1px solid #f8fafc', textAlign: 'center' }}>
                                        <span style={{ color: '#10b981', fontSize: '12px', fontWeight: '600', background: '#ecfdf5', padding: '4px 12px', borderRadius: '8px' }}>
                                            Hoạt động
                                        </span>
                                    </td>
                                    <td style={{ padding: '15px 20px', borderTop: '1px solid #f8fafc', borderBottom: '1px solid #f8fafc', borderRight: '1px solid #f8fafc', borderRadius: '0 16px 16px 0', textAlign: 'right' }}>
                                        <div style={{ display: 'inline-flex', gap: '6px' }}>
                                            <button title="Sửa" style={{ ...actionBtnBase, background: '#e0f2fe', color: '#0ea5e9', border: 'none' }} onClick={() => onEdit(res)}>
                                                <i className="fas fa-pen"></i>
                                            </button>
                                            <button title="Khóa" style={{ ...actionBtnBase, background: '#fff7ed', color: '#f59e0b', border: 'none' }} onClick={() => onUpdateStatus(res, 0)}>
                                                <i className="fas fa-lock"></i>
                                            </button>
                                            <button title="Xóa" style={{ ...actionBtnBase, background: '#fef2f2', color: '#ef4444', border: 'none' }} onClick={() => onDelete(res.resId)}>
                                                <i className="fas fa-trash-alt"></i>
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="4" style={{ textAlign: 'center', padding: '40px', color: '#cbd5e1' }}>Trống</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default ManageRestaurant;