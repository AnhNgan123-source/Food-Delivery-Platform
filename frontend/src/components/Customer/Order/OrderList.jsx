import React from 'react';
import OrderCard from './OrderCard';
import styles from './OrderList.module.css';

const OrderList = ({ orders, onUpdateStatus, onReviewClick,onCancelClick, emptyMessage }) => {
    return (
        <div className={styles.ordersWrapper}>
            {orders.length === 0 ? (
                <div className={styles.emptyState}>
                    <p>{emptyMessage || "Chưa có đơn hàng nào."}</p>
                </div>
            ) : (
                <div className={styles.ordersGrid}>
                    {orders.map(order => (
                        <OrderCard 
                            key={order.orderId} 
                            order={order} 
                            onUpdateStatus={onUpdateStatus} 
                            onReviewClick={onReviewClick}
                            onCancelClick={onCancelClick} 
                        />
                    ))}
                </div>
            )}
        </div>
    );
};

export default OrderList;