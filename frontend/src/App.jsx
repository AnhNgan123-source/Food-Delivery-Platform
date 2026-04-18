import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

// === 1. IMPORT LAYOUTS (KHUNG GIAO DIỆN) ===
import AdminLayout from './components/layouts/AdminLayout/AdminLayout';
import CustomerLayout from './components/layouts/CustomerLayout/CustomerLayout';
import RestaurantLayout from './components/layouts/RestaurantLayout/RestaurantLayout';

// === 2. IMPORT PAGES (TRANG ĐÍCH) ===
import Auth from './pages/Auth/Auth';
import Home from './pages/Customer/Home'; 
import OrderTracking from './pages/Customer/OrderTracking';
import Restaurant from './pages/Restaurant/Restaurant'; // Trang chính của quán
import Admin from './pages/Admin/Admin'; // Trang chính của admin

// === 3. IMPORT CÁC COMPONENT CON (Để gắn vào Outlet) ===
import AdminAnalytics from './components/Admin/Analytics/AdminAnalytics';
import ApproveRestaurant from './components/Admin/RestaurantMgmt/ApproveRestaurant';
import PaymentVNPay from './components/Customer/Payment/PaymentVNPay';

function App() {
  return (
    <Router>
      <Routes>
        {/* LOGIN / REGISTER */}
        <Route path="/" element={<Auth />} />
        
        {/* PHẦN KHÁCH HÀNG */}
        <Route element={<CustomerLayout />}>
          <Route path="/home" element={<Home />} />
          <Route path="/order-tracking/:orderId" element={<OrderTracking />} />
        </Route>

        {/* PHẦN NHÀ HÀNG (Dùng Restaurant.jsx làm trang mặc định) */}
        <Route path="/restaurant" element={<RestaurantLayout />}>
          <Route index element={<Restaurant />} /> 
          {/* Khi vào /restaurant, nội dung file Restaurant.jsx sẽ hiện ở Outlet */}
        </Route>

        {/* PHẦN ADMIN (Dùng Admin.jsx làm trang mặc định) */}
        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<Admin />} /> 
          {/* Khi vào /admin, nội dung file Admin.jsx sẽ hiện ở Outlet */}
          <Route path="analytics" element={<AdminAnalytics />} />
          <Route path="approve" element={<ApproveRestaurant />} />
        </Route>

        <Route path="*" element={<Navigate to="/" />} />  
      </Routes>
    </Router>
  );
}

export default App;