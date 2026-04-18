import React from 'react';

const ApproveRestaurant = ({ list, onUpdateStatus, onRefresh, actionBtnBase }) => {
    // Fallback cho ảnh nếu nhà hàng không có logo
    const noLogo = "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='100' height='100' viewBox='0 0 100 100'><rect width='100' height='100' fill='%23f1f5f9'/><text x='50%25' y='50%25' font-family='Arial' font-size='10' fill='%2394a3b8' text-anchor='middle' dy='.3em'>No Image</text></svg>";

    return (
        <div className="admin-section" style={{ background: '#fff', borderRadius: '24px', padding: '30px', boxShadow: '0 4px 20px rgba(0,0,0,0.03)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '30px', alignItems: 'center' }}>
                <div>
                    <h3 style={{ margin: 0, color: '#1e293b', fontSize: '20px', fontWeight: '700' }}>Yêu cầu xét duyệt</h3>
                    <p style={{ margin: '5px 0 0', color: '#64748b', fontSize: '14px' }}>
                        Có <span style={{ color: '#ef4444', fontWeight: '700' }}>{list.length}</span> đối tác đang chờ phê duyệt
                    </p>
                </div>
                {/* Button Làm mới dạng icon tròn cho đồng bộ */}
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
                    <i className="fas fa-sync-alt"></i>
                </button>
            </div>
            
            <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'separate', borderSpacing: '0 12px' }}>
                    <thead>
                        <tr style={{ color: '#94a3b8', fontSize: '12px', textTransform: 'uppercase', letterSpacing: '0.1em' }}>
                            <th style={{ textAlign: 'left', padding: '0 20px' }}>Đối tác mới</th>
                            <th style={{ textAlign: 'left', padding: '0 20px' }}>Địa chỉ</th>
                            <th style={{ textAlign: 'center', padding: '0 20px' }}>Trạng thái</th>
                            <th style={{ textAlign: 'right', padding: '0 20px' }}>Thao tác</th>
                        </tr>
                    </thead>
                    <tbody>
                        {list.length > 0 ? (
                            list.map(res => (
                                <tr key={res.resId} style={{ background: '#fff' }} className="table-row-hover">
                                    <td style={{ padding: '15px 20px', borderTop: '1px solid #f8fafc', borderBottom: '1px solid #f8fafc', borderLeft: '1px solid #f8fafc', borderRadius: '16px 0 0 16px' }}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                                            <img 
                                                src={res.resImage ? `http://localhost:8080/uploads/${res.resImage}` : noLogo} 
                                                alt="logo" 
                                                style={{ width: '48px', height: '48px', borderRadius: '12px', objectFit: 'cover' }}
                                            />
                                            <div style={{ color: '#1e293b', fontWeight: '700', fontSize: '15px' }}>{res.resName}</div>
                                        </div>
                                    </td>

                                    <td style={{ padding: '15px 20px', borderTop: '1px solid #f8fafc', borderBottom: '1px solid #f8fafc' }}>
                                        <div style={{ color: '#64748b', fontSize: '13px', maxWidth: '250px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                                            <i className="fas fa-map-marker-alt" style={{ marginRight: '6px', opacity: 0.5 }}></i>
                                            {res.resAddress}
                                        </div>
                                    </td>

                                    <td style={{ padding: '15px 20px', borderTop: '1px solid #f8fafc', borderBottom: '1px solid #f8fafc', textAlign: 'center' }}>
                                        <span style={{ background: '#fff1f2', color: '#e11d48', padding: '4px 12px', borderRadius: '8px', fontSize: '12px', fontWeight: '600' }}>
                                            Đợi duyệt
                                        </span>
                                    </td>

                                    <td style={{ padding: '15px 20px', borderTop: '1px solid #f8fafc', borderBottom: '1px solid #f8fafc', borderRight: '1px solid #f8fafc', borderRadius: '0 16px 16px 0', textAlign: 'right' }}>
                                        <button 
                                            style={{ 
                                                ...actionBtnBase, 
                                                background: '#0ea5e9', 
                                                color: '#fff',
                                                padding: '10px 18px',
                                                borderRadius: '10px',
                                                border: 'none',
                                                fontWeight: '600',
                                                fontSize: '13px'
                                            }} 
                                            onClick={() => onUpdateStatus(res, 1)}
                                        >
                                            <i className="fas fa-check-circle" style={{ marginRight: '6px' }}></i> Phê duyệt
                                        </button>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="4" style={{ textAlign: 'center', padding: '60px', color: '#cbd5e1' }}>
                                    <i className="fas fa-check-double" style={{ fontSize: '24px', marginBottom: '10px', display: 'block' }}></i>
                                    Sạch sẽ! Không còn yêu cầu nào.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default ApproveRestaurant;