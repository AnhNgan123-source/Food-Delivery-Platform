# FOOD DELIVERY PLATFORM
## Mô tả
### Food Delivery Platform là nền tảng kết nối trực tiếp giữa thực khách và các nhà hàng nhỏ, giúp nhà hàng tối ưu hóa lợi nhuận bằng cách bán hàng trực tuyến mà không phải chịu phí hoa hồng cao (25-30%) từ các ứng dụng giao đồ ăn lớn.
### Hệ thống cung cấp giải pháp toàn diện cho phép khách hàng tìm kiếm, đặt món, thanh toán và theo dõi đơn hàng theo thời gian thực; đồng thời hỗ trợ nhà hàng quản lý thực đơn và quy trình xử lý đơn hàng một cách chuyên nghiệp.
## Thành viên nhóm
| MSSV | Họ tên | Vai trò |
|------|--------|---------|
| 2254050038| Nguyễn Thị Thảo Ngân | Trưởng nhóm |
| 2254050085| Nguyễn Như Vy | Thành viên |
## Phân hệ và tính năng chính 
Hệ thống được thiết kế 3 phân hệ chính, tổng cộng 18 tính năng
### Phân hệ Khách hàng (End User)   
* Tìm kiếm nhà hàng và xem thực đơn chi tiết.  
* Quản lý giỏ hàng và đặt hàng trực tuyến.  
* Thanh toán đơn hàng qua cổng trực tuyến.  
* Theo dõi trạng thái đơn hàng thời gian thực.  
* Đánh giá chất lượng món ăn và dịch vụ của nhà hàng.  
* Xem lại lịch sử các đơn hàng đã đặt.
  
### Phân hệ Nhà hàng (Business User)   
* Quản lý thông tin và hồ sơ nhà hàng.  
* Quản lý thực đơn (CRUD món ăn, giá cả, hình ảnh).  
* Bật/tắt trạng thái hết hàng cho từng món ăn.  
* Tiếp nhận và xác nhận các đơn hàng mới.  
* Cập nhật trạng thái chế biến (Đang nấu, Sẵn sàng giao).  
* Theo dõi báo cáo và thống kê doanh thu.
* 
### Phân hệ Quản trị viên (Admin)   
* Kiểm duyệt và quản lý danh sách nhà hàng mới đăng ký.  
* Quản lý đội ngũ Shipper (Giao hàng).  
* Quản lý các chương trình khuyến mãi và Voucher.  
* Cấu hình phí vận chuyển theo khu vực.  
* Xem báo cáo tổng quan toàn hệ thống.
* 
## Công nghệ sử dụng
- Backend: Spring Boot
- Frontend: React / Thymeleaf
- Database: PostgreSQL
- Real-time: WebSocket (để theo dõi đơn hàng)
- Mock VNPAY: Thanh toán trực tuyến
## Cài đặt và chạy

### Yêu cầu
- Java 17+
- Node.js 18+
- PostgreSQL

### Chạy Backend
cd backend
./mvnw spring-boot:run

### Chạy Frontend (nếu dùng React)
cd frontend
npm install
npm start

### Truy cập
- Frontend: http://localhost:5173
- Backend API: http://localhost:8080
## Demo
### 1. PHÂN HỆ KHÁCH HÀNG
<img width="924" height="529" alt="image" src="https://github.com/user-attachments/assets/c3d05db6-d920-4167-a765-b5f54372449e" />

#### 1.1 Giao diện xem nhà hàng
<img width="915" height="532" alt="image" src="https://github.com/user-attachments/assets/c74920dd-48c6-43b2-b220-3c679dd09dd3" />

#### 1.2 Giao diện giỏ hàng
<img width="926" height="531" alt="image" src="https://github.com/user-attachments/assets/6fbe7c7d-1c29-43d0-b077-5ffd52023a6e" />

#### 1.3 Giao diện đặt hàng
<img width="916" height="533" alt="image" src="https://github.com/user-attachments/assets/50d36f11-1d12-40e6-9ff3-61f3449b9bde" />

#### 1.4 Giao diện thanh toán VNPay
<img width="925" height="528" alt="image" src="https://github.com/user-attachments/assets/4d58218a-8427-40ae-93a2-18b77292d26b" />

#### 1.5 Giao diện theo dõi đơn hàng real-time
<img width="924" height="519" alt="image" src="https://github.com/user-attachments/assets/c8e878b0-5811-4823-80c4-c16f6cfc9c23" />

#### 1.6 Giao diện xem lịch sử đơn hàng
<img width="914" height="527" alt="image" src="https://github.com/user-attachments/assets/e70287c6-9345-4964-9d0e-0acc939ba478" />

#### 1.7 Giao diện xem hồ sơ cá nhân
<img width="925" height="529" alt="image" src="https://github.com/user-attachments/assets/cbaf3aa6-1450-4a42-98de-b8b95c1f3e99" />


### 2. PHÂN HỆ NHÀ HÀNG
<img width="926" height="530" alt="image" src="https://github.com/user-attachments/assets/637d440f-8b2d-4558-b67b-b55f4d45449f" />

#### 2.1 Giao diện quản lý thực đơn
<img width="914" height="527" alt="image" src="https://github.com/user-attachments/assets/a9d30d8f-b167-429e-b2ef-a3030f421b76" />

#### 2.2 Giao diện đơn hàng
<img width="926" height="533" alt="image" src="https://github.com/user-attachments/assets/f3d52e46-01e0-4309-9b9b-7259764b741a" />

#### 2.3 Giao diện thống kê doanh thu
<img width="917" height="529" alt="image" src="https://github.com/user-attachments/assets/18ee8fa7-73cb-487a-9982-7af76c120aec" />

#### 2.4 Giao diện đánh giá khách hàng
<img width="919" height="499" alt="image" src="https://github.com/user-attachments/assets/9f56567f-271e-4e70-8eef-d73f46c2f89b" />

#### 2.5 Giao diện thông tin nhà hàng
<img width="927" height="535" alt="image" src="https://github.com/user-attachments/assets/880a8d67-8e7c-4d09-8999-9c98ad5b1110" />

#### 2.6 Giao diện xem hồ sơ cá nhân
<img width="930" height="526" alt="image" src="https://github.com/user-attachments/assets/d05c3ff7-ec22-4201-a777-1c5790e61563" />


### 3. PHÂN HỆ QUẢN TRỊ VIÊN
<img width="928" height="531" alt="image" src="https://github.com/user-attachments/assets/ad423364-58a9-4c69-9123-490505748663" />

#### 3.1 Giao diện báo cáo hệ thống
<img width="927" height="526" alt="image" src="https://github.com/user-attachments/assets/8865a0bc-dcca-43e5-b9c8-baef083e2421" />

#### 3.2 Giao diện duyệt nhà hàng
<img width="929" height="531" alt="image" src="https://github.com/user-attachments/assets/ca326248-2db4-4bac-8fb9-b1b466526568" />

#### 3.3 Giao diện quản lý nhà hàng
<img width="926" height="529" alt="image" src="https://github.com/user-attachments/assets/695740bd-5e16-46a6-a077-bc1e108f5053" />

#### 3.4 Giao diện quản lý shipper
<img width="931" height="530" alt="image" src="https://github.com/user-attachments/assets/515a741d-e539-447f-b7a5-3ac1646847ad" />

#### 3.5 Giao diện quản lý voucher
<img width="917" height="528" alt="image" src="https://github.com/user-attachments/assets/d573ea0e-3af4-4484-810e-2d28043f98c1" />

#### 3.6 Giao diện cấu hình phí ship
<img width="934" height="525" alt="image" src="https://github.com/user-attachments/assets/23f13105-7198-48dc-8712-58de29f6b24f" />

#### 3.7 Giao diện xem hồ sơ cá nhân
<img width="929" height="527" alt="image" src="https://github.com/user-attachments/assets/83413221-d5fe-4168-bb96-7ca6112ded6a" />

## Tài liệu
- [Phân tích yêu cầu](docs/requirements.md)
- [Database Design](docs/database-design.md)
- [API Documentation](docs/api-docs.md)
