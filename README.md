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
## Phân hệ Khách hàng (End User)   
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
- Node.js 18+ (nếu dùng React)
- PostgreSQL
- 
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

## Tài liệu
- [Phân tích yêu cầu](docs/requirements.md)
- [Database Design](docs/database-design.md)
- [API Documentation](docs/api-docs.md)
