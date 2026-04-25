/* thẻ điền thông tin đặt hàng */
import React, { useMemo } from 'react';
import styles from './Checkout.module.css';

const OrderSummary = ({ selectedItems, subtotal, shippingFee, voucher, onConfirm }) => {
    
    // Sử dụng useMemo để tính toán lại mỗi khi voucher hoặc subtotal thay đổi
    const calculation = useMemo(() => {
        let discountAmount = 0;

        if (voucher) {
            if (voucher.discountType === 'percentage') {
                // Công thức: (Tổng tiền * % giảm) / 100
                const calculatedDiscount = (subtotal * voucher.discountValue) / 100;
                
                // Nếu có giới hạn giảm tối đa, thì lấy con số nhỏ hơn
                if (voucher.maxDiscountAmount > 0) {
                    discountAmount = Math.min(calculatedDiscount, voucher.maxDiscountAmount);
                } else {
                    discountAmount = calculatedDiscount;
                }
            } else {
                // Nếu là tiền mặt (fixed_amount), trừ thẳng giá trị voucher
                discountAmount = voucher.discountValue;
            }
        }

        const finalTotal = subtotal + shippingFee - discountAmount;
        
        return {
            discount: discountAmount,
            // Đảm bảo tổng thanh toán không bị âm (đề phòng voucher quá lớn)
            total: finalTotal > 0 ? finalTotal : 0 
        };
    }, [voucher, subtotal, shippingFee]);

    return (
        <div className={styles.summaryCard}>
            <h3 className={styles.sectionTitle}>Tóm tắt đơn hàng</h3>
            
            {/* Danh sách món ăn rút gọn */}
            <div className={styles.itemSummaryList}>
                {selectedItems.map((item, idx) => (
                    <div key={idx} className={styles.itemSummaryRow}>
                        <span>{item.quantity}x {item.itemName}</span>
                        <span className={styles.itemSubPrice}>{(item.price * item.quantity).toLocaleString()} đ</span>
                    </div>
                ))}
            </div>

            <div className={styles.calculationArea}>
                <div className={styles.summaryRow}>
                    <span>Tổng tiền món:</span>
                    <span>{subtotal.toLocaleString()} đ</span>
                </div>
                
                <div className={styles.summaryRow}>
                    <span>Phí vận chuyển:</span>
                    <span>+{shippingFee.toLocaleString()} đ</span>
                </div>

                {calculation.discount > 0 && (
                    <div className={`${styles.summaryRow} ${styles.discountText}`}>
                        <span>
                            Giảm giá Voucher 
                            {voucher?.discountType === 'percentage' && ` (${voucher.discountValue}%)`}:
                        </span>
                        <span>-{calculation.discount.toLocaleString()} đ</span>
                    </div>
                )}
            </div>
            
            <hr className={styles.divider} />
            
            <div className={styles.totalRow}>
                <span>Tổng thanh toán:</span>
                <span className={styles.finalPrice}>{calculation.total.toLocaleString()} đ</span>
            </div>

            <button className={styles.btnConfirm} onClick={onConfirm}>
                XÁC NHẬN ĐẶT HÀNG
            </button>
        </div>
    );
};

export default OrderSummary;