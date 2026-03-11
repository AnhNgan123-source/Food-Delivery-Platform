# TÀI LIỆU API

# FOOD DELIVERY PLATFORM

---

# 1. Giới thiệu hệ thống

Hệ thống **Food Delivery Platform** cho phép khách hàng tìm kiếm nhà hàng, đặt món ăn và nhận hàng thông qua dịch vụ giao hàng của nhà hàng.

Hệ thống có **3 vai trò người dùng chính**:

### 1. Khách hàng (Customer)

Khách hàng sử dụng hệ thống để:

* Tìm nhà hàng và xem menu
* Thêm món vào giỏ hàng và đặt hàng
* Thanh toán online
* Theo dõi trạng thái đơn hàng theo thời gian thực
* Đánh giá nhà hàng sau khi nhận món
* Xem lịch sử đơn hàng

---

### 2. Nhà hàng (Restaurant)

Nhà hàng sử dụng hệ thống để:

* Quản lý menu (thêm / sửa / xóa món ăn)
* Bật hoặc tắt trạng thái món ăn (hết hàng / còn bán)
* Nhận và xác nhận đơn hàng mới
* Cập nhật trạng thái đơn hàng (đang nấu, chuẩn bị giao...)
* Xem thống kê doanh thu
* Quản lý thông tin nhà hàng

---

### 3. Quản trị viên (Admin)

Admin quản lý toàn bộ hệ thống:

* Duyệt nhà hàng mới đăng ký
* Quản lý nhà hàng (CRUD)
* Quản lý shipper
* Quản lý voucher
* Cấu hình phí giao hàng
* Xem báo cáo toàn hệ thống

---

# 2. Địa chỉ API (Base URL)

```
/api/v1
```

Ví dụ:

```
http://localhost:8080/api/v1/restaurants
```

---

# 3. Xác thực người dùng (Authentication)

Tất cả người dùng đều phải đăng nhập để sử dụng hệ thống.

Hệ thống sử dụng **JWT Token** để xác thực.

Header trong request:

```
Authorization: Bearer <JWT_TOKEN>
```

---

# 4. Cấu trúc cơ sở dữ liệu

## 4.1 Bảng Người Dùng (User)

Lưu thông tin tất cả tài khoản trong hệ thống.

| Trường     | Kiểu dữ liệu | Mô tả                                  |
| ---------- | ------------ | -------------------------------------- |
| user_id    | INT          | ID người dùng                          |
| username   | VARCHAR      | Tên đăng nhập                          |
| password   | VARCHAR      | Mật khẩu đã mã hóa                     |
| email      | VARCHAR      | Email người dùng                       |
| role       | ENUM         | Vai trò: ADMIN / CUSTOMER / RESTAURANT |
| full_name  | VARCHAR      | Họ tên                                 |
| phone      | VARCHAR      | Số điện thoại                          |
| address    | TEXT         | Địa chỉ                                |
| is_active  | TINYINT      | Trạng thái tài khoản                   |
| created_at | TIMESTAMP    | Thời gian tạo                          |
| updated_at | TIMESTAMP    | Thời gian cập nhật                     |

---

## 4.2 Bảng Nhà Hàng (Restaurant)

Lưu thông tin nhà hàng.

| Trường      | Kiểu dữ liệu | Mô tả                    |
| ----------- | ------------ | ------------------------ |
| res_id      | INT          | ID nhà hàng              |
| owner_id    | INT          | Chủ nhà hàng             |
| res_name    | VARCHAR      | Tên nhà hàng             |
| res_address | TEXT         | Địa chỉ                  |
| res_image   | VARCHAR      | Ảnh nhà hàng             |
| rating_avg  | DECIMAL      | Điểm đánh giá trung bình |
| is_active   | TINYINT      | Trạng thái hoạt động     |

---

## 4.3 Bảng Danh Mục (Category)

Phân loại món ăn.

| Trường   | Kiểu dữ liệu | Mô tả        |
| -------- | ------------ | ------------ |
| cat_id   | INT          | ID danh mục  |
| cat_name | VARCHAR      | Tên danh mục |

---

## 4.4 Bảng Món Ăn (Menu_Item)

Danh sách món ăn của nhà hàng.

| Trường       | Kiểu dữ liệu | Mô tả          |
| ------------ | ------------ | -------------- |
| item_id      | INT          | ID món         |
| res_id       | INT          | Nhà hàng       |
| cat_id       | INT          | Danh mục       |
| item_name    | VARCHAR      | Tên món        |
| price        | DECIMAL      | Giá            |
| description  | TEXT         | Mô tả          |
| item_image   | VARCHAR      | Ảnh món        |
| is_available | TINYINT      | Trạng thái bán |

---

## 4.5 Bảng Giỏ Hàng (Cart)

Lưu món khách đang chọn.

| Trường      | Mô tả      |
| ----------- | ---------- |
| cart_id     | ID giỏ     |
| customer_id | Khách hàng |
| item_id     | Món        |
| quantity    | Số lượng   |

---

## 4.6 Bảng Đơn Hàng (Orders)

Lưu thông tin đơn hàng.

| Trường           | Mô tả                  |
| ---------------- | ---------------------- |
| order_id         | ID đơn                 |
| customer_id      | Khách đặt              |
| res_id           | Nhà hàng               |
| shipper_id       | Người giao             |
| voucher_id       | Voucher áp dụng        |
| subtotal         | Tổng tiền món          |
| shipping_fee     | Phí giao               |
| total_discount   | Số tiền giảm           |
| final_amount     | Tổng tiền thanh toán   |
| order_status     | Trạng thái đơn         |
| payment_method   | Phương thức thanh toán |
| delivery_address | Địa chỉ giao           |
| note             | Ghi chú                |

---

## 4.7 Bảng Chi Tiết Đơn Hàng (Order_Item)

Danh sách món trong đơn.

| Trường         | Mô tả                 |
| -------------- | --------------------- |
| order_item_id  | ID                    |
| order_id       | Đơn hàng              |
| item_id        | Món                   |
| quantity       | Số lượng              |
| price_at_order | Giá tại thời điểm đặt |

---

## 4.8 Bảng Voucher

| Trường          | Mô tả                 |
| --------------- | --------------------- |
| voucher_id      | ID                    |
| code            | Mã giảm giá           |
| discount_type   | Loại giảm             |
| discount_value  | Giá trị giảm          |
| min_order_value | Giá trị đơn tối thiểu |
| usage_limit     | Số lần dùng tối đa    |

---

## 4.9 Bảng Đánh Giá (Review)

| Trường      | Mô tả          |
| ----------- | -------------- |
| review_id   | ID             |
| order_id    | Đơn hàng       |
| customer_id | Người đánh giá |
| res_id      | Nhà hàng       |
| rating      | Điểm           |
| comment     | Nhận xét       |

---

# 5. Dữ liệu mẫu trong cơ sở dữ liệu

## Người dùng

```sql
INSERT INTO User(username,password,email,role,full_name,phone,address)
VALUES
('admin','123456','admin@gmail.com','ADMIN','Quản trị hệ thống','0900000000','TP Hồ Chí Minh'),
('vynguyen','123456','vy@gmail.com','CUSTOMER','Vy Nguyễn','0911111111','Quận 1'),
('pizza_owner','123456','pizza@gmail.com','RESTAURANT','Chủ Pizza House','0922222222','Quận 3');
```

---

## Nhà hàng

```sql
INSERT INTO Restaurant(owner_id,res_name,res_address,res_image,rating_avg,is_active)
VALUES
(3,'Pizza House','Quận 1','pizza.jpg',4.5,1);
```

---

## Danh mục

```sql
INSERT INTO Category(cat_name)
VALUES
('Pizza'),
('Burger'),
('Đồ uống');
```

---

## Món ăn

```sql
INSERT INTO Menu_Item(res_id,cat_id,item_name,price,description,item_image,is_available)
VALUES
(1,1,'Pizza hải sản',150000,'Pizza hải sản phô mai','pizza1.jpg',1),
(1,2,'Burger bò',80000,'Burger bò phô mai','burger1.jpg',1),
(1,3,'Coca Cola',20000,'Nước ngọt Coca','coca.jpg',1);
```

---

## Voucher

```sql
INSERT INTO Voucher(code,description,discount_type,discount_value,min_order_value)
VALUES
('GIAM10K','Giảm 10.000đ cho đơn từ 100.000đ','fixed_amount',10000,100000);
```

---

# 6. API Xác Thực

## Đăng ký

```
POST /auth/register
```

Request

```json
{
"username":"vynguyen",
"password":"123456",
"email":"vy@gmail.com",
"role":"CUSTOMER",
"full_name":"Vy Nguyễn",
"phone":"0911111111",
"address":"Quận 1"
}
```

---

## Đăng nhập

```
POST /auth/login
```

Request

```json
{
"username":"vynguyen",
"password":"123456"
}
```

Response

```json
{
"token":"jwt_token",
"role":"CUSTOMER"
}
```

---

# 7. API cho Khách Hàng

## Tìm nhà hàng

```
GET /restaurants
```

---

## Xem menu nhà hàng

```
GET /restaurants/{res_id}
```

---

## Thêm món vào giỏ

```
POST /cart
```

---

## Xem giỏ hàng

```
GET /cart
```

---

## Tạo đơn hàng

```
POST /orders
```

---

## Thanh toán online

```
POST /payment
```

---

## Theo dõi đơn hàng

```
GET /orders/{order_id}
```

---

## Xem lịch sử đơn hàng

```
GET /orders/history
```

---

## Đánh giá nhà hàng

```
POST /reviews
```

---

# 8. API cho Nhà Hàng

## Quản lý menu

```
POST /restaurant/menu
PUT /restaurant/menu/{item_id}
DELETE /restaurant/menu/{item_id}
```

---

## Bật / tắt món

```
PUT /restaurant/menu/{item_id}/toggle
```

---

## Nhận đơn hàng mới

```
GET /restaurant/orders/new
```

---

## Xác nhận đơn

```
PUT /restaurant/orders/{order_id}/confirm
```

---

## Cập nhật trạng thái đơn

```
PUT /restaurant/orders/{order_id}/status
```

---

## Thống kê doanh thu

```
GET /restaurant/revenue
```

---

## Cập nhật thông tin nhà hàng

```
PUT /restaurant/info
```

---

# 9. API cho Admin

## Duyệt nhà hàng mới

```
PUT /admin/restaurants/{res_id}/approve
```

---

## Quản lý nhà hàng

```
GET /admin/restaurants
POST /admin/restaurants
PUT /admin/restaurants/{res_id}
DELETE /admin/restaurants/{res_id}
```

---

## Quản lý shipper

```
GET /admin/shippers
POST /admin/shippers
PUT /admin/shippers/{shipper_id}
DELETE /admin/shippers/{shipper_id}
```

---

## Quản lý voucher

```
GET /admin/vouchers
POST /admin/vouchers
DELETE /admin/vouchers/{voucher_id}
```

---

## Cấu hình phí giao hàng

```
PUT /admin/shipping-fee
```

---

## Báo cáo toàn hệ thống

```
GET /admin/reports
```

---

# 10. Luồng trạng thái đơn hàng

Trạng thái đơn hàng trong hệ thống:

```
PENDING
↓
CONFIRMED
↓
PREPARING
↓
SHIPPING
↓
COMPLETED
```

Ý nghĩa:

| Trạng thái | Mô tả                |
| ---------- | -------------------- |
| PENDING    | Khách vừa đặt        |
| CONFIRMED  | Nhà hàng đã xác nhận |
| PREPARING  | Nhà hàng đang nấu    |
| SHIPPING   | Shipper đang giao    |
| COMPLETED  | Đã giao thành công   |

Nếu khách hủy:

```
CANCELLED
```

---

# 11. Cấu trúc phản hồi API

## Thành công

```json
{
"status":"success",
"data":{}
}
```

---

## Lỗi

```json
{
"status":"error",
"message":"Yêu cầu không hợp lệ"
}
```

---




