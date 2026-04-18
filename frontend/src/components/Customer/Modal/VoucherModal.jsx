import React, { useState, useEffect } from 'react';

const VoucherModal = ({ isOpen, onClose, cartTotal, onApply }) => {
    const [availableVouchers, setAvailableVouchers] = useState([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (isOpen && cartTotal > 0) {
            setLoading(true);
            // Gọi API lấy voucher hợp lệ dựa trên tổng tiền Ngân đang có trong giỏ
            fetch(`http://localhost:8080/api/v1/admin/vouchers/available?cartValue=${cartTotal}`)
                .then(res => res.json())
                .then(result => {
                    if (result.status === "success") {
                        setAvailableVouchers(result.data);
                    }
                })
                .catch(err => console.error("Lỗi lấy voucher:", err))
                .finally(() => setLoading(false));
        }
    }, [isOpen, cartTotal]);

    if (!isOpen) return null;

    return (
        <div style={styles.modalOverlay}>
            <div style={styles.modalContent}>
                <div style={styles.header}>
                    <h3 style={{ margin: 0, color: '#333' }}>Mã giảm giá cho bạn 🎁</h3>
                    <i className="fas fa-times" style={styles.closeIcon} onClick={onClose}></i>
                </div>
                
                <div style={styles.listContainer}>
                    {loading ? (
                        <p style={styles.emptyText}>Đang tìm mã ưu đãi...</p>
                    ) : availableVouchers.length === 0 ? (
                        <div style={{textAlign: 'center'}}>
                             <p style={styles.emptyText}>Chưa có mã nào phù hợp.</p>
                             <p style={{fontSize: '12px', color: '#999'}}>Thêm món để đạt giá trị tối thiểu nhé Ngân!</p>
                        </div>
                    ) : (
                        availableVouchers.map(v => (
                            <div key={v.voucherId} style={styles.voucherCard}>
                                <div style={{ flex: 1 }}>
                                    <b style={styles.voucherCode}>{v.code}</b>
                                    <div style={styles.voucherInfo}>
                                        Giảm {v.discountValue.toLocaleString()}đ
                                    </div>
                                    <div style={{ fontSize: '11px', color: '#999' }}>
                                        Đơn từ {v.minOrderValue.toLocaleString()}đ
                                    </div>
                                </div>
                                <button 
                                    style={styles.applyBtn} 
                                    onClick={() => { onApply(v); onClose(); }}
                                >
                                    Dùng ngay
                                </button>
                            </div>
                        ))
                    )}
                </div>
            </div>
        </div>
    );
};

const styles = {
    modalOverlay: { position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.7)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 2000, backdropFilter: 'blur(4px)' },
    modalContent: { background: '#fff', padding: '25px', borderRadius: '20px', width: '380px', boxShadow: '0 20px 40px rgba(0,0,0,0.2)' },
    header: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', borderBottom: '1px solid #eee', paddingBottom: '15px' },
    closeIcon: { cursor: 'pointer', color: '#999', fontSize: '18px' },
    listContainer: { maxHeight: '350px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '12px' },
    voucherCard: { padding: '15px', background: '#fcfcfc', borderRadius: '12px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', border: '1px dashed #2ecc71' },
    voucherCode: { color: '#2ecc71', fontSize: '17px', letterSpacing: '1px' },
    voucherInfo: { fontSize: '13px', color: '#444', fontWeight: '600', margin: '4px 0' },
    applyBtn: { background: '#2ecc71', color: '#fff', border: 'none', padding: '8px 16px', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold', fontSize: '13px' },
    emptyText: { textAlign: 'center', color: '#666', fontSize: '14px', margin: '20px 0' }
};

export default VoucherModal;