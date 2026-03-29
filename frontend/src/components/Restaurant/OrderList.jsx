import React from 'react';
import OrderCard from './OrderCard';

const OrderList = ({ orders, onUpdateStatus, emptyMessage }) => {
    return (
        <div className="orders-wrapper">
            {orders.length === 0 ? (
                <div className="empty-state">
                    <p>{emptyMessage || "Chưa có đơn hàng nào."}</p>
                </div>
            ) : (
                /*Thêm class orders-grid ở đây */
                <div className="orders-grid">
                    {orders.map(order => (
                        <OrderCard 
                            key={order.orderId} 
                            order={order} 
                            onUpdateStatus={onUpdateStatus} 
                            
                        />
                    ))}
                </div>
            )}
        </div>
    );
};

export default OrderList;