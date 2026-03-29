import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

// Import các trang giao diện
import Auth from './pages/Auth';           // Dùng Auth.jsx làm trang khởi đầu
import Home from './pages/Home';           // Trang chủ dành cho Khách hàng
import Restaurant from './pages/Restaurant'; // Trang quản lý của Nhà hàng
import Admin from './pages/Admin';         // Trang quản trị của Admin

function App() {
  return (
    <Router>
      <Routes>
        {/* Mặc định vừa vào web sẽ hiển thị component Auth (gồm Login/Register) */}
        <Route path="/" element={<Auth />} />
        
        {/* Các trang sẽ được chuyển đến sau khi đăng nhập thành công */}
        <Route path="/home" element={<Home />} />
        <Route path="/restaurant" element={<Restaurant />} />
        <Route path="/admin" element={<Admin />} />

        {/* Nếu người dùng gõ link bậy bạ, tự động đẩy về lại trang Auth */}
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </Router>
  );
}

export default App;