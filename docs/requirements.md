# PHÂN TÍCH YÊU CẦU (REQUIREMENTS)
**Dự án:** Food Delivery Platform - Nhóm 8

---

## 1. Bối cảnh và Mục tiêu 
* **Bối cảnh:**  Các nhà hàng nhỏ muốn bán online nhưng phí hoa hồng của GrabFood/ShopeeFood quá cao (25-30%) 
* **Mục tiêu:** Xây dựng một nền tảng riêng giúp nhà hàng tối ưu lợi nhuận, cho phép khách hàng tìm kiếm, đặt món và theo dõi đơn hàng thời gian thực.

## 2. Đối tượng sử dụng
Hệ thống bao gồm 3 phân hệ chính theo yêu cầu:
1. **Khách hàng (End User):** Tìm nhà hàng, đặt hàng, thanh toán, theo dõi
2. **Nhà hàng (Business User):**  Quản lý menu, nhận đơn, cập nhật trạng thái
3. **Quản trị viên (Admin):** Duyệt nhà hàng, quản lý shipper/voucher, báo cáo

## 3. Tính năng chính

### 3.1. Phân hệ Khách hàng (6 tính năng)
* **Tìm kiếm:** Tra cứu nhà hàng theo vị trí và loại món ăn.
* **Đặt hàng:** Thêm món vào giỏ hàng và thực hiện thanh toán.
* **Thanh toán online:** Tích hợp ví điện tử.
* **Theo dõi đơn hàng:** Xem trạng thái giao hàng theo thời gian thực (Real-time).
* **Đánh giá:** Gửi phản hồi và số sao cho nhà hàng sau khi nhận món.
* **Lịch sử:** Xem danh sách các đơn hàng đã thực hiện.

### 3.2. Phân hệ Nhà hàng (6 tính năng)
* **Quản lý Menu:** Thêm, sửa, xóa món ăn (CRUD).
* **Trạng thái món:** Bật/tắt món ăn tùy theo tình trạng kho hàng.
* **Nhận đơn:** Tiếp nhận và xác nhận đơn hàng mới từ khách.
* **Cập nhật tiến độ:** Chuyển trạng thái đơn (Đang nấu, Sẵn sàng).
* **Thống kê:** Xem báo cáo doanh thu theo ngày/tháng.
* **Thông tin:** Cập nhật hồ sơ, địa chỉ và giờ mở cửa.

### 3.3. Phân hệ Admin (6 tính năng)
* **Duyệt đối tác:** Kiểm duyệt các nhà hàng mới đăng ký.
* **Quản lý nhà hàng:** Quản lý danh sách và tài khoản nhà hàng (CRUD).
* **Quản lý Shipper:** Theo dõi và phân công đội ngũ giao hàng.
* **Quản lý Voucher:** Tạo và cấu hình các mã giảm giá.
* **Cấu hình phí:** Thiết lập phí vận chuyển theo khu vực.
* **Báo cáo tổng:** Xem Dashboard tăng trưởng của toàn hệ thống.

## 4. Công nghệ sử dụng
* **Frontend:** ReactJS cho giao diện người dùng.
* **Backend:** Java 17+ kết hợp framework Spring Boot.
* **Database:** Sử dụng MySQL để lưu trữ (thiết kế từ 6-10 bảng).
* **Security:** Spring Security (Đăng nhập/ Đăng xuất, Phân quyền người dùng).
* **Real-time:** Sử dụng WebSocket để cập nhật trạng thái đơn hàng.
