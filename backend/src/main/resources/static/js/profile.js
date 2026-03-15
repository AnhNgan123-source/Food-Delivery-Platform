async function fetchProfileData() {
    const token = localStorage.getItem('token');
    if (!token) return;

    try {
        const response = await fetch('http://localhost:8080/api/user/profile', {
            headers: { 'Authorization': 'Bearer ' + token }
        });

        if (response.ok) {
            const user = await response.json();
            
            // Đổ dữ liệu vào HTML
            document.getElementById('view-fullname').innerText = user.full_name || 'Người dùng Yummy';
            document.getElementById('view-username').innerText = user.username;
            document.getElementById('view-email').innerText = user.email;
            document.getElementById('view-phone').innerText = user.phone || 'Chưa cập nhật';
            document.getElementById('view-address').innerText = user.address || 'Chưa cập nhật';
            document.getElementById('view-role-badge').innerText = user.role;
            
            // Tạo avatar từ chữ cái đầu của tên
            const name = user.full_name || user.username;
            document.getElementById('user-avatar').innerText = name.charAt(0).toUpperCase();
        }
    } catch (error) {
        console.error("Lỗi lấy dữ liệu:", error);
    }
}