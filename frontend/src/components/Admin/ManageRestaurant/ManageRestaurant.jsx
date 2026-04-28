import React, { useState } from 'react';
import adminApi from '../../../api/adminApi'; 
import styles from './ManageRestaurant.module.css';

const ManageRestaurant = ({ list = [], onUpdateStatus, onDelete, onSaveEdit, onRefresh, loading }) => {
    const [showModal, setShowModal] = useState(false);
    const [selectedRes, setSelectedRes] = useState(null);
    const [isUploading, setIsUploading] = useState(false);

    const noLogo = "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='100' height='100' viewBox='0 0 100 100'><rect width='100' height='100' fill='%23f1f5f9'/></svg>";

    const handleOpenModal = (res) => {
        setSelectedRes({ ...res });
        setShowModal(true);
    };

    const handleCloseModal = () => {
        setShowModal(false);
        setSelectedRes(null);
    };

    const handleImageChange = async (e) => {
        const file = e.target.files[0];
        if (!file) return;
        try {
            setIsUploading(true);
            // Gọi upload qua Axios
            const res = await adminApi.uploadResImage(file);
            const fileName = res.data || res;
            setSelectedRes(prev => ({ ...prev, resImage: fileName }));
        } catch (error) {
            alert("Lỗi upload ảnh!");
        } finally {
            setIsUploading(false);
        }
    };

    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <div>
                    <h3 className={styles.title}>Hệ thống nhà hàng</h3>
                    <p className={styles.subtitle}>Tổng cộng <span className={styles.countHighlight}>{list.length}</span> đối tác</p>
                </div>
                <button onClick={onRefresh} className={`${styles.refreshBtn} ${loading ? styles.spin : ''}`}>
                    <i className="fas fa-sync-alt"></i>
                </button>
            </div>

            <div className={styles.tableWrapper}>
                <table className={styles.table}>
                    <thead>
                        <tr className={styles.theadTr}>
                            <th className={styles.th} style={{textAlign: 'left'}}>Nhà hàng</th>
                            <th className={styles.th} style={{textAlign: 'left'}}>Địa chỉ</th>
                            <th className={styles.th} style={{textAlign: 'center'}}>Trạng thái</th>
                            <th className={styles.th} style={{textAlign: 'right'}}>Thao tác</th>
                        </tr>
                    </thead>
                    <tbody>
                        {list.map(res => (
                            <tr key={res.resId} className={styles.trBody}>
                                <td className={styles.tdName}>
                                    <div className={styles.resInfo}>
                                        <img 
                                            src={res.resImage ? `http://localhost:8080/uploads/${res.resImage}` : noLogo} 
                                            alt="logo" className={styles.resLogo}
                                            onError={(e) => { e.target.src = noLogo; }}
                                        />
                                        <div className={styles.resName}>{res.resName}</div>
                                    </div>
                                </td>
                                <td className={styles.tdAddress}><div className={styles.addressText}>{res.resAddress}</div></td>
                                <td className={styles.tdStatus}>
                                    <span className={`${styles.statusBadge} ${res.isActive === 0 ? styles.statusBadgeInactive : ''}`}>
                                        {res.isActive === 1 ? 'Hoạt động' : 'Đã khóa'}
                                    </span>
                                </td>
                                <td className={styles.tdActions}>
                                    <div className={styles.actionGroup}>
                                        <button className={`${styles.actionBtn} ${styles.editBtn}`} onClick={() => handleOpenModal(res)} title="Sửa">
                                            <i className="fas fa-pen"></i>
                                        </button>
                                        <button className={`${styles.actionBtn} ${styles.lockBtn}`} onClick={() => onUpdateStatus(res)} title="Đổi trạng thái">
                                            <i className={res.isActive === 1 ? "fas fa-lock" : "fas fa-lock-open"}></i>
                                        </button>
                                        <button className={`${styles.actionBtn} ${styles.deleteBtn}`} onClick={() => onDelete(res.resId)} title="Xóa">
                                            <i className="fas fa-trash-alt"></i>
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* MODAL SỬA ĐỔI */}
            {showModal && selectedRes && (
                <div className={styles.modalOverlay}>
                    <div className={styles.modalContent}>
                        <div className={styles.modalHeader}>
                            <h3>Cập nhật hồ sơ quán</h3>
                            <button onClick={handleCloseModal} className={styles.closeBtn}>&times;</button>
                        </div>
                        <div className={styles.modalBody}>
                            <div className={styles.imageUploadSection}>
                                <div className={styles.previewWrapper}>
                                    <img 
                                        src={selectedRes.resImage ? `http://localhost:8080/uploads/${selectedRes.resImage}` : noLogo} 
                                        className={styles.modalResLogo} alt="Preview"
                                        onError={(e) => { e.target.src = noLogo; }}
                                    />
                                    <label className={styles.uploadLabel}>
                                        <i className="fas fa-camera"></i>
                                        <input type="file" hidden onChange={handleImageChange} accept="image/*" />
                                    </label>
                                </div>
                                {isUploading && <small style={{color: '#2563eb'}}>Đang tải ảnh...</small>}
                            </div>
                            <div className={styles.formGroup}>
                                <label>Tên nhà hàng</label>
                                <input type="text" value={selectedRes.resName} onChange={(e) => setSelectedRes({...selectedRes, resName: e.target.value})} />
                            </div>
                            <div className={styles.formGroup}>
                                <label>Địa chỉ trụ sở</label>
                                <textarea rows="3" value={selectedRes.resAddress} onChange={(e) => setSelectedRes({...selectedRes, resAddress: e.target.value})} />
                            </div>
                        </div>
                        <div className={styles.modalFooter}>
                            <button className={styles.btnCancel} onClick={handleCloseModal}>Hủy</button>
                            <button className={styles.btnSave} onClick={async () => { await onSaveEdit(selectedRes); handleCloseModal(); }} disabled={isUploading}>
                                {isUploading ? 'Chờ tí...' : 'Lưu dữ liệu'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ManageRestaurant;