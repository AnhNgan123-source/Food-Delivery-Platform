import React, { useState, useEffect } from 'react';
import customerApi from '../../../api/customerApi';
import styles from './VoucherModal.module.css';

const VoucherModal = ({ isOpen, onClose, cartTotal, onApply }) => {
    const [availableVouchers, setAvailableVouchers] = useState([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (isOpen) {
            setLoading(true);
            
            // Lấy userId từ localStorage
            const userId = localStorage.getItem('userId');
            
            // Cập nhật API: Truyền cả cartTotal và userId
            customerApi.getVouchers(cartTotal, userId) 
                .then(res => {
                    const result = res.data || res;
                    const data = result.status === 'success' ? result.data : (Array.isArray(result) ? result : []);
                    setAvailableVouchers(data);
                })
                .catch(err => console.error("Lỗi lấy voucher:", err))
                .finally(() => setLoading(false));
        }
    }, [isOpen, cartTotal]);

    if (!isOpen) return null;

    return (
        <div className={styles.overlay} onClick={onClose}>
            <div className={styles.modal} onClick={e => e.stopPropagation()}>
                {/* Header */}
                <div className={styles.header}>
                    <div className={styles.headerTitle}>
                        <h3>Ưu đãi dành cho bạn</h3>
                        <p>Áp dụng để nhận giảm giá ngay</p>
                    </div>
                    <button className={styles.closeBtn} onClick={onClose}>
                        <i className="fas fa-times"></i>
                    </button>
                </div>

                {/* Search/Input mã nhanh (Option) */}
                <div className={styles.promoInputGroup}>
                    <input type="text" placeholder="Nhập mã giảm giá..." />
                    <button disabled>Áp dụng</button>
                </div>

                {/* List Voucher */}
                <div className={styles.list}>
                    {loading ? (
                        <div className={styles.loadingState}>
                            <i className="fas fa-spinner fa-spin"></i>
                            <p>Đang tìm ưu đãi tốt nhất...</p>
                        </div>
                    ) : availableVouchers.length === 0 ? (
                        <div className={styles.emptyState}>
                            <img src="https://cdn-icons-png.flaticon.com/512/6598/6598519.png" alt="empty" />
                            <p>Chưa có mã nào khả dụng</p>
                            <span>Thêm món vào giỏ để đạt mức tối thiểu nhé!</span>
                        </div>
                    ) : (
                        availableVouchers.map(v => (
                            <div key={v.voucherId} className={styles.card}>
                                <div className={styles.cardLeft}>
                                    <div className={styles.voucherIcon}>
                                        <i className="fas fa-ticket-alt"></i>
                                    </div>
                                </div>
                                <div className={styles.cardRight}>
                                    <div className={styles.info}>
                                        <span className={styles.code}>{v.code}</span>
                                    
                                        <h4 className={styles.discount}>
                                            {v.discountType === 'percentage' 
                                                ? `Giảm ${v.discountValue}%` 
                                                : `Giảm ${Number(v.discountValue).toLocaleString()}đ`
                                            }
                                        </h4>
                                        <p className={styles.condition}>
                                            Đơn tối thiểu {Number(v.minOrderValue).toLocaleString()}đ
                                        </p>
                                    </div>
                                    <button 
                                        className={styles.applyBtn}
                                        onClick={() => { onApply(v); onClose(); }}
                                    >
                                        Dùng ngay
                                    </button>
                                </div>
                                <div className={styles.halfCircleLeft}></div>
                                <div className={styles.halfCircleRight}></div>
                            </div>
                        ))
                    )}
                </div>
            </div>
        </div>
    );
};

export default VoucherModal;