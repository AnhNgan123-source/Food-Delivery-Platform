import React from 'react';
import styles from './ManageShipper.module.css';

const ManageShipper = ({ 
    shippers = [], 
    restaurants = [], 
    showModal, 
    setShowModal, 
    formData, 
    setFormData, 
    onSave, 
    onDelete 
}) => {
    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <div>
                    <h3 className={styles.title}>Quản lý nhân sự Shipper</h3>
                    <p className={styles.subtitle}>
                        Tổng cộng <span className={styles.countHighlight}>{shippers.length}</span> tài xế toàn hệ thống
                    </p>
                </div>
                {/* Nút thêm mới style đồng bộ */}
                <button onClick={() => setShowModal(true)} className={styles.btnAddPrimary}>
                    <i className="fas fa-plus"></i> THÊM TÀI XẾ MỚI
                </button>
            </div>

            <div className={styles.tableWrapper}>
                <table className={styles.table}>
                    <thead>
                        <tr className={styles.theadTr}>
                            <th className={styles.th} style={{textAlign: 'left'}}>Tài xế / SĐT</th>
                            <th className={styles.th} style={{textAlign: 'left'}}>Thuộc nhà hàng</th>
                            <th className={styles.th} style={{textAlign: 'left'}}>Biển số</th>
                            <th className={styles.th} style={{textAlign: 'center'}}>Trạng thái</th>
                            <th className={styles.th} style={{textAlign: 'right'}}>Thao tác</th>
                        </tr>
                    </thead>
                    <tbody>
                        {shippers.length > 0 ? (
                            shippers.map(s => (
                                <tr key={s.shipperId} className={styles.trBody}>
                                    {/* Sử dụng tdLeft, tdMid, tdRight để bo góc giống trang nhà hàng */}
                                    <td className={styles.tdLeft}>
                                        <div className={styles.shipperInfo}>
                                            <div className={styles.avatar}>{s.shipperName?.charAt(0)}</div>
                                            <div>
                                                <div className={styles.sName}>{s.shipperName}</div>
                                                <div className={styles.sPhone}>{s.phone}</div>
                                            </div>
                                        </div>
                                    </td>
                                    
                                    <td className={styles.tdMid}>
                                        <span className={styles.resNameTxt}>{s.restaurant?.resName || "N/A"}</span>
                                    </td>
                                    
                                    <td className={styles.tdMid}>
                                        <span className={styles.plateStyle}>{s.vehicleNo}</span>
                                    </td>
                                    
                                    <td className={styles.tdCenter}>
                                        <span className={`${styles.statusBadge} ${s.status === 'IDLE' ? styles.dotIdle : styles.dotBusy}`}>
                                            {s.status === 'IDLE' ? 'Sẵn sàng' : 'Đang đi đơn'}
                                        </span>
                                    </td>
                                    
                                    <td className={styles.tdRight}>
                                        <div className={styles.actionGroup}>
                                            {/* Thay nút "Xóa" chữ bằng Icon giống trang nhà hàng */}
                                            <button 
                                                title="Xóa tài xế" 
                                                className={`${styles.actionBtn} ${styles.deleteBtn}`} 
                                                onClick={() => onDelete(s.shipperId)}
                                            >
                                                <i className="fas fa-trash-alt"></i>
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="5" className={styles.emptyTd}>
                                    <i className="fas fa-user-slash" style={{display:'block', marginBottom:'10px', fontSize:'24px'}}></i>
                                    Không có tài xế nào sếp ơi
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            {showModal && (
                <div className={styles.overlay}>
                    <div className={styles.modalBody}>
                        <h3 style={{marginTop:0, fontSize:'18px', fontWeight:700, color:'#0f172a'}}>Đăng ký Shipper mới</h3>
                        <p style={{fontSize:'13px', color:'#64748b', marginBottom:'20px'}}>Nhập thông tin và gán tài xế vào nhà hàng.</p>
                        
                        <input className={styles.mInput} placeholder="Tên tài xế" value={formData.shipperName} onChange={e => setFormData({...formData, shipperName: e.target.value})} />
                        <input className={styles.mInput} placeholder="Số điện thoại" value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} />
                        <input className={styles.mInput} placeholder="Biển số xe (VD: 29A-123.45)" value={formData.vehicleNo} onChange={e => setFormData({...formData, vehicleNo: e.target.value})} />
                        
                        <select className={styles.mInput} value={formData.resId} onChange={e => setFormData({...formData, resId: e.target.value})}>
                            <option value="">-- Chọn nhà hàng quản lý --</option>
                            {restaurants?.map(r => (
                                <option key={r.resId} value={r.resId}>{r.resName}</option>
                            ))}
                        </select>

                        <div style={{display:'flex', gap:'12px', marginTop:'15px'}}>
                            <button onClick={() => setShowModal(false)} className={styles.btnCancel}>Hủy bỏ</button>
                            <button onClick={onSave} className={styles.btnAddPrimary} style={{flex: 2, justifyContent:'center'}}>
                                <i className="fas fa-save"></i> Lưu vào hệ thống
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ManageShipper;