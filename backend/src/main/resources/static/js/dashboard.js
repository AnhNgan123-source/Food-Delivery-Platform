window.onload = () => {
    const token = localStorage.getItem('token');
    const role = localStorage.getItem('role');

    // Chặn người chưa đăng nhập hoặc sai quyền (Ví dụ trang Admin)
    if (!token || role !== 'ADMIN') {
        alert("Bạn không có quyền truy cập!");
        window.location.href = "index.html";
    }
};

// Hàm load nội dung động từ thư mục fragments
async function loadFragment(fileName) {
    const area = document.getElementById('content-area');
    area.innerHTML = '<div class="loader">Đang tải...</div>';
    
    try {
        const response = await fetch(`fragments/${fileName}.html`);
        const html = await response.text();
        area.innerHTML = html;
        
        // Cập nhật trạng thái menu bên trái
        document.querySelectorAll('.sidebar li').forEach(li => li.classList.remove('active'));
        event.currentTarget.classList.add('active');
    } catch (err) {
        area.innerHTML = "❌ Không thể tải nội dung chức năng này.";
    }
}

function handleLogout() {
    localStorage.clear();
    window.location.href = "index.html";
}