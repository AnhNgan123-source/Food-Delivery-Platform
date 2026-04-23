import React from 'react';
import styles from './ApproveRestaurant.module.css';

const ApproveRestaurant = ({ list = [], onUpdateStatus, onRefresh, actionBtnBase }) => {
    const noLogo = "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='100' height='100' viewBox='0 0 100 100'><rect width='100' height='100' fill='%23f1f5f9'/><text x='50%25' y='50%25' font-family='Arial' font-size='10' fill='%2394a3b8' text-anchor='middle' dy='.3em'>No Image</text></svg>";

    const safeList = Array.isArray(list) ? list : [];

    return (
        <div className={styles.sectionContainer}>
            <div className={styles.header}>
                <div>
                    <h3 className={styles.title}>Yêu cầu xét duyệt</h3>
                    <p className={styles.subtitle}>
                        Có <span className={styles.count}>{safeList.length}</span> đối tác đang chờ phê duyệt
                    </p>
                </div>
                <button 
                    title="Làm mới dữ liệu"
                    onClick={onRefresh} 
                    className={styles.refreshBtn}
                >
                    <i className="fas fa-sync-alt"></i>
                </button>
            </div>
            
            <div className={styles.tableWrapper}>
                <table className={styles.table}>
                    <thead>
                        <tr className={styles.tableHeaderRow}>
                            <th style={{ textAlign: 'left' }}>Đối tác mới</th>
                            <th style={{ textAlign: 'left' }}>Địa chỉ</th>
                            <th style={{ textAlign: 'center' }}>Trạng thái</th>
                            <th style={{ textAlign: 'right' }}>Thao tác</th>
                        </tr>
                    </thead>
                    <tbody>
                        {safeList.length > 0 ? (
                            safeList.map(res => (
                                <tr key={res.resId} className={styles.tableRow}>
                                    <td className={styles.tdLeft}>
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

                                    <td className={styles.tdMid}>
                                        <div className={styles.addressText}>
                                            <i className="fas fa-map-marker-alt"></i>
                                            {res.resAddress}
                                        </div>
                                    </td>

                                    <td className={styles.tdCenter}>
                                        <span className={styles.statusBadge}>
                                            Đợi duyệt
                                        </span>
                                    </td>

                                    <td className={styles.tdRight}>
                                        <button 
                                            className={styles.approveBtn}
                                            style={actionBtnBase}
                                            onClick={() => onUpdateStatus && onUpdateStatus(res, 1)}
                                        >
                                            <i className="fas fa-check-circle"></i> Phê duyệt
                                        </button>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="4" className={styles.emptyState}>
                                    <i className="fas fa-check-double"></i>
                                    <p>Sạch sẽ! Không còn yêu cầu nào.</p>
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