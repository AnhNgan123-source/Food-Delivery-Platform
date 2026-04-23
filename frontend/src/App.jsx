import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

// === 1. IMPORT LAYOUTS (KHUNG GIAO DIỆN) ===
import AdminLayout from './layouts/AdminLayout/AdminLayout';
import CustomerLayout from './layouts/CustomerLayout/CustomerLayout';
import RestaurantLayout from './layouts/RestaurantLayout/RestaurantLayout';

// === 2. IMPORT PAGES (TRANG ĐÍCH) ===
import Auth from './pages/Auth/Auth';
import Home from './pages/Customer/Home'; 
import OrderTracking from './pages/Customer/OrderTracking';
import Restaurant from './pages/Restaurant/Restaurant'; // Trang chính của quán
import Admin from './pages/Admin/Admin'; // Trang chính của admin
import RestaurantDetailView from './pages/Customer/RestaurantDetailView';
import CartView from './pages/Customer/CartView';
import OrderHistoryView from './pages/Customer/OrderHistoryView';
import CartCheckoutView from './pages/Customer/CartCheckoutView';



// === 3. IMPORT CÁC COMPONENT CON (Để gắn vào Outlet) ===
import AdminAnalytics from './components/Admin/Analytics/AdminAnalytics';
import ApproveRestaurant from './components/Admin/RestaurantMgmt/ApproveRestaurant';
import PaymentVNPay from './components/Customer/Checkout/PaymentVNPay';
import Profile from './components/Common/Profile/Profile';
import ReviewModal from './components/Customer/Modal/ReviewModal';


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
          <Route path="/restaurant/:resId" element={<RestaurantDetailView />} />
          <Route path="/cart" element={<CartView />} />
          <Route path="/profile" element={<Profile/>} />
          <Route path="/orders" element={<OrderHistoryView/>} />
          <Route path="/checkout" element={<CartCheckoutView />} />
          <Route path="/check" element={<CartCheckoutView />} />
          <Route path="/payment-vnpay" element={<PaymentVNPay />} />



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