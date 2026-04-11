import React from 'react';
import '../../style.css';

const CartCheckoutView = ({ 
    currentView, cart, selectedItems, updateQuantity, toggleSelectItem, calculateTotal, 
    setCurrentView, checkoutInfo, handleInputChange, paymentMethod, setPaymentMethod, 
    calculateShippingFee, appliedVoucher, handleConfirmOrder, setIsVoucherModalOpen 
}) => {
    if (currentView === 'cart') {
        return (
            <div className="main-layout">
                <h2 className="section-title">Giỏ hàng của tôi</h2>
                <div className="cart-items-list">
                    {cart.map(item => (
                        <div key={item.itemId} className="cart-item-box">
                            <div className="cart-item-img">
                                <img src={item.itemImage ? `http://localhost:8080/uploads/${item.itemImage}` : '/image/load.jpg'} alt={item.itemName} />
                            </div>
                            <div className="cart-item-info">
                                <h4>{item.itemName}</h4>
                                <p className="price">{item.price?.toLocaleString()}đ</p>
                                <button className="btn-voucher-outline" onClick={() => setIsVoucherModalOpen(true)}>
                                    {appliedVoucher ? `Mã: ${appliedVoucher.code}` : 'Chọn Voucher'}
                                </button>
                            </div>
                            <div className="cart-item-controls">
                                <div className="qty-selector">
                                    <button onClick={() => updateQuantity(item.itemId, -1)}>-</button>
                                    <span>{item.quantity}</span>
                                    <button onClick={() => updateQuantity(item.itemId, 1)}>+</button>
                                </div>
                                <input 
                                    type="checkbox" 
                                    className="item-check"
                                    checked={selectedItems.includes(item.itemId)} 
                                    onChange={() => toggleSelectItem(item.itemId)} 
                                />
                            </div>
                        </div>
                    ))}
                </div>
                <div className="cart-footer-bar">
                    <span>Tổng cộng: <strong className="final-price">{calculateTotal().toLocaleString()}đ</strong></span>
                    <button className="btn-checkout" onClick={() => setCurrentView('checkout')}>Tiếp tục thanh toán</button>
                </div>
            </div>
        );
    }

    if (currentView === 'checkout') {
        const total = calculateTotal() + calculateShippingFee() - (appliedVoucher?.discountValue || 0);
        return (
            <div className="main-layout">
                <h2 className="section-title">Thông tin giao hàng</h2>
                <div className="checkout-form-box">
                    <div className="input-group">
                        <label>Họ và tên</label>
                        <input name="fullName" value={checkoutInfo.fullName} onChange={handleInputChange} placeholder="Nhập tên người nhận" />
                    </div>
                    <div className="input-group">
                        <label>Số điện thoại</label>
                        <input name="phone" value={checkoutInfo.phone} onChange={handleInputChange} placeholder="Số điện thoại liên lạc" />
                    </div>
                    
                    <h4 style={{marginTop: '20px', color: '#fff'}}>Phương thức thanh toán</h4>
                    <div style={{ display: 'flex', gap: '15px', marginTop: '10px' }}>
                        <div 
                            className={`btn-status ${paymentMethod === 'CASH' ? 'btn-confirm' : ''}`}
                            style={{ flex: 1, border: '1px solid #2d313d' }}
                            onClick={() => setPaymentMethod('CASH')}
                        >Tiền mặt</div>
                        <div 
                            className={`btn-status ${paymentMethod === 'ONLINE' ? 'btn-prepare' : ''}`}
                            style={{ flex: 1, border: '1px solid #2d313d' }}
                            onClick={() => setPaymentMethod('ONLINE')}
                        >VNPAY</div>
                    </div>

                    <div className="order-summary-final">
                        <div className="summary-row">
                            <span>Tổng thanh toán:</span>
                            <span className="final-price">{total.toLocaleString()}đ</span>
                        </div>
                    </div>
                    <button className="btn-primary" style={{marginTop: '20px'}} onClick={handleConfirmOrder}>Xác nhận đặt hàng</button>
                </div>
            </div>
        );
    }
    return null;
};
export default CartCheckoutView;