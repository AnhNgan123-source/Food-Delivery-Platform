import React from 'react';
import styles from './ManageVoucher.module.css';

const ManageVoucher = ({ 
    vouchers = [], showModal, setShowModal, isLoading, 
    newVoucher, setNewVoucher, onCreate, onRefresh 
}) => {
    const getProgress = (used, limit) => Math.min(((used || 0) / (limit || 1)) * 100, 100);

    const formatDate = (dateStr) => {
        if (!dateStr) return '∞';
        const date = new Date(dateStr);
        return date.toLocaleDateString('vi-VN', {
            day: '2-digit', month: '2-digit', year: 'numeric'
        });
    };

    return (
        <div className={styles.container}>
            {/* 1. TOP STATS - Giữ nguyên vì đã đẹp */}
            <div className={styles.statsGrid}>
                <div className={styles.statCard} style={{ background: '#eff6ff', color: '#3b82f6' }}>
                    <div className={styles.statLabel}>Tổng Voucher</div>
                    <div className={styles.statValue}>{vouchers.length}</div>
                </div>
                <div className={styles.statCard} style={{ background: '#f0fdf4', color: '#16a34a' }}>
                    <div className={styles.statLabel}>Đang hoạt động</div>
                    <div className={styles.statValue}>{vouchers.filter(v => v.isActive).length}</div>
                </div>
                <div className={styles.statCard} style={{ background: '#fff1f2', color: '#e11d48' }}>
                    <div className={styles.statLabel}>Lượt đã dùng</div>
                    <div className={styles.statValue}>{vouchers.reduce((acc, v) => acc + (v.usedCount || 0), 0)}</div>
                </div>
            </div>

            {/* 2. MAIN SECTION - Đồng bộ Title */}
            <div className={styles.mainSection}>
                <div className={styles.headerRow}>
                    <div>
                        <h3 className={styles.title}>Chương trình ưu đãi</h3>
                        <p className={styles.subtitle}>Tạo và quản lý các mã giảm giá hệ thống</p>
                    </div>
                    <div style={{ display: 'flex', gap: '12px' }}>
                        <button onClick={onRefresh} className={styles.iconButton} title="Làm mới">
                            <i className="fas fa-sync-alt"></i>
                        </button>
                        <button onClick={() => setShowModal(true)} className={styles.btnPrimary}>
                            <i className="fas fa-plus-circle"></i> TẠO CHIẾN DỊCH
                        </button>
                    </div>
                </div>

                <div className={styles.tableWrapper}>
                    <table className={styles.voucherTable}>
                        <thead>
                            <tr>
                                <th style={{ textAlign: 'left' }}>Mã Giảm Giá</th>
                                <th style={{ textAlign: 'left' }}>Loại & Giá trị</th>
                                <th style={{ textAlign: 'left' }}>Tình trạng sử dụng</th>
                                <th style={{ textAlign: 'center' }}>Hết hạn</th>
                                <th style={{ textAlign: 'right' }}>Thao tác</th>
                            </tr>
                        </thead>
                        <tbody>
                            {vouchers.map(v => (
                                <tr key={v.voucherId} className={styles.trBody}>
                                    <td className={styles.tableCellMain}>
                                        <div className={styles.voucherInfo}>
                                            <div className={styles.ticketIcon}><i className="fas fa-ticket-alt"></i></div>
                                            <div>
                                                <div className={styles.vCode}>{v.code}</div>
                                                <div className={styles.vId}>ID: #{v.voucherId}</div>
                                            </div>
                                        </div>
                                    </td>
                                    <td>
                                        <div className={styles.vValue}>
                                            {v.discountValue?.toLocaleString()}{v.discountType === 'percentage' ? '%' : 'đ'}
                                        </div>
                                        <div className={styles.vType}>
                                            {v.discountType === 'percentage' ? 'Giảm theo %' : 'Khấu trừ tiền mặt'}
                                        </div>
                                    </td>
                                    <td>
                                        <div className={styles.progressHeader}>
                                            <span>{v.usedCount || 0} lượt dùng</span>
                                            <span>Hạn mức: {v.usageLimit}</span>
                                        </div>
                                        <div className={styles.progressBarContainer}>
                                            <div 
                                                className={styles.progressBarFill} 
                                                style={{ width: `${getProgress(v.usedCount, v.usageLimit)}%` }} 
                                            />
                                        </div>
                                    </td>
                                    <td className={styles.dateCell} style={{ textAlign: 'center' }}>
                                        {formatDate(v.endDate)}
                                    </td>
                                    <td style={{ textAlign: 'right' }}>
                                        <button className={styles.deleteBtnIcon} title="Dừng chiến dịch">
                                            <i className="fas fa-stop-circle"></i>
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* 3. MODAL - Giữ nguyên logic sếp đã làm */}
            {showModal && (
                <div className={styles.modalOverlay}>
                    <div className={styles.modalContent}>
                        <h3 className={styles.title} style={{ marginBottom: '10px' }}>Thiết lập Voucher mới</h3>
                        <p className={styles.subtitle} style={{ marginBottom: '25px' }}>Nhập thông số để khởi tạo mã giảm giá mới.</p>
                        
                        <form onSubmit={onCreate} className={styles.modalForm}>
                            <div>
                                <label className={styles.labelTitle}>Mã code định danh</label>
                                <input className={styles.inputField} placeholder="VÍ DỤ: BANMOI2024" value={newVoucher.code} onChange={e => setNewVoucher({...newVoucher, code: e.target.value.toUpperCase()})} required />
                            </div>
                            
                            <div className={styles.inputGrid}>
                                <div>
                                    <label className={styles.labelTitle}>Hình thức giảm</label>
                                    <select className={styles.inputField} value={newVoucher.discountType} onChange={e => setNewVoucher({...newVoucher, discountType: e.target.value})}>
                                        <option value="fixed_amount">Tiền mặt (VNĐ)</option>
                                        <option value="percentage">Phần trăm (%)</option>
                                    </select>
                                </div>
                                <div>
                                    <label className={styles.labelTitle}>Giá trị</label>
                                    <input type="number" className={styles.inputField} value={newVoucher.discountValue} onChange={e => setNewVoucher({...newVoucher, discountValue: e.target.value})} required />
                                </div>
                            </div>

                            <div>
                                <label className={styles.labelTitle}>Ngày kết thúc chiến dịch</label>
                                <input type="date" className={styles.inputField} value={newVoucher.endDate} onChange={e => setNewVoucher({...newVoucher, endDate: e.target.value})} required />
                            </div>

                            <div className={styles.modalActions}>
                                <button type="button" onClick={() => setShowModal(false)} className={styles.btnCancel}>Hủy bỏ</button>
                                <button type="submit" disabled={isLoading} className={styles.btnSave}>
                                    {isLoading ? 'Đang khởi tạo...' : 'Kích hoạt chiến dịch'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ManageVoucher;