import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

// Layouts
import AdminLayout from './components/layouts/AdminLayout/AdminLayout';
import CustomerLayout from './components/layouts/CustomerLayout/CustomerLayout';
import RestaurantLayout from './components/layouts/RestaurantLayout/RestaurantLayout';

// --- CUSTOMER PAGES ---
import Auth from './pages/Auth/Auth';
import CustomerHome from './pages/Customer/Home'; 
import OrderTracking from './pages/Customer/OrderTracking';
import RestaurantDetailView from './pages/Customer/RestaurantDetailView';
import CartView from './pages/Customer/CartView';
import OrderHistoryView from './pages/Customer/OrderHistoryView';
import CartCheckoutView from './pages/Customer/CartCheckoutView';
import PaymentVNPay from './components/Customer/Checkout/PaymentVNPay';
import ReviewModal from './components/Customer/Modal/ReviewModal';


// --- RESTAURANT PAGES ---
import RestaurantHome from './pages/Restaurant/HomePage'; 
import ManageMenuPage from './pages/Restaurant/ManageMenuPage'; 
import AddMenuItemForm from './components/Restaurant/Menu/AddMenuItemForm'; 
import RestaurantOrdersPage from './pages/Restaurant/RestaurantOrdersPage'; 
import ResInfoPage from './pages/Restaurant/ResInfoPage'; 
import RestaurantStatsPage from './pages/Restaurant/RestaurantStatsPage';
import ReviewList from './components/Restaurant/Reviews/ReviewList';
// ADMIN PAGES
import AdminHome from './pages/Admin/HomePage'; 
import ApproveResPage from './pages/Admin/ApproveResPage'; 
import ManageResPage from './pages/Admin/ManageResPage';
import ManageShipperPage from './pages/Admin/ManageShipperPage';
import ManageVoucherPage from './pages/Admin/ManageVoucherPage';
import ShippingConfigPage from './pages/Admin/ShippingConfigPage'; 
import ManageAnalyticsPage from './pages/Admin/ManageAnalyticsPage'; 

// Components
import Profile from './components/Common/Profile/Profile';
import ResReviewsPage from './pages/Restaurant/ResReviewsPage';

function App() {
  return (
    <Router>
      <Routes>
        {/* AUTHENTICATION */}
        <Route path="/" element={<Auth />} />
        
        {/* CUSTOMER SECTION */}
        <Route element={<CustomerLayout />}>
          <Route path="/home" element={<CustomerHome />} />
          <Route path="/order-tracking/:orderId" element={<OrderTracking />} />
          <Route path="/restaurant/:resId" element={<RestaurantDetailView />} />
          <Route path="/cart" element={<CartView />} />
          <Route path="/profile" element={<Profile/>} />
          <Route path="/orders" element={<OrderHistoryView/>} />
          <Route path="/checkout" element={<CartCheckoutView />} />
          <Route path="/check" element={<CartCheckoutView />} />
          <Route path="/payment-vnpay" element={<PaymentVNPay />} />



        </Route>

        {/* RESTAURANT SECTION */}
        <Route path="/restaurant" element={<RestaurantLayout />}>
          <Route index element={<RestaurantHome />} /> 
          <Route path="info" element={<ResInfoPage />} />
          <Route path="orders" element={<RestaurantOrdersPage />} />
          <Route path="stats" element={<RestaurantStatsPage />} />
          <Route path="menu-management" element={<ManageMenuPage />} />
          <Route path="add-food" element={<AddMenuItemForm />} />
          <Route path="edit-food/:id" element={<AddMenuItemForm />} />
          <Route path="reviews" element={<ResReviewsPage />} />
          <Route path="profile" element={<Profile />} />
        </Route>

        {/* ADMIN SECTION */}
        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<AdminHome />} /> 
          <Route path="reports" element={<ManageAnalyticsPage />} />
          <Route path="approve-res" element={<ApproveResPage />} />    
          <Route path="manage-res" element={<ManageResPage />} />
          <Route path="manage-shippers" element={<ManageShipperPage />} />
          <Route path="manage-vouchers" element={<ManageVoucherPage />} />
          <Route path="shipping-config" element={<ShippingConfigPage />} />
          <Route path="profile" element={<Profile />} />
         

        </Route>

        {/* Catch-all route */}
        <Route path="*" element={<Navigate to="/" />} />  
      </Routes>
    </Router>
  );
}

export default App;