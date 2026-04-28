import React, { useState, useEffect } from 'react';
import { useNavigate, useOutletContext } from 'react-router-dom';
import customerApi from '../../api/customerApi';
import styles from './CartView.module.css';
import CartItem from '../../components/Customer/Order/CartItem';

const CartView = () => {
    const navigate = useNavigate();
    const { updateCartCount } = useOutletContext(); // Nhận hàm từ Layout
    const [cart, setCart] = useState([]);
    const [selectedItems, setSelectedItems] = useState([]);
    // Lấy ID nhà hàng vừa xem từ localStorage
    const lastResId = localStorage.getItem('lastVisitedResId');

    useEffect(() => {
        const savedCart = JSON.parse(localStorage.getItem('cart')) || [];
        setCart(savedCart);
    }, []);

    // 1. Tích chọn món để thanh toán
    const handleToggle = (id) => {
        setSelectedItems(prev => 
            prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]
        );
    };

    // 2. Tăng giảm số lượng
    const updateQty = (id, delta) => {
        const newCart = cart.map(item => {
            if (item.itemId === id) {
                const newQty = item.quantity + delta;
                return { ...item, quantity: newQty > 0 ? newQty : 1 };
            }
            return item;
        });
        setCart(newCart);
        localStorage.setItem('cart', JSON.stringify(newCart));
        updateCartCount(); // Đồng bộ số lượng icon Header
    };

    // 3. Xóa món
    const removeItem = (id) => {
        const newCart = cart.filter(item => item.itemId !== id);
        setCart(newCart);
        setSelectedItems(prev => prev.filter(itemId => itemId !== id));
        localStorage.setItem('cart', JSON.stringify(newCart));
        updateCartCount(); // Đồng bộ số lượng icon Header
    };

    // Tính tổng tiền cho những món ĐƯỢC CHỌN
    const selectedCartItems = cart.filter(item => selectedItems.includes(item.itemId));
    const total = selectedCartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);

    // 4. Gọi API thanh toán
    const handleCheckout = () => {
    // Kiểm tra xem bạn đã chọn món nào chưa
    if (selectedItems.length === 0) {
        alert("Hãy chọn ít nhất 1 món để đặt hàng!!! ");
        return;
    }

    // Dùng navigate để chuyển trang và đẩy dữ liệu món đã chọn sang trang Checkout
    navigate('/checkout', { 
        state: { 
            selectedItems: selectedCartItems, // Danh sách món đã tích chọn
            total: total                      // Tổng tiền món ăn (chưa ship)
        } 
    });
};

    return (
        <main style={{ padding: '30px 5%' }}>            
            {cart.length === 0 ? (
                <div style={{ textAlign: 'center', marginTop: '50px' }}>
                    <p>Giỏ hàng đang trống trơn...</p>
                    <button onClick={() => navigate('/home')} className={styles.btnPrimary} style={{margin:'20px auto'}}>
                        ĐI ĐẶT MÓN NGAY
                    </button>
                </div>
            ) : (
                    <div className={styles.whiteCard} style={{ padding: '20px', background: '#121212' }}>
                    {/* Nút quay lại menu nhà hàng hiện tại */}
                    <button 
                        onClick={() => navigate(`/restaurant/${lastResId}`)} 
                        className={styles.btnPrimary} 
                        style={{ marginBottom: '20px', background: 'transparent', border: '1px solid #2ecc71', color: '#2ecc71' }}
                    >
                        ← QUAY LẠI CHỌN MÓN
                    </button>                    {cart.map(item => (
                        <CartItem 
                            key={item.itemId} 
                            item={item} 
                            onUpdate={updateQty} 
                            onRemove={removeItem}
                            onToggle={handleToggle}
                            isSelected={selectedItems.includes(item.itemId)}
                        />
                    ))}
                    
                    <div style={{ marginTop: '30px', textAlign: 'right', borderTop: '1px solid #2d313d', paddingTop: '20px' }}>
                        <h3 style={{ color: '#0c0c0c' }}>Tổng thanh toán: 
                            <span style={{ color: '#e74c3c', fontSize: '28px', marginLeft: '15px' }}>
                                {total.toLocaleString()}đ
                            </span>
                        </h3>
                        
                        <button 
                            className={styles.btnConfirm} 
                            style={{ 
                                width: '280px', padding: '18px', marginTop: '20px', 
                                borderRadius: '15px', marginLeft: 'auto' 
                            }} 
                            onClick={handleCheckout}
                        >
                            ĐẶT HÀNG NGAY
                        </button>
                    </div>
                </div>
            )}
        </main>
    );
};

export default CartView;