import React from 'react';
import styles from './ManageShipper.module.css';

const ManageShipper = ({ 
    shippers, restaurants, showModal, formData, setFormData, 
    onSave, onEdit, onDelete, onClose, isEditMode, loading, setShowModal 
}) => {
    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <div>
                    <h3 className={styles.title}>Quản lý nhân sự Shipper</h3>
                    <p className={styles.subtitle}>Tổng cộng {shippers.length} tài xế</p>
                </div>
                <button onClick={() => setShowModal(true)} className={styles.btnAddPrimary}>
                    <i className="fas fa-plus"></i> THÊM TÀI XẾ MỚI
                </button>
            </div>

            <div className={styles.tableWrapper}>
                <table className={styles.table}>
                    <thead>
                        <tr className={styles.theadTr}>
                            <th className={styles.th}>Tài xế / SĐT</th>
                            <th className={styles.th}>Thuộc nhà hàng</th>
                            <th className={styles.th}>Biển số</th>
                            <th className={styles.th} style={{textAlign:'center'}}>Trạng thái</th>
                            <th className={styles.th} style={{textAlign:'right'}}>Thao tác</th>
                        </tr>
                    </thead>
                    <tbody>
                        {shippers.map(s => (
                            <tr key={s.shipperId} className={styles.trBody}>
                                <td className={styles.tdLeft}>
                                    <div className={styles.shipperInfo}>
                                        <div className={styles.avatar}>{s.shipperName?.charAt(0)}</div>
                                        <div>
                                            <div className={styles.sName}>{s.shipperName}</div>
                                            <div className={styles.sPhone}>{s.phone}</div>
                                        </div>
                                    </div>
                                </td>
                                <td className={styles.tdMid}>{s.restaurant?.resName}</td>
                                <td className={styles.tdMid}>{s.vehicleNo}</td>
                                <td className={styles.tdCenter}>
                                    {/* Fix lỗi NULL: Mặc định là xanh nếu không phải BUSY */}
                                    <span className={`${styles.statusBadge} ${s.status === 'BUSY' ? styles.dotBusy : styles.dotIdle}`}>
                                        {s.status === 'BUSY' ? 'Đang đi đơn' : 'Sẵn sàng'}
                                    </span>
                                </td>
                                <td className={styles.tdRight}>
                                    <div className={styles.actionGroup}>
                                        <button className={`${styles.actionBtn} ${styles.editBtn}`} onClick={() => onEdit(s)}>
                                            <i className="fas fa-edit"></i>
                                        </button>
                                        <button className={`${styles.actionBtn} ${styles.deleteBtn}`} onClick={() => onDelete(s.shipperId)}>
                                            <i className="fas fa-trash-alt"></i>
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {showModal && (
                <div className={styles.overlay}>
                    <div className={styles.modalBody}>
                        <h3>{isEditMode ? "Cập nhật Shipper" : "Đăng ký Shipper mới"}</h3>
                        <input className={styles.mInput} placeholder="Tên tài xế" value={formData.shipperName} onChange={e => setFormData({...formData, shipperName: e.target.value})} />
                        <input className={styles.mInput} placeholder="Số điện thoại" value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} />
                        <input className={styles.mInput} placeholder="Biển số xe" value={formData.vehicleNo} onChange={e => setFormData({...formData, vehicleNo: e.target.value})} />
                        <select className={styles.mInput} value={formData.resId} onChange={e => setFormData({...formData, resId: e.target.value})}>
                            <option value="">-- Chọn nhà hàng --</option>
                            {restaurants.map(r => <option key={r.resId} value={r.resId}>{r.resName}</option>)}
                        </select>
                        <div style={{display:'flex', gap:'12px', marginTop:'15px'}}>
                            <button onClick={onClose} className={styles.btnCancel}>Hủy bỏ</button>
                            <button onClick={onSave} className={styles.btnAddPrimary} style={{flex: 2}}>
                                <i className="fas fa-save"></i> {isEditMode ? " Cập nhật" : " Lưu hệ thống"}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ManageShipper;