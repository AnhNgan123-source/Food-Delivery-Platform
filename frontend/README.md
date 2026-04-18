src/
├── api/                             # QUẢN LÝ GIAO TIẾP VỚI BACKEND (SPRING BOOT)
│   ├── axiosConfig.js               # Cấu hình BASE_URL, Interceptors cho Token
│   ├── authApi.js                   # Gọi API /auth/login, /auth/register
│   ├── adminApi.js                  # Gọi API quản trị (duyệt quán, shipper)
│   └── restaurantApi.js             # Gọi API chủ quán (quản lý món, đơn hàng)
│
├── assets/                          # TÀI NGUYÊN TĨNH
│   ├── images/                      # Logo, banner, default-avatar.png
│   └── icons/                       # Các file SVG hoặc icon riêng
│
├── styles/                          # CSS TOÀN CỤC
│   ├── variables.css                # Định nghĩa màu sắc chủ đạo (--primary, --secondary)
│   └── global.css                   # Reset CSS, thiết lập Font chữ toàn app
│
├── components/                      # CÁC THÀNH PHẦN GIAO DIỆN (UI)
│   │
│   ├── layouts/                     # KHUNG XƯƠNG GIAO DIỆN (Sử dụng <Outlet />)
│   │   ├── AdminLayout/
│   │   │   ├── AdminLayout.jsx      # Chứa Sidebar + Header Admin
│   │   │   └── AdminLayout.module.css
│   │   ├── CustomerLayout/
│   │   │   ├── CustomerLayout.jsx   # Chứa Navbar + Footer cho khách
│   │   │   └── CustomerLayout.module.css
│   │   └── RestaurantLayout/
│   │       ├── RestaurantLayout.jsx # Sidebar riêng cho chủ quán
│   │       └── RestaurantLayout.module.css
│   │
│   ├── common/                      # UI DÙNG CHUNG Ở NHIỀU NƠI
│   │   ├── Profile/
│   │   │   ├── Profile.jsx
│   │   │   └── Profile.module.css
│   │   ├── Modals/
│   │   │   ├── BaseModal.jsx        # Khung Modal chung (Overlay + Content)
│   │   │   └── Modal.module.css
│   │   └── ProtectedRoute.jsx       # Logic chặn quyền truy cập (nếu chưa login)
│   │
│   ├── admin/                       # COMPONENT ĐẶC THÙ ADMIN
│   │   ├── Analytics/               # AdminAnalytics.jsx + .module.css
│   │   ├── RestaurantMgmt/          # ApproveRestaurant.jsx, ManageRestaurant.jsx
│   │   └── Shipping/                # ShippingConfig.jsx + .module.css
│   │
│   ├── restaurant/                  # COMPONENT ĐẶC THÙ CHỦ QUÁN
│   │   ├── Menu/                    # MenuList.jsx, MenuItemCard.jsx, AddMenuForm.jsx
│   │   ├── Order/                   # RestaurantOrders.jsx (Xử lý trạng thái đơn)
│   │   └── Stats/                   # RestaurantStats.jsx (Thống kê quán)
│   │
│   └── customer/                    # COMPONENT ĐẶC THÙ KHÁCH HÀNG
│       ├── Order/                   # OrderList.jsx, OrderCard.jsx (Xem lịch sử đơn)
│       └── Feedback/                # ReviewModal.jsx (Đánh giá món ăn)
|       └── Voucher/                 # ModalVoucher.jsx
│
├── pages/                           # CÁC TRANG ĐÍCH (Đại diện cho 1 Route)
│   ├── Auth/
│   │   ├── Auth.jsx                 # Trang Đăng nhập/Đăng ký tập trung
│   │   └── Auth.module.css
│   ├── AdminDashboard.jsx           # Trang tổng quan Admin
│   ├── RestaurantDashboard.jsx      # Trang tổng quan Chủ quán
│   └── HomePage.jsx                 # Trang chủ cho Khách hàng
│
├── utils/                           # CÁC HÀM TRỢ GIÚP (HELPER) === có thì đưa dô, hong thì thui===
│   ├── formatCurrency.js            # Hàm đổi số sang định dạng tiền Việt (đ)
│   └── formatDate.js                # Hàm xử lý thời gian từ Database
│
├── App.js                           # Cấu hình React Router (Routes)
└── index.js                         # Entry point khởi tạo App


Sử dụng CSS Modules cho những Layout lớn và cố định (như Admin/Customer Layout) để đảm bảo tính đóng gói, tránh xung đột CSS giữa các module.

Còn với những component như ApproveRestaurant, sẽ ưu tiên Inline Styles để tận dụng tính linh hoạt khi kế thừa style từ Props và xử lý nhanh các trạng thái hover/click thông qua JavaScript mà không cần tạo thêm nhiều file nhỏ lẻ.