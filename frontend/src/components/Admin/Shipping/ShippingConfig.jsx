import React from 'react';
import styles from './ShippingConfig.module.css';

const ShippingConfig = ({ shippingFees, setShippingFees, handleSaveShippingFees }) => {
    
    const displayFees = shippingFees && shippingFees.length > 0 
        ? shippingFees 
        : [
            { areaName: 'Nội thành', price: 0 },
            { areaName: 'Ngoại thành', price: 0 }
        ];

    const onPriceChange = (idx, value) => {
        const newFees = [...displayFees];
        newFees[idx].price = value;
        setShippingFees(newFees);
    };

    return (
        <div className={styles.container}>
            <div className={styles.mainSection}>
                <div className={styles.header}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <div>
                            {/* Dùng đúng className styles.title đã định nghĩa */}
                            <h3 className={styles.title}>Cấu hình biểu phí ship</h3>
                            <p className={styles.subtitle}>Thiết lập chi phí vận chuyển cố định theo khu vực TP.HCM</p>
                        </div>
                        <div className={styles.ticketIcon} style={{ background: '#f8fafc', color: '#64748b' }}>
                            <i className="fas fa-truck-loading"></i>
                        </div>
                    </div>
                </div>

                <div className={styles.grid}>
                    {displayFees.map((fee, idx) => (
                        <div 
                            key={idx} 
                            className={`${styles.card} ${fee.areaName === 'Nội thành' ? styles.innerCity : styles.outerCity}`}
                        >
                            <div className={styles.bgIcon}>
                                <i className={fee.areaName === 'Nội thành' ? 'fas fa-city' : 'fas fa-tree'}></i>
                            </div>
                            
                            <div className={styles.areaName}>{fee.areaName}</div>
                            <p className={styles.areaDesc}>
                                {fee.areaName === 'Nội thành' 
                                    ? 'Áp dụng cho các Quận trung tâm (Q.1, 3, 5, 10, Tân Bình...)' 
                                    : 'Áp dụng cho các Huyện ngoại thành (Cần Giờ, Nhà Bè, Củ Chi...)'}
                            </p>

                            <div className={styles.inputWrapper}>
                                <input 
                                    type="number" 
                                    className={styles.priceInput}
                                    value={fee.price} 
                                    onChange={(e) => onPriceChange(idx, e.target.value)}
                                    placeholder="0"
                                />
                                <span className={styles.currency}>đ</span>
                            </div>
                        </div>
                    ))}
                </div>

                <div className={styles.footer}>
                    <button className={styles.btnSave} onClick={handleSaveShippingFees}>
                        <i className="fas fa-save" style={{ marginRight: '8px' }}></i> 
                        Cập nhật biểu phí ngay
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ShippingConfig;