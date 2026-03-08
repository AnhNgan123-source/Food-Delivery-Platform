# DATABASE NAME: food_delivery_platform_db

## -- 1. Bảng User: Lưu trữ tất cả tài khoản (Admin, Khách, Chủ quán, Shipper)
    CREATE TABLE User (
    user_id     INT PRIMARY KEY AUTO_INCREMENT, -- Khóa chính tự tăng
    username    VARCHAR(50) UNIQUE NOT NULL,    -- Tên đăng nhập (không được trùng)
    password    VARCHAR(255) NOT NULL,          -- Mật khẩu (đã mã hóa)
    email       VARCHAR(100) UNIQUE NOT NULL,   -- Email liên lạc và khôi phục
    role        ENUM('ADMIN', 'CUSTOMER', 'RESTAURANT') NOT NULL, -- Phân quyền người dùng
    full_name   VARCHAR(100),                   -- Họ tên đầy đủ
    phone       VARCHAR(15),                    -- Số điện thoại liên lạc
    address     TEXT,                           -- Địa chỉ mặc định
    is_active   TINYINT DEFAULT 1,           -- Trạng thái tài khoản (1: Hoạt động, 0: Khóa)
    created_at  TIMESTAMP DEFAULT CURRENT_TIMESTAMP, -- Thời điểm tạo tài khoản
    updated_at  TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP -- Tự cập nhật khi sửa thông tin
    ) ENGINE=InnoDB;

## -- 2. Bảng Shipper: Do Nhà hàng quản lý 
    CREATE TABLE Shipper (
    shipper_id  INT PRIMARY KEY AUTO_INCREMENT,
    res_id      INT NOT NULL,          -- Shipper này thuộc nhà hàng nào
    shipper_name VARCHAR(100) NOT NULL, -- Tên tài xế
    phone       VARCHAR(15) NOT NULL,  -- Số điện thoại để khách gọi
    vehicle_no  VARCHAR(20),           -- Biển số xe
    status      ENUM('IDLE', 'BUSY') DEFAULT 'IDLE', -- Trạng thái đang rảnh hay đang giao
    CONSTRAINT fk_shipper_res FOREIGN KEY (res_id) REFERENCES Restaurant(res_id) ON DELETE CASCADE
    ) ENGINE=InnoDB;

## -- 3. Bảng Restaurant: Thông tin cửa hàng
    CREATE TABLE Restaurant (
    res_id      INT PRIMARY KEY AUTO_INCREMENT,
    owner_id    INT NOT NULL,                   -- ID của chủ quán (phải là User có role RESTAURANT)
    res_name    VARCHAR(100) NOT NULL,          -- Tên quán ăn
    res_address TEXT NOT NULL,                  -- Địa chỉ quán
    res_image   VARCHAR(255),                   -- Ảnh bìa/Logo quán
    rating_avg  DECIMAL(2, 1) DEFAULT 0.0,      -- Điểm đánh giá trung bình (ví dụ 4.5)
    is_active   TINYINT DEFAULT 0,           -- Chờ Admin duyệt (1: Đang bán, 0: Tạm ẩn)
    CONSTRAINT fk_res_owner FOREIGN KEY (owner_id) REFERENCES User(user_id) ON DELETE CASCADE
    ) ENGINE=InnoDB;

## -- 4. Bảng Category: Danh mục 
    CREATE TABLE Category (
    cat_id      INT PRIMARY KEY AUTO_INCREMENT,
    cat_name    VARCHAR(50) NOT NULL UNIQUE     -- Tên danh mục không được trùng
    ) ENGINE=InnoDB;

## -- 5. Bảng Menu_Item: Danh sách các món ăn của từng quán
    CREATE TABLE Menu_Item (
    item_id      INT PRIMARY KEY AUTO_INCREMENT,
    res_id       INT NOT NULL,                  -- Món này thuộc quán nào
    cat_id       INT NOT NULL,                  -- Món này thuộc danh mục nào
    item_name    VARCHAR(100) NOT NULL,         -- Tên món ăn
    price        DECIMAL(10, 2) NOT NULL CHECK (price > 0), -- Giá bán (phải lớn hơn 0)
    description  TEXT,                          -- Thành phần, mô tả món
    item_image   VARCHAR(255),                  -- Hình ảnh món ăn
    is_available TINYINT DEFAULT 1,          -- Trạng thái (1: Còn món, 0: Hết món)
    CONSTRAINT fk_menu_res FOREIGN KEY (res_id) REFERENCES Restaurant(res_id) ON DELETE CASCADE,
    CONSTRAINT fk_menu_cat FOREIGN KEY (cat_id) REFERENCES Category(cat_id)
    ) ENGINE=InnoDB;

## -- 6. Bảng Voucher: Mã giảm giá toàn hệ thống
    CREATE TABLE Voucher (
    voucher_id          INT PRIMARY KEY AUTO_INCREMENT,
    code                VARCHAR(50) UNIQUE NOT NULL, -- Mã code (ví dụ: 'GIAM10K')
    description         TEXT,                        -- Mô tả (Giảm 10% tối đa 70k...)
    discount_type       ENUM('percentage', 'fixed_amount') NOT NULL, -- Loại giảm (% hoặc số tiền cố định)
    discount_value      DECIMAL(10, 2) NOT NULL,     -- Giá trị giảm (10 cho 10%)
    max_discount_amount DECIMAL(10, 2),              -- Mức giảm trần (ví dụ: 70,000đ)
    min_order_value     DECIMAL(10, 2) DEFAULT 0,    -- Điều kiện đơn tối thiểu (ví dụ: 250,000đ)
    start_date          DATETIME,                    -- Ngày bắt đầu áp dụng
    end_date            DATETIME,                    -- Ngày hết hạn
    usage_limit         INT DEFAULT 100,             -- Tổng lượt sử dụng tối đa
    used_count          INT DEFAULT 0,               -- Số lượt đã dùng thực tế
    is_active           TINYINT DEFAULT 1,        -- Trạng thái voucher
    created_at          TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    ) ENGINE=InnoDB;

## -- 7. Bảng Orders: Quản lý giao dịch đặt hàng
    CREATE TABLE Orders (
    order_id         INT PRIMARY KEY AUTO_INCREMENT,
    customer_id      INT NOT NULL,              -- Ai đặt?
    res_id           INT NOT NULL,              -- Đặt ở quán nào?
    shipper_id       INT,                       -- Shipper nào nhận đơn?
    voucher_id       INT,                       -- Có dùng mã giảm giá nào không?
    subtotal         DECIMAL(10, 2) NOT NULL,   -- Tổng tiền món ăn (chưa ship, chưa giảm)
    shipping_fee     DECIMAL(10, 2) NOT NULL DEFAULT 0, -- Phí vận chuyển
    total_discount   DECIMAL(10, 2) DEFAULT 0,  -- Số tiền được giảm thực tế từ voucher
    final_amount     DECIMAL(10, 2) NOT NULL,   -- Tổng tiền thanh toán (Subtotal + Ship - Discount)
    order_status     ENUM('PENDING', 'CONFIRMED', 'PREPARING', 'SHIPPING', 'COMPLETED', 'CANCELLED') DEFAULT 'PENDING', -- Tiến độ đơn hàng
    payment_method   VARCHAR(50) DEFAULT 'CASH', -- Phương thức (CASH, MOMO, VNPAY)
    delivery_address TEXT NOT NULL,             -- Địa chỉ nhận hàng thực tế
    note             TEXT,                      -- Ghi chú (Ví dụ: Không ăn hành)
    created_at       TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_order_customer FOREIGN KEY (customer_id) REFERENCES User(user_id),
    CONSTRAINT fk_order_res FOREIGN KEY (res_id) REFERENCES Restaurant(res_id),
    CONSTRAINT fk_order_shipper FOREIGN KEY (shipper_id) REFERENCES Shipper(shipper_id),
    CONSTRAINT fk_order_voucher FOREIGN KEY (voucher_id) REFERENCES Voucher(voucher_id)
    ) ENGINE=InnoDB;

## -- 8. Bảng Order_Item: Lưu danh sách món khách đã đặt trong một đơn
    CREATE TABLE Order_Item (
    order_item_id    INT PRIMARY KEY AUTO_INCREMENT,
    order_id         INT NOT NULL,              -- Thuộc đơn hàng nào
    item_id          INT NOT NULL,              -- Món nào
    quantity         INT NOT NULL DEFAULT 1 CHECK (quantity > 0), -- Số lượng đặt
    price_at_order   DECIMAL(10, 2) NOT NULL,   -- Giá món tại thời điểm đặt (để đối soát nếu quán đổi giá sau này)
    CONSTRAINT fk_item_order FOREIGN KEY (order_id) REFERENCES Orders(order_id) ON DELETE CASCADE,
    CONSTRAINT fk_item_menu FOREIGN KEY (item_id) REFERENCES Menu_Item(item_id)
    ) ENGINE=InnoDB;

## -- 9. Bảng Cart: Lưu giỏ hàng tạm thời (Chưa thanh toán)
    CREATE TABLE Cart (
    cart_id     INT PRIMARY KEY AUTO_INCREMENT,
    customer_id INT NOT NULL,                   -- Giỏ hàng của ai?
    item_id     INT NOT NULL,                   -- Món đang chọn là món nào?
    quantity    INT DEFAULT 1 CHECK (quantity > 0),
    CONSTRAINT fk_cart_user FOREIGN KEY (customer_id) REFERENCES User(user_id) ON DELETE CASCADE,
    CONSTRAINT fk_cart_menu FOREIGN KEY (item_id) REFERENCES Menu_Item(item_id) ON DELETE CASCADE
    ) ENGINE=InnoDB;

## -- 10. Bảng Review: Đánh giá sau khi nhận hàng
    CREATE TABLE Review (
    review_id   INT PRIMARY KEY AUTO_INCREMENT,
    order_id    INT UNIQUE NOT NULL,            -- Đánh giá cho đơn hàng nào (mỗi đơn 1 lần đánh giá)
    customer_id INT NOT NULL,                   -- Người đánh giá
    res_id      INT NOT NULL,                   -- Đánh giá cho quán nào
    rating      TINYINT CHECK (rating BETWEEN 1 AND 5), -- Điểm từ 1 đến 5 sao
    comment     TEXT,                           -- Nhận xét chi tiết
    created_at  TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_rev_order FOREIGN KEY (order_id) REFERENCES Orders(order_id),
    CONSTRAINT fk_rev_user FOREIGN KEY (customer_id) REFERENCES User(user_id),
    CONSTRAINT fk_rev_res FOREIGN KEY (res_id) REFERENCES Restaurant(res_id)
    ) ENGINE=InnoDB;
# SƠ ĐỒ ERD DIAGRAM
<img width="738" height="1246" alt="ERD Diagram" src="https://github.com/user-attachments/assets/035a5e74-97bd-40b5-a506-8b7f1ddea0de" />


