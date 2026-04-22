import React from 'react';
import styles from './ManageRestaurant.module.css';

const ManageRestaurant = ({ list = [], onUpdateStatus, onDelete, onEdit, onRefresh }) => {
    const noLogo = "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='100' height='100' viewBox='0 0 100 100'><rect width='100' height='100' fill='%23f1f5f9'/><text x='50%25' y='50%25' font-family='Arial' font-size='10' fill='%2394a3b8' text-anchor='middle' dy='.3em'>No Image</text></svg>";

    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <div>
                    <h3 className={styles.title}>Hệ thống nhà hàng</h3>
                    <p className={styles.subtitle}>
                        Tổng cộng <span className={styles.countHighlight}>{list.length}</span> đối tác
                    </p>
                </div>
                <button title="Làm mới dữ liệu" onClick={onRefresh} className={styles.refreshBtn}>
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
                        {list.length > 0 ? (
                            list.map(res => (
                                <tr key={res.resId} className={styles.trBody}>
                                    <td className={styles.tdName}>
                                        <div className={styles.resInfo}>
                                            <img 
                                                src={res.resImage ? `http://localhost:8080/uploads/${res.resImage}` : noLogo} 
                                                alt="logo" 
                                                className={styles.resLogo}
                                                onError={(e) => { e.target.src = noLogo; }}
                                            />
                                            <div className={styles.resName}>{res.resName}</div>
                                        </div>
                                    </td>
                                    <td className={styles.tdAddress}>
                                        <div className={styles.addressText}>{res.resAddress}</div>
                                    </td>
                                    <td className={styles.tdStatus}>
                                        <span className={`${styles.statusBadge} ${res.isActive === 0 ? styles.statusBadgeInactive : ''}`}>
                                            {res.isActive === 1 ? 'Hoạt động' : 'Đã khóa'}
                                        </span>
                                    </td>
                                    <td className={styles.tdActions}>
                                        <div className={styles.actionGroup}>
                                            <button 
                                                title="Sửa" 
                                                className={`${styles.actionBtn} ${styles.editBtn}`} 
                                                onClick={() => onEdit && onEdit(res)}
                                            >
                                                <i className="fas fa-pen"></i>
                                            </button>
                                            
                                            <button 
                                                title={res.isActive === 1 ? "Khóa" : "Mở"} 
                                                className={`${styles.actionBtn} ${styles.lockBtn}`} 
                                                onClick={() => onUpdateStatus && onUpdateStatus(res, res.isActive === 1 ? 0 : 1)}
                                            >
                                                <i className={res.isActive === 1 ? "fas fa-lock" : "fas fa-lock-open"}></i>
                                            </button>
                                            
                                            <button 
                                                title="Xóa" 
                                                className={`${styles.actionBtn} ${styles.deleteBtn}`} 
                                                onClick={() => onDelete && onDelete(res.resId)}
                                            >
                                                <i className="fas fa-trash-alt"></i>
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="4" className={styles.emptyTd}>
                                    <i className="fas fa-inbox" style={{display: 'block', marginBottom: '10px', fontSize: '24px'}}></i>
                                    Không có dữ liệu sếp ơi
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default ManageRestaurant;