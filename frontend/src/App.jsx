import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

// === IMPORT CÁC TRANG GIAO DIỆN (PAGES) ===

// 1. Trang xác thực (Login/Register)
import Auth from './pages/Auth/Auth';

// 2. Trang chủ dành cho Khách hàng (Đã đổi tên từ Home thành Customer)
import Customer from './pages/Customer/Home'; 

// 3. Các trang tính năng của Khách hàng
import PaymentVNPay from './pages/Customer/PaymentVNPay';
import OrderTracking from './pages/Customer/OrderTracking';

// 4. Trang dành cho Nhà hàng
import Restaurant from './pages/Restaurant/Restaurant';

// 5. Trang dành cho Admin
import Admin from './pages/Admin/Admin';


function App() {
  return (
    <Router>
      <Routes>
        {/* Trang mặc định: Đăng nhập / Đăng ký */}
        <Route path="/" element={<Auth />} />
        
        {/* Điều hướng dành cho Khách hàng */}
        <Route path="/home" element={<Customer />} /> {/* Đổi Home thành Customer */}
        <Route path="/payment-vnpay" element={<PaymentVNPay />} />
        <Route path="/order-tracking/:orderId" element={<OrderTracking />} />
        
        {/* Điều hướng dành cho Nhà hàng và Admin */}
        <Route path="/restaurant" element={<Restaurant />} />
        <Route path="/admin" element={<Admin />} />

        {/* Xử lý đường dẫn không tồn tại: Đẩy về trang Auth */}
        <Route path="*" element={<Navigate to="/" />} />  
      </Routes>
    </Router>
  );
}

export default App;