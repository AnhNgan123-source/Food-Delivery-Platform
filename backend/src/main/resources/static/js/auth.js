const BASE_URL = "http://localhost:8080/auth";

// Chuyển đổi qua lại Login/Register
function switchView(view) {
    document.getElementById('view-login').style.display = view === 'login' ? 'block' : 'none';
    document.getElementById('view-register').style.display = view === 'register' ? 'block' : 'none';
}

// Xử lý Đăng nhập
async function handleLogin() {
    const username = document.getElementById('l-user').value;
    const password = document.getElementById('l-pass').value;
    const msg = document.getElementById('l-msg');

    try {
        const response = await fetch(`${BASE_URL}/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username, password })
        });
        const result = await response.json();

        if (result.status === "success") {
            // Lưu thông tin vào bộ nhớ trình duyệt
            localStorage.setItem('token', result.data.token);
            localStorage.setItem('username', username);
            localStorage.setItem('role', result.data.role);
            
            // ĐIỀU HƯỚNG THỰC SỰ SANG FILE MỚI
            if (result.data.role === 'ADMIN') window.location.href = "admin.html";
            else if (result.data.role === 'RESTAURANT') window.location.href = "restaurant.html";
            else window.location.href = "customer.html";
        } else {
            msg.innerText = "❌ " + result.message;
        }
    } catch (e) { msg.innerText = "❗ Lỗi kết nối Server!"; }
}

async function handleRegister() {
    const msg = document.getElementById('r-msg');
    msg.innerText = ""; // Reset thông báo

    // 1. Lấy danh sách các ô nhập liệu cơ bản
    const inputs = {
        username: document.getElementById('r-user'),
        password: document.getElementById('r-pass'),
        email: document.getElementById('r-email'),
        full_name: document.getElementById('r-name'),
        phone: document.getElementById('r-phone'),
        address_detail: document.getElementById('r-address-detail')
    };

    // 2. Lấy bộ chọn địa chỉ
    const selects = {
        province: document.getElementById('province'),
        district: document.getElementById('district'),
        ward: document.getElementById('ward')
    };

    let hasError = false;

    // --- RÀNG BUỘC 1: KIỂM TRA TRỐNG ---
    for (let key in inputs) {
        if (!inputs[key].value.trim()) {
            inputs[key].style.borderColor = "red";
            hasError = true;
        } else {
            inputs[key].style.borderColor = "#ddd";
        }
    }

    // --- RÀNG BUỘC 2: KIỂM TRA BỘ CHỌN ĐỊA CHỈ ---
    for (let key in selects) {
        if (!selects[key].value) {
            selects[key].style.borderColor = "red";
            hasError = true;
        } else {
            selects[key].style.borderColor = "#ddd";
        }
    }

    if (hasError) {
        msg.innerText = "❌ Ngân ơi, vui lòng điền đầy đủ thông tin vào các ô đỏ nhé!";
        return;
    }

    // --- RÀNG BUỘC 3: ĐỊNH DẠNG EMAIL & SĐT (Nâng cao) ---
    if (!inputs.email.value.includes('@')) {
        inputs.email.style.borderColor = "red";
        msg.innerText = "❌ Email không đúng định dạng!";
        return;
    }

    // Gộp địa chỉ thành chuỗi hoàn chỉnh để lưu DB
    const fullAddress = `${inputs.address_detail.value.trim()}, ${selects.ward.selectedOptions[0].text}, ${selects.district.selectedOptions[0].text}, ${selects.province.selectedOptions[0].text}`;

    const userData = {
        username: inputs.username.value.trim(),
        password: inputs.password.value,
        email: inputs.email.value.trim(),
        full_name: inputs.full_name.value.trim(),
        phone: inputs.phone.value.trim(),
        address: fullAddress,
        role: document.getElementById('r-role').value
    };

    // 3. Gửi lên Backend
    try {
        const response = await fetch(`${BASE_URL}/register`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(userData)
        });
        const result = await response.json();

        if (result.status === "success") {
            alert("✨ Tuyệt vời! Ngân đã đăng ký thành công.");
            switchView('login');
        } else {
            msg.innerText = "❌ " + result.message;
        }
    } catch (error) {
        msg.innerText = "❗ Lỗi kết nối Server!";
    }
}