# TÀI LIỆU API - FOOD DELIVERY PLATFORM

---

# 1. Giới thiệu hệ thống
Hệ thống cung cấp nền tảng kết nối giữa Khách hàng, Nhà hàng và Admin.
- **Base URL:** `http://localhost:8080/api/v1`
- **Xác thực:** JWT Token đính kèm trong Header: `Authorization: Bearer <JWT_TOKEN>`

---

# 2. API Xác Thực (Auth)
Dựa trên `authApi.js`.

| Chức năng | Method | Endpoint | Mô tả |
| :--- | :--- | :--- | :--- |
| Đăng nhập | POST | `/auth/login` | Trả về token, role và thông tin định danh |
| Đăng ký | POST | `/auth/register` | Tạo tài khoản người dùng mới |

---

# 3. API cho Khách Hàng (Customer)
Dựa trên `customerApi.js` và `userApi.js`.

### 3.1. Nhà hàng & Thực đơn
- **Lấy danh sách nhà hàng:** `GET /restaurants`
- **Xem menu nhà hàng:** `GET /restaurants/{resId}`
- **Tìm kiếm:** `GET /search?q={keyword}`

### 3.2. Giỏ hàng & Đặt hàng
- **Tạo đơn hàng:** `POST /orders` (Sử dụng `OrderRequest` DTO)
- **Lịch sử đơn hàng:** `GET /orders/history?customerId={id}`
- **Chi tiết đơn hàng:** `GET /orders/{id}`
- **Hủy đơn hàng:** `PUT /orders/{id}/cancel?reason={text}`

### 3.3. Thanh toán & Ưu đãi
- **Xác nhận thanh toán:** `PUT /orders/{id}/pay`
- **Lấy voucher khả dụng:** `GET /admin/vouchers/available?cartValue={val}&userId={id}`
- **Lấy cấu hình phí ship:** `GET /admin/shipping-config`

### 3.4. Đánh giá (Review)
- **Gửi đánh giá:** `POST /reviews`
- **Xem đánh giá nhà hàng:** `GET /reviews/restaurant/{resId}`
- **Xem điểm trung bình:** `GET /reviews/restaurant/{resId}/average`

---

# 4. API cho Nhà Hàng (Merchant)
Dựa trên `restaurantApi.js`.

### 4.1. Quản lý thông tin & Menu
- **Lấy thông tin nhà hàng:** `GET /restaurant/owner/{ownerId}`
- **Cập nhật nhà hàng:** `PUT /restaurant/{resId}`
- **Upload ảnh nhà hàng:** `POST /restaurant/upload` (Multipart/form-data)
- **Lấy menu nhà hàng:** `GET /menu/restaurant/{resId}`
- **Thêm món ăn:** `POST /menu` (Multipart/form-data)
- **Cập nhật món ăn:** `PUT /menu/{itemId}`
- **Xóa món ăn:** `DELETE /menu/{itemId}`
- **Bật/Tắt trạng thái món:** `PUT /menu/{itemId}/toggle`

### 4.2. Quản lý Đơn hàng & Shipper
- **Danh sách đơn hàng:** `GET /orders/restaurant/{resId}`
- **Cập nhật trạng thái đơn:** `PUT /orders/{id}/status?status={STATUS}&shipperId={id}`
- **Lấy DS Shipper theo vùng:** `GET /orders/shippers-by-restaurant/{resId}`

### 4.3. Thống kê & Phản hồi
- **Thống kê doanh thu:** `GET /orders/restaurant/{resId}/stats`
- **Phản hồi đánh giá:** `PUT /reviews/{reviewId}/reply`

---

# 5. API cho Quản trị viên (Admin)
Dựa trên `adminApi.js`.

### 5.1. Quản lý Đối tác (Restaurant)
- **Danh sách tất cả:** `GET /admin/restaurants`
- **DS chờ duyệt:** `GET /admin/restaurants/pending`
- **Duyệt/Khóa nhà hàng:** `PUT /admin/restaurants/{id}` (Cập nhật field `isActive`)

### 5.2. Quản lý Vận chuyển & Voucher
- **Quản lý Shipper:** `GET/POST/PUT/DELETE` tại `/admin/shippers`
- **Cấu hình phí ship:** `POST /admin/shipping-config` (Cập nhật danh sách config)
- **Quản lý Voucher:** `GET/POST` tại `/admin/vouchers`
- **Dừng voucher:** `PUT /admin/vouchers/{id}/stop`

### 5.3. Thống kê toàn hệ thống
- **Tổng quan:** `GET /admin/stats/overview`
- **Lịch sử doanh thu:** `GET /admin/stats/revenue-history`
- **Top nhà hàng/shipper:** `GET /admin/stats/top-performers`

---

# 6. Quy trình trạng thái đơn hàng (Order Workflow)

| Trạng thái | Bên cập nhật | Ý nghĩa |
| :--- | :--- | :--- |
| **PENDING** | Customer | Đơn hàng mới khởi tạo |
| **CONFIRMED** | Restaurant | Nhà hàng chấp nhận đơn |
| **PREPARING** | Restaurant | Đang chế biến |
| **SHIPPING** | Restaurant | Đã bàn giao cho Shipper |
| **COMPLETED** | System/Customer | Giao hàng thành công |
| **CANCELLED** | Customer/Res | Đơn hàng bị hủy |

---

# 7. Cấu trúc phản hồi chuẩn (ResponseData DTO)

### Thành công và lỗi (Status 200/201)
```json
{
  "status": "success",
  "data": { ... }
}

{
"status":"error",
"message":"Yêu cầu không hợp lệ"
}
```

---




