import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import customerApi from '../../api/customerApi'; // Đường dẫn đến file API đã viết
import styles from './Home.module.css'; // File CSS bạn cung cấp

const Home = () => {
    const navigate = useNavigate();

    // --- QUẢN LÝ GIAO DIỆN ---
    const [currentView, setCurrentView] = useState('restaurants'); 

    // --- STATE DỮ LIỆU ---
    const [allRestaurants, setAllRestaurants] = useState([]);
    const [filteredRestaurants, setFilteredRestaurants] = useState([]);
    const [searchKeyword, setSearchKeyword] = useState('');
    const [selectedResInfo, setSelectedResInfo] = useState(null);
    const [menuItems, setMenuItems] = useState([]);
    const [dbShippingFees, setDbShippingFees] = useState([]); 
    const [orderHistory, setOrderHistory] = useState([]);
    const [paymentMethod, setPaymentMethod] = useState('CASH');

    // --- STATE GIỎ HÀNG ---
    const [cart, setCart] = useState(() => {
        const savedCart = localStorage.getItem('cart');
        return savedCart ? JSON.parse(savedCart) : [];
    });
    const [selectedItems, setSelectedItems] = useState([]); 

    // --- STATE FORM THANH TOÁN ---
    const [checkoutInfo, setCheckoutInfo] = useState({
        fullName: localStorage.getItem('fullName') || '', 
        phone: localStorage.getItem('phone') || '',
        district: localStorage.getItem('district') || '',
        address: localStorage.getItem('address') || ''
    });

    const handleInputChange = (e) => {
        setCheckoutInfo({ ...checkoutInfo, [e.target.name]: e.target.value });
    };

    // --- KIỂM TRA QUYỀN & TẢI DỮ LIỆU ---
    useEffect(() => {
        const token = localStorage.getItem('token');
        const role = localStorage.getItem('role');

        if (!token || role !== 'CUSTOMER') {
            navigate('/');
            return;
        }
        
        fetchRestaurants();
        fetchShippingFees(); 
    }, [navigate]);

    // --- CÁC HÀM GỌI API (Đã refactor dùng customerApi) ---

    const fetchRestaurants = async () => {
        try {
            const data = await customerApi.getAllRestaurants();
            setAllRestaurants(data);
            setFilteredRestaurants(data);
        } catch (error) {
            console.error("Lỗi tải nhà hàng:", error);
        }
    };

    const fetchShippingFees = async () => {
        try {
            // Endpoint này thuộc về Admin quản lý nên vẫn dùng fetch hoặc tạo adminApi riêng
            const response = await fetch("http://localhost:8080/api/v1/admin/shipping-config");
            if (response.ok) {
                const data = await response.json();
                setDbShippingFees(data);
            }
        } catch (error) { console.error("Lỗi lấy phí ship:", error); }
    };

    const viewRestaurantMenu = async (resId) => {
        try {
            const data = await customerApi.getRestaurantMenu(resId);
            setSelectedResInfo(data.restaurant);
            setMenuItems(data.menu);
            setCurrentView('menu');
        } catch (error) {
            console.error("Lỗi tải menu:", error);
        }
    };

    const handleConfirmOrder = async () => {
        const customerId = localStorage.getItem('userId');
        const itemsToOrder = cart.filter(item => selectedItems.includes(item.itemId));
        
        if (itemsToOrder.length === 0) {
            alert("Ngân chưa chọn món nào kìa!");
            return;
        }

        const resId = selectedResInfo?.resId || selectedResInfo?.res_id || itemsToOrder[0]?.resId;
        const shipFee = calculateShippingFee();
        const subtotal = calculateTotal();
        const finalAmount = subtotal + shipFee;

        const orderData = {
            customerId: parseInt(customerId),
            resId: resId,
            deliveryAddress: `${checkoutInfo.address}, ${checkoutInfo.district}, TP. HCM`,
            note: "Đơn hàng từ Web",
            paymentMethod: paymentMethod,
            subtotal: subtotal,
            shippingFee: shipFee,
            totalDiscount: 0,
            finalAmount: finalAmount,
            items: itemsToOrder.map(item => ({
                itemId: item.itemId,
                quantity: item.quantity,
                priceAtOrder: item.price
            }))
        };

        try {
            const result = await customerApi.createOrder(orderData);
            alert(`✨ Tuyệt vời! Đơn hàng #${result.orderId} đã được tiếp nhận.`);

            const remainingCart = cart.filter(item => !selectedItems.includes(item.itemId));
            setCart(remainingCart);
            localStorage.setItem('cart', JSON.stringify(remainingCart));
            setSelectedItems([]);

            if (paymentMethod === 'ONLINE') {
                navigate(`/payment-vnpay?orderId=${result.orderId}&amount=${finalAmount}`);
            } else {
                navigate(`/order-tracking/${result.orderId}`);
            }
        } catch (error) {
            const msg = error.response?.data?.message || "Lỗi đặt hàng!";
            alert("❌ Lỗi: " + msg);
        }
    };

    const fetchOrderHistory = async () => {
        try {
            const data = await customerApi.getMyOrders();
            setOrderHistory(data);
            setCurrentView('orders');
        } catch (error) {
            console.error("Lỗi khi tải lịch sử:", error);
        }
    };

    // --- LOGIC HỖ TRỢ (Giữ nguyên bản gốc) ---
    const handleSearch = (e) => {
        const keyword = e.target.value.toLowerCase();
        setSearchKeyword(keyword);
        const filtered = allRestaurants.filter(res => {
            const name = (res.res_name || res.resName || '').toLowerCase();
            return name.includes(keyword);
        });
        setFilteredRestaurants(filtered);
    };

    const addToCart = (item) => {
        setCart(prevCart => {
            const isExisting = prevCart.find(c => c.itemId === item.itemId);
            let newCart = isExisting 
                ? prevCart.map(c => c.itemId === item.itemId ? { ...c, quantity: c.quantity + 1 } : c)
                : [...prevCart, { ...item, quantity: 1 }];
            localStorage.setItem('cart', JSON.stringify(newCart));
            return newCart;
        });
        alert(`Đã thêm ${item.itemName} vào giỏ!`);
    };

    const updateQuantity = (itemId, delta) => {
        setCart(prevCart => {
            const newCart = prevCart.map(item => {
                if (item.itemId === itemId) {
                    return { ...item, quantity: Math.max(1, item.quantity + delta) };
                }
                return item;
            });
            localStorage.setItem('cart', JSON.stringify(newCart));
            return newCart;
        });
    };

    const calculateTotal = () => cart.filter(item => selectedItems.includes(item.itemId)).reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const totalItemsInCart = cart.reduce((sum, item) => sum + item.quantity, 0); 

    const calculateShippingFee = () => {
        const innerDistricts = ['Quận 1', 'Quận 3', 'Quận 4', 'Quận 5', 'Quận 6', 'Quận 10', 'Quận 11', 'Tân Bình', 'Tân Phú', 'Bình Thạnh', 'Phú Nhuận', 'Gò Vấp'];
        const userDist = checkoutInfo.district;
        if (!userDist || dbShippingFees.length === 0) return 20000;
        const isInner = innerDistricts.some(d => userDist.includes(d));
        const config = dbShippingFees.find(f => f.areaName === (isInner ? 'Nội thành' : 'Ngoại thành'));
        return config ? config.price : 20000; 
    };

    return (
        <div className="customer-container">
            {/* --- HEADER --- */}
            <header className="wf-header">
                <div className="wf-logo" onClick={() => setCurrentView('restaurants')} style={{cursor:'pointer'}}>🍕 YUMMY</div>
                <div className="header-content-center">
                    <div className="wf-search-box">
                        <i className="fas fa-search"></i>
                        <input type="text" placeholder="Tìm món ăn..." value={searchKeyword} onChange={handleSearch} />
                    </div>
                </div>
                <div className="wf-header-right">
                    <button className="wf-icon-btn" onClick={fetchOrderHistory} title="Lịch sử đơn hàng"><i className="fas fa-clock-rotate-left"></i></button>
                    <button className="wf-icon-btn" onClick={() => setCurrentView('cart')} style={{position:'relative'}}>
                        <i className="fas fa-shopping-cart"></i>
                        {totalItemsInCart > 0 && <span className="cart-badge">{totalItemsInCart}</span>}
                    </button>
                    <button className="wf-icon-btn" onClick={() => navigate('/profile')}><i className="fas fa-user"></i></button>
                </div>
            </header>

            <main className="main-layout">
                {/* --- VIEW 1: DANH SÁCH NHÀ HÀNG --- */}
                {currentView === 'restaurants' && (
                    <>
                        <section className="promo-banner">
                            <h1>Giảm ngay 50% cho đơn hàng đầu tiên!</h1>
                            <p>Đặt ngay những món ăn nóng hổi từ Yummy Hub</p>
                        </section>
                        <section className="food-section">
                            <h3 className="section-title">Nhà hàng dành cho bạn</h3>
                            <div className="grid-container">
                                {filteredRestaurants.map(res => (
                                    <div key={res.res_id || res.resId} className="restaurant-card" onClick={() => viewRestaurantMenu(res.res_id || res.resId)}>
                                        <img src={res.resImage ? `http://localhost:8080/uploads/${res.resImage}` : 'https://via.placeholder.com/400x250'} alt={res.resName} />                                            
                                        <div className="card-body">
                                            <div className="res-name">{res.resName}</div>
                                            <p className="res-address">{res.resAddress}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </section>
                    </>
                )}

                {/* --- VIEW 2: MENU NHÀ HÀNG --- */}
                {currentView === 'menu' && selectedResInfo && (
                    <div className="restaurant-detail-view">
                        <button className="btn-back-link" onClick={() => setCurrentView('restaurants')}>
                            <i className="fas fa-chevron-left"></i> Quay lại
                        </button>
                        <section className="res-hero-banner" style={{ backgroundImage: `linear-gradient(to right, rgba(0,0,0,0.8), rgba(0,0,0,0.2)), url(${selectedResInfo.resImage ? `http://localhost:8080/uploads/${selectedResInfo.resImage}` : 'https://via.placeholder.com/1200x400'})` }}>
                             <div className="res-hero-content">
                                <div className="res-hero-text">
                                    <h1>{selectedResInfo.resName}</h1>
                                    <p><i className="fas fa-map-marker-alt"></i> {selectedResInfo.resAddress}</p>
                                </div>
                            </div>
                        </section>
                        <section className="menu-section">
                            <h3 className="section-title">Danh sách món ăn</h3>
                            <div className="menu-grid">
                                {menuItems.map(item => (
                                    <div key={item.itemId} className="food-item-card">
                                        <div className="food-img-container">
                                            <img src={item.itemImage ? `http://localhost:8080/uploads/${item.itemImage}` : '/image/load.jpg'} alt={item.itemName} />
                                        </div>
                                        <div className="food-details">
                                            <h5>{item.itemName}</h5>
                                            <div className="food-footer">
                                                <span className="price">{item.price?.toLocaleString('vi-VN')} đ</span>
                                                <button className="btn-add-small" onClick={() => addToCart(item)}><i className="fas fa-plus"></i> Thêm</button>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </section>
                    </div>
                )}

                {/* --- VIEW 3: GIỎ HÀNG --- */}
                {currentView === 'cart' && (
                    <div className="cart-view-container">
                        <h2 className="section-title">Giỏ hàng của tôi</h2>
                        <div className="cart-items-list">
                            {cart.length === 0 ? <p>Giỏ hàng trống rỗng...</p> : cart.map(item => (
                                <div key={item.itemId} className="cart-item-box" style={{display:'flex', alignItems:'center', gap:'15px', marginBottom:'10px', background:'#1a1c23', padding:'15px', borderRadius:'15px'}}>
                                    <input type="checkbox" checked={selectedItems.includes(item.itemId)} onChange={() => setSelectedItems(prev => prev.includes(item.itemId) ? prev.filter(id => id !== item.itemId) : [...prev, item.itemId])} />
                                    <div style={{flex:1}}>{item.itemName} (x{item.quantity})</div>
                                    <div style={{fontWeight:'bold'}}>{(item.price * item.quantity).toLocaleString('vi-VN')}đ</div>
                                </div>
                            ))}
                        </div>
                        {selectedItems.length > 0 && (
                            <div className="cart-footer-bar" style={{marginTop:'20px'}}>
                                <span>Tổng cộng: <strong>{calculateTotal().toLocaleString('vi-VN')} đ</strong></span>
                                <button className="btn-checkout" style={{marginLeft:'20px', padding:'10px 20px', background:'#2ecc71', border:'none', color:'#fff', borderRadius:'8px', fontWeight:'bold'}} onClick={() => setCurrentView('checkout')}>Thanh toán</button>
                            </div>
                        )}
                    </div>
                )}

                {/* --- VIEW 4: THANH TOÁN (Dùng Module CSS) --- */}
                {currentView === 'checkout' && (
                    <div className="checkout-view">
                        <button className="btn-back-link" onClick={() => setCurrentView('cart')}><i className="fas fa-chevron-left"></i> Quay lại</button>
                        <div className="checkout-container">
                            <h2 className="section-title">Thông tin giao hàng</h2>
                            <div className={styles.paymentContainer}>
                                <div className="input-group" style={{marginBottom:'15px'}}>
                                    <label style={{display:'block', marginBottom:'5px', color:'#888'}}>* Họ và tên</label>
                                    <input type="text" name="fullName" value={checkoutInfo.fullName} onChange={handleInputChange} style={{width:'100%', padding:'10px', borderRadius:'8px', border:'1px solid #2d313d', background:'#1a1c23', color:'#fff'}} />
                                </div>
                                <h4 className={styles.paymentTitle}>Phương thức thanh toán</h4>
                                <div style={{ display: 'flex', gap: '15px' }}>
                                    <div className={styles.paymentItem} style={{ borderColor: paymentMethod === 'CASH' ? '#2ecc71' : '#2d323e' }} onClick={() => setPaymentMethod('CASH')}>
                                        <div className={styles.checkDot} style={{ background: paymentMethod === 'CASH' ? '#2ecc71' : 'transparent' }}></div>
                                        <span>Tiền mặt</span>
                                    </div>
                                    <div className={styles.paymentItem} style={{ borderColor: paymentMethod === 'ONLINE' ? '#3498db' : '#2d323e' }} onClick={() => setPaymentMethod('ONLINE')}>
                                        <div className={styles.checkDot} style={{ background: paymentMethod === 'ONLINE' ? '#3498db' : 'transparent' }}></div>
                                        <span>VNPay</span>
                                    </div>
                                </div>
                                <div className={styles.priceContainer}>
                                    <div className={styles.finalLine}>
                                        <span>Tổng thanh toán:</span>
                                        <span style={{color: '#ff4757', fontSize: '24px'}}>{(calculateTotal() + calculateShippingFee()).toLocaleString('vi-VN')} đ</span>
                                    </div>
                                </div>
                                <button className={styles.backHomeBtn} style={{width:'100%', marginTop:'20px'}} onClick={handleConfirmOrder}>XÁC NHẬN ĐẶT HÀNG</button>
                            </div>
                        </div>
                    </div>
                )}

                {/* --- VIEW 5: LỊCH SỬ (Dùng Class Luxury của Ngân) --- */}
                {currentView === 'orders' && (
                    <div className="order-history-page">
                        <h2 className="section-title">Đơn hàng của Ngân 🍕</h2>
                        <div className="orders-list">
                            {orderHistory.length === 0 ? <p>Trống rỗng...</p> : orderHistory.map(order => (
                                <div key={order.orderId} className={styles.luxuryOrderCard}>
                                    <div className={styles.cardHeader}>
                                        <div>
                                            <span style={{ color: '#2ecc71', fontWeight: 'bold' }}>#{order.orderId}</span>
                                            <div style={{ color: '#888', fontSize: '12px' }}>{new Date(order.createdAt).toLocaleString()}</div>
                                        </div>
                                        <span className={styles.statusTag} style={{ backgroundColor: 'rgba(243, 156, 18, 0.15)', color: '#f39c12' }}>
                                            ● {order.orderStatus}
                                        </span>
                                    </div>
                                    <div className={styles.itemsSection}>
                                        {order.items?.map((it, idx) => (
                                            <div key={idx} className={styles.itemRow}>
                                                <span><span className={styles.itemQty}>{it.quantity}x</span> {it.itemName}</span>
                                                <span>{(it.priceAtOrder * it.quantity).toLocaleString()}đ</span>
                                            </div>
                                        ))}
                                    </div>
                                    <div className={styles.priceContainer}>
                                        <div className={styles.finalLine}>
                                            <span>Tổng cộng</span>
                                            <span style={{ color: '#ff4757', fontSize: '22px' }}>{order.finalAmount?.toLocaleString()}đ</span>
                                        </div>
                                    </div>
                                    <button className={styles.trackingBtn} onClick={() => navigate(`/order-tracking/${order.orderId}`)}>Theo dõi đơn hàng</button>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </main>
        </div>
    );
};

export default Home;