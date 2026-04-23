/* phương thức thanh toán */ 
import React from 'react';
import styles from './Checkout.module.css';

const PaymentSelector = ({ method, setMethod }) => {
    return (
        <div className={styles.sectionCard}>
            <h4 className={styles.paymentTitle}>Phương thức thanh toán</h4>
            <div className={styles.paymentGrid}>
                <div 
                    className={`${styles.paymentItem} ${method === 'CASH' ? styles.activePayment : ''}`}
                    onClick={() => setMethod('CASH')}
                >
                    <div className={styles.checkDot}></div>
                    <i className="fas fa-money-bill-wave"></i>
                    <span>Tiền mặt (COD)</span>
                </div>

                <div 
                    className={`${styles.paymentItem} ${method === 'ONLINE' ? styles.activePayment : ''}`}
                    onClick={() => setMethod('ONLINE')}
                >
                    <div className={styles.checkDot}></div>
                    <i className="fas fa-credit-card"></i>
                    <span>Thanh toán Online</span>
                </div>
            </div>
        </div>
    );
};

export default PaymentSelector;