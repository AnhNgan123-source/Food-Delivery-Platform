import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const Home = () => {
    const navigate = useNavigate();

    // === QUẢN LÝ GIAO DIỆN ===
    // 'restaurants', 'menu', 'cart'
    const [currentView, setCurrentView] = useState('restaurants'); 

    // === STATE DỮ LIỆU ===
    const [allRestaurants, setAllRestaurants] = useState([]);
    const [filteredRestaurants, setFilteredRestaurants] = useState([]);
    const [searchKeyword, setSearchKeyword] = useState('');
    const [selectedResInfo, setSelectedResInfo] = useState(null);
    const [menuItems, setMenuItems] = useState([]);
    const [dbShippingFees, setDbShippingFees] = useState([]); // Lưu phí ship lấy từ DB
    // 1. Thêm state để lưu danh sách đơn hàng
    const [orderHistory, setOrderHistory] = useState([]);

    // === STATE GIỎ HÀNG ===
    const [cart, setCart] = useState(() => {
        const savedCart = localStorage.getItem('cart');
        return savedCart ? JSON.parse(savedCart) : [];
    });
    const [selectedItems, setSelectedItems] = useState([]); // Lưu ID các món được tích chọn

    //=== STACK FORM ĐIỀN THÔNG TIN ===
    // Lưu thông tin khách hàng điền vào form thanh toán
    const [checkoutInfo, setCheckoutInfo] = useState({
    fullName: localStorage.getItem('fullName') || '', // Lấy từ login nếu có
    phone: localStorage.getItem('phone') || '',
    district: localStorage.getItem('district') || '',
    address: localStorage.getItem('address') || ''
    });

    const handleInputChange = (e) => {
    setCheckoutInfo({ ...checkoutInfo, [e.target.name]: e.target.value });
};

    // === KIỂM TRA QUYỀN & TẢI DANH SÁCH NHÀ HÀNG ===
    useEffect(() => {
        const token = localStorage.getItem('token');
        const role = localStorage.getItem('role');

        if (!token || role !== 'CUSTOMER') {
            navigate('/');
            return;
        }
        fetchRestaurants(token);
        fetchShippingFees(); // Thêm dòng này để lấy phí ship từ DB
    }, [navigate]);


    // Thêm hàm này để gọi API lấy phí ship
    const fetchShippingFees = async () => {
        try {
            const response = await fetch("http://localhost:8080/api/v1/admin/shipping-config");
            if (response.ok) {
                const data = await response.json();
                setDbShippingFees(data);
            }
        } catch (error) { console.error("Lỗi lấy phí ship:", error); }
    };


    const fetchRestaurants = async (token) => {
        try {
            const response = await fetch('http://localhost:8080/api/v1/restaurants', {
                headers: { 'Authorization': 'Bearer ' + token }
            });
            const result = await response.json();
            if (result.status === 'success') {
                setAllRestaurants(result.data);
                setFilteredRestaurants(result.data);
            }
        } catch (error) {
            console.error("Lỗi tải nhà hàng:", error);
        }
    };

    // === LOGIC TÌM KIẾM ===
    const handleSearch = (e) => {
        const keyword = e.target.value.toLowerCase();
        setSearchKeyword(keyword);
        const filtered = allRestaurants.filter(res => {
            const name = (res.res_name || res.resName || '').toLowerCase();
            return name.includes(keyword);
        });
        setFilteredRestaurants(filtered);
    };

    // === XEM MENU NHÀ HÀNG ===
    const viewRestaurantMenu = async (resId) => {
        const token = localStorage.getItem('token');
        try {
            const response = await fetch(`http://localhost:8080/api/v1/restaurants/${resId}`, {
                headers: { 'Authorization': 'Bearer ' + token }
            });
            const result = await response.json();
            if (result.status === 'success') {
                setSelectedResInfo(result.data.restaurant);
                setMenuItems(result.data.menu);
                setCurrentView('menu');
            }
        } catch (error) {
            console.error("Lỗi tải menu:", error);
        }
    };

    // === LOGIC GIỎ HÀNG ===
    const addToCart = (item) => {
        setCart(prevCart => {
            const isExisting = prevCart.find(c => c.itemId === item.itemId);
            let newCart;
            if (isExisting) {
                newCart = prevCart.map(c => c.itemId === item.itemId ? { ...c, quantity: c.quantity + 1 } : c);
            } else {
                newCart = [...prevCart, { ...item, quantity: 1 }];
            }
            localStorage.setItem('cart', JSON.stringify(newCart));
            return newCart;
        });
        alert(`Đã thêm ${item.itemName} vào giỏ!`);
    };

    const updateQuantity = (itemId, delta) => {
        setCart(prevCart => {
            const newCart = prevCart.map(item => {
                if (item.itemId === itemId) {
                    const newQty = Math.max(1, item.quantity + delta);
                    return { ...item, quantity: newQty };
                }
                return item;
            });
            localStorage.setItem('cart', JSON.stringify(newCart));
            return newCart;
        });
    };

    const toggleSelectItem = (itemId) => {
        setSelectedItems(prev => 
            prev.includes(itemId) ? prev.filter(id => id !== itemId) : [...prev, itemId]
        );
    };

    // Tính tổng tiền cho các món được chọn
    const calculateTotal = () => {
        return cart
            .filter(item => selectedItems.includes(item.itemId))
            .reduce((sum, item) => sum + (item.price * item.quantity), 0);
    };

    //Tính phí ship nội thành (15k) và ngoại thành (35k) 
     const innerDistricts = [
        'Quận 1', 'Quận 3', 'Quận 4', 'Quận 5', 'Quận 6', 
        'Quận 10', 'Quận 11', 'Tân Bình', 'Tân Phú', 
        'Bình Thạnh', 'Phú Nhuận', 'Gò Vấp'
    ];
    // tính số lượng trên giỏ hàng  
    const totalItemsInCart = cart.reduce((sum, item) => sum + item.quantity, 0);    
 
    const calculateShippingFee = () => {
    const userDist = checkoutInfo.district;
    if (!userDist || dbShippingFees.length === 0) return 20000; // Phí mặc định dự phòng

    // Xác định xem khách thuộc nhóm nào
    const isInner = innerDistricts.some(d => userDist.includes(d));
    const targetArea = isInner ? 'Nội thành' : 'Ngoại thành';

    // Tìm trong danh sách từ DB cái giá tương ứng
    const config = dbShippingFees.find(f => f.areaName === targetArea);
    
    return config ? config.price : 20000; 
};

    //========== LOGIC ĐẶT HÀNG & THANH TOÁN MOCK VNPAY ==========//
   
    const handleConfirmOrder = async () => {
    // 1. LẤY dữ liệu ra từ LocalStorage (Dùng getItem, không phải setItem nha)
    const token = localStorage.getItem('token');
    const customerId = localStorage.getItem('userId'); 

    // Kiểm tra nhanh xem đã có ID chưa
    if (!customerId) {
        alert("Ngân ơi, không tìm thấy ID người dùng. Hãy thử đăng xuất rồi đăng nhập lại nhé!");
        return;
    }

    // 2. Tính toán phí ship và tổng tiền (như tụi mình đã làm ở bước trước)
    const shipFee = calculateShippingFee(); 
    const subtotal = calculateTotal();
    const finalAmount = subtotal + shipFee;

    // 3. Đóng gói dữ liệu gửi Backend
    const orderData = {
        customerId: parseInt(customerId), // Ép kiểu về số nguyên cho chắc
        resId: selectedResInfo?.res_id || selectedResInfo?.resId || cart[0].resId,
        deliveryAddress: `${checkoutInfo.address}, ${checkoutInfo.district}, TP. HCM`,
        note: "Đơn hàng từ Web",
        paymentMethod: "VNPAY",
        subtotal: subtotal,
        shippingFee: shipFee,
        totalDiscount: 0,
        finalAmount: finalAmount,
        items: cart.filter(item => selectedItems.includes(item.itemId)).map(item => ({
            itemId: item.itemId,
            quantity: item.quantity,
            priceAtOrder: item.price
        }))
    };

    try {
        // Tới đây mới bắt đầu gọi API nè
        const response = await fetch('http://localhost:8080/api/v1/orders', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + token
            },
            body: JSON.stringify(orderData)
        });

        // ĐÂY mới là lúc biến "result" xuất hiện
        const result = await response.json(); 

        if (result.status === 'success') {
            alert("✨ Tuyệt vời! Đơn hàng của Ngân đã được hệ thống tiếp nhận.");

            // 1. CHỈ XÓA CÁC MÓN ĐÃ ĐẶT (Giữ lại những món khách chưa tích chọn)
            const remainingCart = cart.filter(item => !selectedItems.includes(item.itemId));
            
            // 2. CẬP NHẬT LẠI STATE VÀ LOCALSTORAGE
            setCart(remainingCart);
            localStorage.setItem('cart', JSON.stringify(remainingCart));
            
            // 3. RESET DANH SÁCH CHỌN VỀ RỖNG
            setSelectedItems([]);

            // 4. CHUYỂN TRANG SANG MOCK VNPAY (Kèm theo Order ID và Số tiền để thanh toán)
            // Lấy orderId từ dữ liệu Backend vừa trả về
            const orderId = result.data.orderId; 
            const totalAmount = orderData.finalAmount;

            navigate(`/payment-vnpay?orderId=${orderId}&amount=${totalAmount}`);

        } else {
            alert("❌ Lỗi đặt hàng: " + result.message);
        }
    } catch (error) {
        console.error("Lỗi:", error);
    }
};

            // 2. Viết hàm lấy lịch sử từ Backend
            const fetchOrderHistory = async () => {
                const token = localStorage.getItem('token');
                const customerId = localStorage.getItem('userId');
                
                if (!customerId) {
                    alert("Ngân ơi, hãy đăng nhập để xem lịch sử nhé!");
                    return;
                }

                try {
                    const response = await fetch(`http://localhost:8080/api/v1/orders/history?customerId=${customerId}`, {
                        headers: { 'Authorization': 'Bearer ' + token }
                    });
                    const result = await response.json();
                    
                    if (result.status === 'success') {
                        setOrderHistory(result.data); // Lưu mảng đơn hàng vào state
                        setCurrentView('orders');    // Chuyển sang giao diện lịch sử
                    }
                } catch (error) {
                    console.error("Lỗi khi tải lịch sử:", error);
                }
            };

////////////////==========================================================///////////////////////////
    
return (
        <div className="customer-container">
            {/* --- HEADER --- */}
            <header className="wf-header">
                <div className="wf-logo" onClick={() => setCurrentView('restaurants')} style={{cursor:'pointer'}}>🍕 YUMMY</div>
                
                <div className="header-content-center">
                    <div className="location-box">
                        <i className="fas fa-map-marker-alt"></i>
                        <input type="text" placeholder="Giao đến: Phường Tam Long..." />
                    </div>
                    <div className="wf-search-box">
                        <i className="fas fa-search"></i>
                        <input type="text" placeholder="Tìm món ăn..." value={searchKeyword} onChange={handleSearch} />
                    </div>
                </div>

                <div className="wf-header-right">
                    <button className="wf-icon-btn" onClick={fetchOrderHistory} title="Lịch sử đơn hàng"><i className="fas fa-clock-rotate-left"></i> </button>
                    <button className="wf-icon-btn" onClick={() => setCurrentView('cart')} style={{position:'relative'}}><i className="fas fa-shopping-cart"></i>{totalItemsInCart > 0 && <span className="cart-badge">{totalItemsInCart}</span>}</button>
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
                                    <div key={res.resId} className="restaurant-card" onClick={() => viewRestaurantMenu(res.resId)}>
                                    <img 
                                        src={res.resImage ? `http://localhost:8080/uploads/${res.resImage}` : 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=400'} 
                                        alt={res.resName} 
                                    />                                        
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
                        
                        <section className="res-hero-banner" style={{  backgroundImage: `linear-gradient(to right, rgba(0,0,0,0.8), rgba(0,0,0,0.2)), url(${selectedResInfo.resImage ? `http://localhost:8080/uploads/${selectedResInfo.resImage}` : 'https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?w=1200'})`

                        }}>
                             <div className="res-hero-content">

                        <div className="res-hero-text">

                        {/* Tên nhà hàng - Nếu không có thì hiện chữ 'Nhà hàng Yummy' */}

                        <h1 style={{ fontSize: '32px', marginBottom: '10px' }}>

                            {selectedResInfo.resName || "Đang cập nhật tên..."}

                        </h1>

                       

                        {/* Địa chỉ - Có icon và chữ đi kèm */}

                        <p style={{ marginBottom: '15px', fontSize: '16px' }}>

                            <i className="fas fa-map-marker-alt" style={{ marginRight: '8px' }}></i>

                            {selectedResInfo.resAddress || "Đang cập nhật địa chỉ..."}

                        </p>

                       

                        {/* Các thông số phụ */}

                        <div className="res-hero-badges">

                            <span className="badge-item"><i className="fas fa-star"></i> 4.8 (500+ đánh giá)</span>

                            <span className="badge-item" style={{ marginLeft: '20px' }}><i className="fas fa-clock"></i> 20-30 phút</span>

                        </div>

                    </div>

                </div>

            </section>

                        <section className="menu-section">
                            <h3 className="section-title">Danh sách món ăn</h3>
                            <div className="menu-grid">
                                {menuItems.map(item => {
                                    console.log("Dữ liệu món ăn từ Server:", item);

                                    return(
                                    <div key={item.itemId} className="food-item-card">
                                        <div className="food-img-container">
                                            <img 
                                            src={item.itemImage ? `http://localhost:8080/uploads/${item.itemImage}?t=${Date.now()}` : '/image/load.jpg'}                                             
                                            alt={item.itemName} 
                                            />
                                        </div>
                                        <div className="food-details">
                                            <h5>{item.itemName}</h5>
                                            <div className="food-footer">
                                                <span className="price">{item.price?.toLocaleString('vi-VN')} đ</span>
                                                <button className="btn-add-small" onClick={() => addToCart(item)}>
                                                    <i className="fas fa-plus"></i> Thêm
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                    );
                                })}
                            </div>
                        </section>
                    </div>
                )}

                {/* --- VIEW 3: GIỎ HÀNG (THEO WIREFRAME) --- */}
                {currentView === 'cart' && (
                    <div className="cart-view-container">
                        <h2 className="section-title">Giỏ hàng của tôi</h2>
                        <div className="cart-items-list">
                            {cart.length === 0 ? (
                                <p>Giỏ hàng trống rỗng...</p>
                            ) : (
                                cart.map(item => (
                                    <div key={item.itemId} className="cart-item-box">
                                        <div className="cart-item-img">
                                        <img 
                                        src={item.itemImage ? `http://localhost:8080/uploads/${item.itemImage}` : '/image/load.jpg'} 
                                        alt={item.itemName} 
                                         />     
                                        </div>
                                        <div className="cart-item-info">
                                            <h4>{item.itemName}</h4>
                                            <p className="price">{item.price?.toLocaleString('vi-VN')} đ</p>
                                            <button className="btn-voucher-outline">Voucher</button>
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
                                ))
                            )}
                        </div>
                        {selectedItems.length > 0 && (
                            <div className="cart-footer-bar">
                                <span>Tổng cộng: <strong>{calculateTotal().toLocaleString('vi-VN')} đ</strong></span>
                        <button className="btn-checkout" onClick={() => setCurrentView('checkout')}> Thanh toán ({selectedItems.length})</button>                            </div>
                        )}
                    </div>
                )}

                {/* VIEW 4: ĐIỀN THÔNG TIN GIAO HÀNG */}
                    {currentView === 'checkout' && (
                        <div className="checkout-view">
                            <button className="btn-back-link" onClick={() => setCurrentView('cart')}>
                                <i className="fas fa-chevron-left"></i> Quay lại giỏ hàng
                            </button>

                            <div className="checkout-container">
                                <h2 className="section-title">Thông tin giao hàng</h2>
                                
                                <div className="checkout-form-box">
                                    <div className="input-group">
                                        <label>* Họ và tên</label>
                                        <input 
                                            type="text" name="fullName" 
                                            value={checkoutInfo.fullName} onChange={handleInputChange}
                                            placeholder="Nhập họ tên người nhận" 
                                        />
                                    </div>

                                    <div className="input-group">
                                        <label>* Số điện thoại</label>
                                        <input 
                                            type="text" name="phone" 
                                            value={checkoutInfo.phone} onChange={handleInputChange}
                                            placeholder="Số điện thoại liên lạc" 
                                        />
                                    </div>

                                    <div className="input-group">
                                        <label>* Quận/Huyện</label>
                                        <select name="district" value={checkoutInfo.district || ''} onChange={handleInputChange}>
                                            <option value="">-- Chọn Quận/Huyện --</option>
                                            {/* Nhóm Nội Thành - 15k */}
                                            <option value="Quận 1">Quận 1</option>
                                            <option value="Quận 3">Quận 3</option>
                                            <option value="Quận 4">Quận 4</option>
                                            <option value="Quận 5">Quận 5</option>
                                            <option value="Quận 6">Quận 6</option>
                                            <option value="Quận 7">Quận 7</option>
                                            <option value="Quận 10">Quận 10</option>
                                            <option value="Quận 11">Quận 11</option>
                                            <option value="Tân Bình">Quận Tân Bình</option>
                                            <option value="Tân Phú">Quận Tân Phú</option>
                                            <option value="Bình Thạnh">Quận Bình Thạnh</option>
                                            <option value="Phú Nhuận">Quận Phú Nhuận</option>
                                            <option value="Gò Vấp">Quận Gò Vấp</option>

                                            {/* Nhóm Ngoại Thành - 35k */}
                                            <option value="Thủ Đức">TP. Thủ Đức</option>
                                            <option value="Bình Chánh">Huyện Bình Chánh</option>
                                            <option value="Hóc Môn">Huyện Hóc Môn</option>
                                            <option value="Củ Chi">Huyện Củ Chi</option>
                                            <option value="Nhà Bè">Huyện Nhà Bè</option>
                                            <option value="Cần Giờ">Huyện Cần Giờ</option>                                        
                                        </select>
                                    </div>
                                    <div className="input-group">
                                        <label>* Số nhà/Tên đường</label>
                                        <textarea 
                                            name="address" 
                                            value={checkoutInfo.address} onChange={handleInputChange}
                                            placeholder="Số nhà, tên đường, phường/xã..." 
                                        />
                                    </div>

                                    {/* Phần Voucher - Tạm thời để placeholder như Ngân muốn */}
                                    <div className="voucher-placeholder">
                                        <p><i className="fas fa-ticket-alt"></i> Voucher: Hiện tại chưa có mã giảm giá</p>
                                    </div>

                                    <div className="order-summary-final">
                                        <div className="summary-row">
                                            <span>Tổng tiền món:</span>
                                            <span>{calculateTotal().toLocaleString('vi-VN')} đ</span>
                                        </div>
                                        
                                        <div className="summary-row">
                                            <span>
                                                Phí vận chuyển ({innerDistricts.some(d => checkoutInfo.district === d) ? 'Nội thành' : 'Ngoại thành'}):
                                            </span>
                                            <span style={{ fontWeight: 'bold' }}>
                                                +{calculateShippingFee().toLocaleString('vi-VN')} đ
                                            </span>
                                        </div>
                                        
                                        <hr />
                                        
                                        <div className="summary-row total">
                                            <span style={{fontWeight:'bold'}}>Tổng thanh toán:</span>
                                            <span className="final-price" style={{color: '#e74c3c', fontSize: '20px', fontWeight: 'bold'}}>
                                                {/* CỘNG PHÍ SHIP ĐÃ TÍNH VÀO ĐÂY */}
                                                {(calculateTotal() + calculateShippingFee()).toLocaleString('vi-VN')} đ
                                            </span>
                                        </div>
                                    </div>

                                    <button className="btn-confirm-order" onClick={handleConfirmOrder}>
                                        Xác nhận đặt hàng
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}
                {/* VIEW 5: XEM LỊCH SỬ ĐƠN HÀNG */}
                {currentView === 'orders' && (
                <div className="order-history-page" style={{ padding: '30px 20px', maxWidth: '800px', margin: '0 auto' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
                        <h2 style={{ fontSize: '28px', fontWeight: '800', color: '#fff', margin: 0 }}>Đơn hàng của Ngân 🍕</h2>
                        <button onClick={() => setCurrentView('restaurants')} style={styles.backHomeBtn}>
                            <i className="fas fa-plus"></i> Đặt món mới
                        </button>
                    </div>
                    <div className="orders-list">
                        {orderHistory.length === 0 ? (
                            <div style={styles.emptyState}>Ngân chưa có đơn hàng nào. Thử ngay nhé!</div>
                        ) : (
                            orderHistory.map(order => (
                                <div key={order.orderId} style={styles.luxuryOrderCard}>
                                    {/* 1. Header: Mã đơn & Trạng thái */}
                                    <div style={styles.cardHeader}>
                                        <div>
                                            <span style={{ color: '#2ecc71', fontWeight: 'bold', fontSize: '14px' }}>MÃ ĐƠN: #{order.orderId}</span>
                                            <div style={{ color: '#888', fontSize: '12px', marginTop: '4px' }}>
                                                {new Date(order.createdAt).toLocaleString('vi-VN')}
                                            </div>
                                        </div>
                                        <span style={{ 
                                            ...styles.statusTag, 
                                            backgroundColor: order.orderStatus === 'COMPLETED' ? 'rgba(46, 204, 113, 0.15)' : 'rgba(243, 156, 18, 0.15)',
                                            color: order.orderStatus === 'COMPLETED' ? '#2ecc71' : '#f39c12'
                                        }}>
                                            ● {order.orderStatus}
                                        </span>
                                    </div>

                                    {/* 2. CHI TIẾT MÓN ĂN (Phần Ngân muốn nhất nè) */}
                                    <div style={styles.itemsSection}>
                                        <p style={{ color: '#5c6273', fontSize: '12px', fontWeight: 'bold', textTransform: 'uppercase', marginBottom: '15px' }}>Chi tiết món ăn</p>
                                        {order.items && order.items.map((item, idx) => (
                                            <div key={idx} style={styles.itemRow}>
                                                <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                                                    <span style={styles.itemQty}>{item.quantity}x</span>
                                                    <span style={{ color: '#eee', fontWeight: '500' }}>{item.itemName}</span>
                                                </div>
                                                <span style={{ color: '#fff', fontWeight: 'bold' }}>
                                                    {(item.priceAtOrder * item.quantity).toLocaleString('vi-VN')}đ
                                                </span>
                                            </div>
                                        ))}
                                    </div>

                                    {/* 3. Tổng kết tiền bạc */}
                                    <div style={styles.priceContainer}>
                                        <div style={styles.priceLine}><span>Tạm tính:</span> <span>{order.subtotal?.toLocaleString('vi-VN')}đ</span></div>
                                        <div style={styles.priceLine}><span>Phí vận chuyển:</span> <span>+{order.shippingFee?.toLocaleString('vi-VN')}đ</span></div>
                                        <div style={styles.finalLine}>
                                            <span>Tổng thanh toán</span>
                                            <span style={{ color: '#ff4757', fontSize: '22px' }}>{order.finalAmount?.toLocaleString('vi-VN')}đ</span>
                                        </div>
                                    </div>

                                    {/* 4. Thông tin giao hàng */}
                                    <div style={styles.deliveryBox}>
                                        <div style={styles.infoLine}><i className="fas fa-map-marker-alt" style={{width:'20px'}}></i> {order.deliveryAddress}</div>
                                        <div style={styles.infoLine}><i className="fas fa-credit-card" style={{width:'20px'}}></i> {order.paymentMethod} - <span style={{color: '#2ecc71'}}>{order.paymentStatus}</span></div>
                                        {order.note && <div style={styles.infoLine}><i className="fas fa-comment-dots" style={{width:'20px'}}></i> <em>"{order.note}"</em></div>}
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </div>
            )}
                        </main>
                    </div>
                );
            };
// Thêm cái này vào cuối file Home.jsx để hết bị lỗi "tối thui" nhé Ngân
const styles = {
    luxuryOrderCard: {
        background: '#1c1e26',
        borderRadius: '24px',
        padding: '25px',
        marginBottom: '30px',
        border: '1px solid #2d313d',
        boxShadow: '0 15px 35px rgba(0,0,0,0.3)',
        textAlign: 'left'
    },
    cardHeader: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingBottom: '20px',
        borderBottom: '1px solid #2d313d'
    },
    statusTag: {
        padding: '6px 16px',
        borderRadius: '12px',
        fontSize: '11px',
        fontWeight: 'bold'
    },
    itemsSection: {
        padding: '20px 0',
        borderBottom: '1px dashed #2d313d'
    },
    itemRow: {
        display: 'flex',
        justifyContent: 'space-between',
        marginBottom: '12px',
        fontSize: '15px'
    },
    itemQty: {
        background: 'rgba(46, 204, 113, 0.1)',
        color: '#2ecc71',
        padding: '2px 8px',
        borderRadius: '6px',
        fontSize: '12px',
        fontWeight: 'bold'
    },
    priceContainer: { padding: '20px 0' },
    priceLine: { display: 'flex', justifyContent: 'space-between', color: '#888', fontSize: '14px', marginBottom: '8px' },
    finalLine: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '15px', fontWeight: '800', color: '#fff' },
    deliveryBox: { background: 'rgba(0,0,0,0.2)', padding: '15px', borderRadius: '16px', marginTop: '10px' },
    infoLine: { fontSize: '13px', color: '#aaa', marginBottom: '8px', display: 'flex', gap: '10px', alignItems: 'center' },
    backHomeBtn: { background: '#2ecc71', color: '#fff', border: 'none', padding: '10px 20px', borderRadius: '12px', fontWeight: 'bold', cursor: 'pointer' }
};
export default Home;