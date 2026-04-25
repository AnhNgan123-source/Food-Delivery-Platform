import React, { useState, useEffect, useMemo} from 'react';
import { useNavigate, useLocation, useOutletContext } from 'react-router-dom';
import customerApi from '../../api/customerApi';
import CheckoutForm from '../../components/Customer/Checkout/CheckoutForm';
import PaymentSelector from '../../components/Customer/Checkout/PaymentSelector';
import OrderSummary from '../../components/Customer/Checkout/OrderSummary';
import VoucherModal from '../../components/Customer/Modal/VoucherModal';
import styles from '../../components/Customer/Checkout/Checkout.module.css';

const INNER_DISTRICTS = ['Quận 1', 'Quận 2', 'Quận 3', 'Quận 4', 'Quận 5', 'Quận 6', 'Quận 8', 'Quận 9', 'Quận 10', 'Quận 11', 'Tân Bình', 'Tân Phú', 'Bình Thạnh', 'Phú Nhuận', 'Gò Vấp'];

const CartCheckoutView = () => {
    const navigate = useNavigate();
    const { state } = useLocation();
    
    const selectedItems = state?.selectedItems || [];
    const subtotal = state?.total || 0;

    const { updateCartCount } = useOutletContext();// reset cart

    // --- STATES ---
    const [info, setInfo] = useState({ 
        fullName: localStorage.getItem('fullName') || '', 
        phone: localStorage.getItem('phone') || '', 
        district: '', address: '', note: '' 
    });
    const [paymentMethod, setPaymentMethod] = useState('CASH');
    const [dbShippingFees, setDbShippingFees] = useState([]);
    
    // Đưa các state này vào trong component
    const [isVoucherModalOpen, setIsVoucherModalOpen] = useState(false);
    const [appliedVoucher, setAppliedVoucher] = useState(null);

    // --- EFFECTS ---
    useEffect(() => {
        const fetchFees = async () => {
            try {
                const res = await customerApi.getShippingConfig();
                setDbShippingFees(res?.data || res || []);
            } catch (error) {
                setDbShippingFees([{ areaName: "Nội thành", price: 20000 }, { areaName: "Ngoại thành", price: 40000 }]);
            }
        };
        fetchFees();
    }, []);

    // --- LOGIC ---
    const shippingFee = useMemo(() => {
        if (!info.district) return 0;
        const isInner = INNER_DISTRICTS.includes(info.district);
        const target = isInner ? "Nội thành" : "Ngoại thành";
        const config = dbShippingFees.find(f => (f.areaName || f.area_name)?.trim() === target);
        return config ? Number(config.price) : (isInner ? 20000 : 40000);
    }, [info.district, dbShippingFees]);

    const handleApplyVoucher = (v) => {
        setAppliedVoucher(v);
        setIsVoucherModalOpen(false);
    };

    const handleConfirmOrder = async () => {
        const { fullName, phone, district, address, note } = info;
        if (!fullName.trim() || !phone.trim() || !district || !address.trim()) {
            return alert("Điền thiếu thông tin!");
        }

        try {
            let discount = 0;
                        if (appliedVoucher) {
                            if (appliedVoucher.discountType === 'percentage') {
                                // Tính số tiền giảm dựa trên %
                                const calculated = (subtotal * appliedVoucher.discountValue) / 100;
                                // Chặn mức giảm tối đa (nếu có)
                                discount = appliedVoucher.maxDiscountAmount > 0 
                                    ? Math.min(calculated, appliedVoucher.maxDiscountAmount) 
                                    : calculated;
                            } else {
                                // Nếu là tiền mặt thì lấy thẳng giá trị
                                discount = appliedVoucher.discountValue;
                            }
                        }

                        const finalTotal = subtotal + shippingFee - discount;

            const orderData = {
                customerId: parseInt(localStorage.getItem('userId')),
                resId: parseInt(localStorage.getItem('lastVisitedResId')),
                deliveryAddress: `${address.trim()}, ${district}, TP.HCM`,
                paymentMethod,
                subtotal,
                shippingFee,
                totalDiscount: discount,
                finalAmount: finalTotal,
                voucherId: appliedVoucher?.voucherId || null, // Gửi voucher_id về DB
                note: note || "Đơn từ Web",
                items: selectedItems.map(i => ({ 
                    itemId: i.itemId, 
                    quantity: i.quantity, 
                    priceAtOrder: i.price 
                }))
            };

            const response = await customerApi.createOrder(orderData);
            const newOrderId = response?.data?.orderId || response?.orderId;

            if (newOrderId) {

                // 1. Lấy toàn bộ giỏ hàng hiện tại trong máy
                const currentCart = JSON.parse(localStorage.getItem('cart')) || [];               
                // 2. Lọc bỏ những món vừa mới đặt thành công (nằm trong selectedItems)
                // Những món nào KHÔNG nằm trong danh sách vừa đặt thì giữ lại
                const updatedCart = currentCart.filter(cartItem => 
                    !selectedItems.some(selected => selected.itemId === cartItem.itemId)
                );
                // 3. Lưu lại giỏ hàng mới vào localStorage
                localStorage.setItem('cart', JSON.stringify(updatedCart));
                // 4. update cart
                if (updateCartCount) {
                updateCartCount();
                }
                alert("Đặt món thành công!");
                if (paymentMethod === 'ONLINE') {
                    navigate(`/payment-vnpay?orderId=${newOrderId}&amount=${finalTotal}`);
                } else {
                    navigate(`/order-tracking/${newOrderId}`);
                }
            }
        } catch (error) {
            // Hiện thông báo thật từ Backend trả về
            const errorMsg = error.response?.data?.message || error.response?.data || "Lỗi hệ thống";
            
            // Nếu là lỗi "Bạn đã sử dụng mã này rồi", Ngân sẽ thấy nó hiện ra ngay ở đây!
            alert("Thông báo: " + errorMsg); 

            if (errorMsg.includes("mã giảm giá")) {
                setAppliedVoucher(null); // Tự động bỏ voucher đã dùng ra để khách chọn cái khác
            }
        }
    };

    return (
        <div className={styles.checkoutView}>
            <div className={styles.container}>
                <button className={styles.backLink} onClick={() => navigate('/cart')}>
                    <i className="fas fa-chevron-left"></i> Quay lại giỏ hàng
                </button>

                <div className={styles.layout}>
                    <div className={styles.leftCol}>
                        <CheckoutForm 
                            info={info} 
                            onChange={(e) => setInfo({ ...info, [e.target.name]: e.target.value })} 
                            setIsVoucherModalOpen={setIsVoucherModalOpen}
                            appliedVoucher={appliedVoucher}
                        />
                        <PaymentSelector method={paymentMethod} setMethod={setPaymentMethod} />
                    </div>

                    <div className={styles.rightCol}>
                        <OrderSummary 
                            selectedItems={selectedItems}
                            subtotal={subtotal} 
                            shippingFee={shippingFee} 
                            voucher={appliedVoucher}
                            onConfirm={handleConfirmOrder}
                        />
                    </div>
                </div>
            </div>

            {/* Thêm Modal vào đây */}
            <VoucherModal 
                isOpen={isVoucherModalOpen} 
                onClose={() => setIsVoucherModalOpen(false)} 
                cartTotal={subtotal} // Truyền subtotal của giỏ hàng vào đây
                onApply={handleApplyVoucher}
            />
        </div>
    );
};

export default CartCheckoutView;