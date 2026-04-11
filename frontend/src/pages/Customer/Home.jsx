import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import VoucherModal from '../../components/Customer/VoucherModal';
import ReviewModal from '../../components/Customer/ReviewModal';
import RestaurantDetailView from './RestaurantDetailView';
import CartCheckoutView from './CartCheckoutView';
import OrderHistoryView from './OrderHistoryView';

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
    //lưu danh sách đơn hàng
    const [orderHistory, setOrderHistory] = useState([]);
    const [paymentMethod, setPaymentMethod] = useState('CASH');//Mặc định httt là tiền mặt
    //voucher
    const [isVoucherModalOpen, setIsVoucherModalOpen] = useState(false);
    const [appliedVoucher, setAppliedVoucher] = useState(null);
    //review
    const [activeMenuTab, setActiveMenuTab] = useState('items'); // 'items' hoặc 'reviews'
    const [restaurantReviews, setRestaurantReviews] = useState([]);
    const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);
    const [selectedOrderReview, setSelectedOrderReview] = useState(null);
    const [reviewedOrders, setReviewedOrders] = useState([]); // Để ẩn nút sau khi đánh giá xong

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
    // Hàm lấy review khi chuyển Tab
    const fetchReviews = async (resId) => {
        const res = await fetch(`http://localhost:8080/api/v1/reviews/restaurant/${resId}`);
        const data = await res.json();
            if (data.status === "success") setRestaurantReviews(data.data);
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
        console.log("Đang gọi món cho nhà hàng ID:", resId);
        const token = localStorage.getItem('token');
        try {
            // Lưu ý: Nếu sếp dùng API chung cho khách xem menu, hãy kiểm tra URL này
            // Nếu URL đúng là trả về mảng món ăn:
            const response = await fetch(`http://localhost:8080/api/menu/restaurant/${resId}`, {
                headers: { 'Authorization': 'Bearer ' + token }
            });
            
            const result = await response.json(); 

            // Kiểm tra nếu response OK và result là một mảng
            if (response.ok && Array.isArray(result)) {
                // 1. Tìm thông tin nhà hàng từ danh sách allRestaurants để hiển thị tên/ảnh nhà hàng
                const resInfo = allRestaurants.find(r => (Number(r.resId) === Number(resId) || Number(r.res_id) === Number(resId)));
                setSelectedResInfo(resInfo);

                // 2. Set thẳng mảng món ăn vào state
                setMenuItems(result); 

                // 3. Chuyển sang view menu
                setCurrentView('menu');
            } else {
                console.error("Dữ liệu không phải mảng hoặc lỗi API:", result);
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
        'Bình Thạnh', 'Phú Nhuận', 'Gò Vấp'];
    // tính số lượng trên giỏ hàng  
    const totalItemsInCart = cart.reduce((sum, item) => sum + item.quantity, 0);    
 
    const calculateShippingFee = () => {
    const userDist = checkoutInfo.district;
    if (!userDist || dbShippingFees.length === 0) return 20000; // Phí mặc định dự phòng nếu chưa chọn địa chỉ

    // Xác định xem khách thuộc nhóm nào
    const isInner = innerDistricts.some(d => userDist.includes(d));
    const targetArea = isInner ? 'Nội thành' : 'Ngoại thành';

    // Tìm trong danh sách từ DB cái giá tương ứng
    const config = dbShippingFees.find(f => f.areaName === targetArea);
    
    return config ? config.price : 20000; 
};

    //========== LOGIC ĐẶT HÀNG & THANH TOÁN MOCK VNPAY ==========//
   
    const handleConfirmOrder = async () => {
    const token = localStorage.getItem('token');
    const customerId = localStorage.getItem('userId');

    if (!customerId) {
        alert("Bạn ơi, lỗi định danh rồi! Đăng nhập lại giúp mình nhé.");
        return;
    }

    // 1. Lấy danh sách món thực sự được chọn để đặt
    const itemsToOrder = cart.filter(item => selectedItems.includes(item.itemId));
    
    if (itemsToOrder.length === 0) {
        alert("Giỏ hàng đang trống hoặc bạn chưa chọn món nào kìa!");
        return;
    }

    // 2. Lấy resId an toàn (Kiểm tra từng bước để tránh lỗi undefined)
    const resId = selectedResInfo?.resId || selectedResInfo?.res_id || itemsToOrder[0]?.resId;

    const shipFee = calculateShippingFee();
    const subtotal = calculateTotal();
    const discount = appliedVoucher ? appliedVoucher.discountValue : 0;
    const finalAmount = subtotal + shipFee - discount;

    const orderData = {
        customerId: parseInt(customerId),
        resId: resId,
        deliveryAddress: `${checkoutInfo.address}, ${checkoutInfo.district}, TP. HCM`,
        note: "Đơn hàng từ Web",
        paymentMethod: paymentMethod, // Lấy từ state sếp vừa tạo
        subtotal: subtotal,
        shippingFee: shipFee,
        totalDiscount: discount,
        finalAmount: finalAmount,
        items: itemsToOrder.map(item => ({
            itemId: item.itemId,
            quantity: item.quantity,
            priceAtOrder: item.price
        }))
    };

    try {
        const response = await fetch('http://localhost:8080/api/v1/orders', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + token
            },
            body: JSON.stringify(orderData)
        });

        const result = await response.json();

        if (result.status === 'success') {
            // QUAN TRỌNG: Phải lấy orderId từ result.data trả về
            const newOrderId = result.data.orderId; 

            alert(`Tuyệt vời! Đơn hàng #${newOrderId} đã được tiếp nhận.`);

            // Xóa các món đã đặt khỏi giỏ
            const remainingCart = cart.filter(item => !selectedItems.includes(item.itemId));
            setCart(remainingCart);
            localStorage.setItem('cart', JSON.stringify(remainingCart));
            setSelectedItems([]);

            //  Rẽ nhánh điều hướng
            if (paymentMethod === 'ONLINE') {
                navigate(`/payment-vnpay?orderId=${newOrderId}&amount=${finalAmount}`);
            } else {
                // Nếu tiền mặt, về thẳng trang theo dõi đơn
                navigate(`/order-tracking/${newOrderId}`);
            }
        } else {
            alert(" Lỗi: " + result.message);
        }
    } catch (error) {
        console.error("Lỗi đặt hàng:", error);
        alert("Hệ thống bận rồi bạn ơi, thử lại sau nhé!");
    }
};

            // 2. Viết hàm lấy lịch sử từ Backend
            const fetchOrderHistory = async () => {
                const token = localStorage.getItem('token');
                const customerId = localStorage.getItem('userId');
                
                if (!customerId) {
                    alert("Bạn ơi, hãy đăng nhập để xem lịch sử nhé!");
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


///////////////////////=====================================/////////////////////////////////
    return (
        <div className="customer-container">
            {/* Header copy từ code cũ */}
            <main className="main-layout">
                <RestaurantDetailView 
                    currentView={currentView}
                    filteredRestaurants={filteredRestaurants}
                    viewRestaurantMenu={viewRestaurantMenu}
                    selectedResInfo={selectedResInfo}
                    activeMenuTab={activeMenuTab}
                    setActiveMenuTab={setActiveMenuTab}
                    menuItems={menuItems}
                    restaurantReviews={restaurantReviews}
                    fetchReviews={fetchReviews}
                    addToCart={addToCart}
                />

                <CartCheckoutView 
                    currentView={currentView}
                    cart={cart}
                    selectedItems={selectedItems}
                    updateQuantity={updateQuantity}
                    toggleSelectItem={toggleSelectItem}
                    calculateTotal={calculateTotal}
                    setCurrentView={setCurrentView}
                    checkoutInfo={checkoutInfo}
                    handleInputChange={handleInputChange}
                    paymentMethod={paymentMethod}
                    setPaymentMethod={setPaymentMethod}
                    calculateShippingFee={calculateShippingFee}
                    appliedVoucher={appliedVoucher}
                    handleConfirmOrder={handleConfirmOrder}
                    setIsVoucherModalOpen={setIsVoucherModalOpen}
                />

                {currentView === 'orders' && (
                    <OrderHistoryView 
                        orderHistory={orderHistory}
                        navigate={navigate}
                        setSelectedOrderReview={setSelectedOrderReview}
                        setIsReviewModalOpen={setIsReviewModalOpen}
                        reviewedOrders={reviewedOrders}
                    />
                )}
            </main>

            <VoucherModal isOpen={isVoucherModalOpen} onClose={() => setIsVoucherModalOpen(false)} cartTotal={calculateTotal()} onApply={setAppliedVoucher} />
            <ReviewModal isOpen={isReviewModalOpen} onClose={() => setIsReviewModalOpen(false)} order={selectedOrderReview} onSuccess={(id) => setReviewedOrders(p => [...p, id])} />
        </div>
    );
};
export default Home;