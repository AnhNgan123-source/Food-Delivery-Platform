/* thẻ điền thông tin đặt hàng */
import React from 'react';
import styles from './Checkout.module.css';

const OrderSummary = ({ selectedItems, subtotal, shippingFee, voucher, onConfirm }) => {
    // Logic tính toán nằm gói gọn trong component này
    const discount = voucher ? voucher.discountValue : 0;
    const finalTotal = subtotal + shippingFee - discount;

    return (
        <div className={styles.summaryCard}>
            <h3 className={styles.sectionTitle}>Tóm tắt đơn hàng</h3>
            
            {/* Danh sách món ăn rút gọn */}
            <div className={styles.itemSummaryList}>
                {selectedItems.map((item, idx) => (
                    <div key={idx} className={styles.itemSummaryRow}>
                        <span>{item.quantity}x {item.itemName}</span>
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

                {discount > 0 && (
                    <div className={`${styles.summaryRow} ${styles.discountText}`}>
                        <span>Giảm giá Voucher:</span>
                        <span>-{discount.toLocaleString()} đ</span>
                    </div>
                )}
            </div>
            
            <hr className={styles.divider} />
            
            <div className={styles.totalRow}>
                <span>Tổng thanh toán:</span>
                <span className={styles.finalPrice}>{finalTotal.toLocaleString()} đ</span>
            </div>

            <button className={styles.btnConfirm} onClick={onConfirm}>
                XÁC NHẬN ĐẶT HÀNG
            </button>
        </div>
    );
};

export default OrderSummary;