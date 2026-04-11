import React from 'react';

const ShippingConfig = ({ shippingFees, setShippingFees, handleSaveShippingFees }) => {
    return (
        <div style={{ background: '#fff', borderRadius: '20px', padding: '35px', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
            <div style={{ marginBottom: '30px' }}>
                <h3 style={{ fontSize: '20px', color: '#1e293b', fontWeight: '700', margin: '0 0 10px 0' }}>
                    <i className="fas fa-map-marked-alt" style={{ color: '#3b82f6', marginRight: '10px' }}></i> 
                    Cấu hình phí vận chuyển TP.HCM
                </h3>
                <p style={{ color: '#64748b', fontSize: '14px' }}>Thiết lập mức phí vận chuyển cố định cho khu vực Nội thành và Ngoại thành.</p>
            </div>
            
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '30px' }}>
                {shippingFees.map((fee, idx) => (
                    <div key={idx} style={{ 
                        padding: '25px', 
                        borderRadius: '20px', 
                        background: fee.areaName === 'Nội thành' ? '#f0f9ff' : '#fff7ed', 
                        border: `1px solid ${fee.areaName === 'Nội thành' ? '#e0f2fe' : '#ffedd5'}`,
                        position: 'relative',
                        overflow: 'hidden'
                    }}>
                        <div style={{ position: 'absolute', top: '-10px', right: '-10px', fontSize: '80px', opacity: '0.05', color: '#000' }}>
                            <i className={fee.areaName === 'Nội thành' ? 'fas fa-city' : 'fas fa-tree'}></i>
                        </div>
                        <h4 style={{ color: fee.areaName === 'Nội thành' ? '#0369a1' : '#9a3412', margin: '0 0 8px 0', fontSize: '18px' }}>{fee.areaName}</h4>
                        <p style={{ fontSize: '12px', color: fee.areaName === 'Nội thành' ? '#0c4a6e' : '#7c2d12', marginBottom: '20px' }}>
                            {fee.areaName === 'Nội thành' ? 'Áp dụng cho các Quận trung tâm (Q.1, 3, 5, 10...)' : 'Áp dụng cho các Huyện (Cần Giờ, Nhà Bè, Củ Chi...)'}
                        </p>
                        <div style={{ position: 'relative' }}>
                            <input 
                                type="number" 
                                value={fee.price} 
                                onChange={(e) => {
                                    const newFees = [...shippingFees];
                                    newFees[idx].price = e.target.value;
                                    setShippingFees(newFees);
                                }}
                                style={{ width: '100%', padding: '15px 50px 15px 20px', borderRadius: '12px', border: '1px solid #cbd5e1', fontSize: '20px', fontWeight: '800', color: '#1e293b', outline: 'none' }} 
                            />
                            <span style={{ position: 'absolute', right: '20px', top: '50%', transform: 'translateY(-50%)', fontWeight: '700', color: '#94a3b8' }}>đ</span>
                        </div>
                    </div>
                ))}
            </div>

            <div style={{ marginTop: '40px', borderTop: '1px solid #f1f5f9', paddingTop: '30px', textAlign: 'right' }}>
                <button 
                    className="wf-btn-primary" 
                    onClick={() => handleSaveShippingFees(shippingFees)}// nhận vào mảng tiền phí mới 
                    style={{ padding: '15px 40px', borderRadius: '12px', fontWeight: '700', fontSize: '15px', boxShadow: '0 10px 15px -3px rgba(59, 130, 246, 0.3)' }}
                >
                    <i className="fas fa-save" style={{ marginRight: '8px' }}></i> Lưu thay đổi
                </button>
            </div>
        </div>
    );
};

export default ShippingConfig;