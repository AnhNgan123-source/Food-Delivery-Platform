import React from 'react';
import styles from './Checkout.module.css';

const CheckoutForm = ({ info, onChange, setIsVoucherModalOpen, appliedVoucher }) => {
    return (
        <div className={styles.sectionCard}>
            <h2 className={styles.sectionTitle}>
                <i className="fas fa-map-marker-alt" style={{marginRight: '10px', color: '#2ecc71'}}></i>
                Thông tin giao hàng
            </h2>
            
            <div className={styles.inputGroup}>
                <label>* Họ và tên</label>
                <input 
                    type="text" 
                    name="fullName" 
                    value={info.fullName} 
                    onChange={onChange} 
                    placeholder="Nhập họ tên người nhận" 
                />
            </div>

            <div className={styles.inputGroup}>
                <label>* Số điện thoại</label>
                <input 
                    type="text" 
                    name="phone" 
                    value={info.phone} 
                    onChange={onChange} 
                    placeholder="Số điện thoại liên lạc" 
                />
            </div>

            <div className={styles.inputGroup}>
                <label>* Quận/Huyện</label>
                <select name="district" value={info.district} onChange={onChange}>
                    <option value="">-- Chọn Quận/Huyện --</option>
                    {/* Xóa phần phí ship cứng ở label để tránh sai lệch với DB */}
                    <optgroup label="Khu vực Nội Thành">
                        <option value="Quận 1">Quận 1</option>
                        <option value="Quận 3">Quận 3</option>
                        <option value="Quận 4">Quận 4</option>
                        <option value="Quận 5">Quận 5</option>
                        <option value="Quận 10">Quận 10</option>
                        <option value="Quận 12">Quận 12</option>
                        <option value="Phú Nhuận">Phú Nhuận</option>
                        <option value="Bình Thạnh">Bình Thạnh</option>
                        <option value="Gò Vấp">Gò Vấp</option>
                        <option value="Tân Bình">Tân Bình</option>
                    </optgroup>
                    <optgroup label="Khu vực Ngoại Thành">
                        <option value="Thủ Đức">TP. Thủ Đức</option>
                        <option value="Quận 7">Quận 7</option>                       
                        <option value="Bình Chánh">Bình Chánh</option>
                        <option value="Hóc Môn">Hóc Môn</option>
                    </optgroup>
                </select>
            </div>

            <div className={styles.inputGroup}>
                <label>* Số nhà/Tên đường</label>
                <textarea 
                    name="address" 
                    value={info.address} 
                    onChange={onChange} 
                    placeholder="Ví dụ: 123 Đường ABC, Phường X..." 
                    style={{height: '80px'}}
                />
            </div>

            {/* Thêm trường Ghi chú để khớp với Backend note */}
            <div className={styles.inputGroup}>
                <label>Ghi chú đơn hàng (Không bắt buộc)</label>
                <input 
                    type="text" 
                    name="note" 
                    value={info.note || ''} 
                    onChange={onChange} 
                    placeholder="Ví dụ: Cổng màu xanh, ít cay..." 
                />
            </div>

            {/* Voucher Section */}
            <div className={styles.voucherPlaceholder} onClick={() => setIsVoucherModalOpen(true)}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <i className="fas fa-ticket-alt" style={{color: '#2ecc71'}}></i>
                    <span>
                        Voucher: {appliedVoucher ? (
                            <strong style={{ color: '#2ecc71' }}>{appliedVoucher.code}</strong>
                        ) : (
                            "Chọn hoặc nhập mã"
                        )}
                    </span>
                </div>
                <i className="fas fa-chevron-right" style={{fontSize: '12px', color: '#666'}}></i>
            </div>
        </div>
    );
};

export default CheckoutForm;