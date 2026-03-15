// 1. KIỂM TRA QUYỀN TRUY CẬP KHI LOAD TRANG
window.onload = () => {
    const token = localStorage.getItem('token');
    const role = localStorage.getItem('role');
    const path = window.location.pathname;

    if (!token) {
        window.location.href = "index.html";
        return;
    }

    // Kiểm tra quyền truy cập (Admin/Restaurant)
    if (path.includes('admin.html') && role !== 'ADMIN') {
        alert("Bạn không có quyền truy cập vùng Admin!");
        window.location.href = "index.html";
    } else if (path.includes('restaurant.html') && role !== 'RESTAURANT') {
        alert("Bạn không có quyền truy cập vùng Nhà hàng!");
        window.location.href = "index.html";
    }

    // Hiển thị tên người dùng lên Header (nếu có lưu)
    const fullName = localStorage.getItem('full_name');
    const userDisplay = document.getElementById('user-display');
    if (fullName && userDisplay) {
        userDisplay.innerText = fullName;
    }

    // Mặc định load trang quản lý menu
    if (path.includes('restaurant.html')) {
        loadFragment('manage-menu'); 
    }
};

function loadFragment(name) {
    // 1. Kiểm tra xem cái hộp 'content-area' có tồn tại không
    const area = document.getElementById('content-area');
    
    if (!area) {
        console.error("Ngân ơi, kiểm tra lại ID! Trong HTML phải có id='content-area' nha.");
        return;
    }

    // 2. Gọi file fragment
    fetch(`fragments/${name}.html`)
        .then(response => {
            if (!response.ok) throw new Error("Không tìm thấy file .html");
            return response.text();
        })
        .then(html => {
            // 3. Đổ dữ liệu vào đúng ID 'content-area'
            area.innerHTML = html;

            // 4. Nếu là profile thì mới gọi hàm lấy dữ liệu
            if (name === 'profile') {
                if (typeof fetchProfileData === 'function') {
                    console.log("Đang lấy data cho Profile...");
                    fetchProfileData();
                } else {
                    console.error("Chưa tìm thấy hàm fetchProfileData. Ngân nhớ nhúng profile.js nhé!");
                }
            }
        })
        .catch(err => {
            console.error("Lỗi rồi:", err);
            area.innerHTML = "<p style='color:red'>⚠️ Lỗi tải trang!</p>";
        });
}
// 3. HÀM ĐĂNG XUẤT
function handleLogout() {
    if (confirm("Bạn có chắc chắn muốn đăng xuất?")) {
        localStorage.clear();
        window.location.href = "index.html";
    }
}