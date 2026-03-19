import React, { useState, useEffect } from 'react';
// Nếu bạn dùng react-router-dom để chuyển trang, hãy uncomment dòng dưới:
import { useNavigate } from 'react-router-dom';

const Auth = () => {
    const navigate = useNavigate(); // Dùng cho React Router

    // === STATE ĐIỀU KHIỂN GIAO DIỆN ===
    const [isLoginView, setIsLoginView] = useState(true);

    // === STATE CHO LOGIN ===
    const [loginUser, setLoginUser] = useState('');
    const [loginPass, setLoginPass] = useState('');
    const [loginMsg, setLoginMsg] = useState('');

    // === STATE CHO REGISTER ===
    const [regData, setRegData] = useState({
        username: '', password: '', email: '', full_name: '', phone: '', address_detail: '', role: 'CUSTOMER'
    });
    const [regMsg, setRegMsg] = useState('');
    
    // State cho địa chỉ API
    const [provinces, setProvinces] = useState([]);
    const [districts, setDistricts] = useState([]);
    const [wards, setWards] = useState([]);
    
    const [selectedProv, setSelectedProv] = useState({ code: '', name: '' });
    const [selectedDist, setSelectedDist] = useState({ code: '', name: '' });
    const [selectedWard, setSelectedWard] = useState({ code: '', name: '' });

    const BASE_URL = "http://localhost:8080/auth";

    // === EFFECT: Tải danh sách Tỉnh/Thành khi mới mở form ===
    useEffect(() => {
        if (!isLoginView && provinces.length === 0) {
            fetch('https://provinces.open-api.vn/api/?depth=1')
                .then(res => res.json())
                .then(data => setProvinces(data))
                .catch(err => console.error("Lỗi tải Tỉnh/Thành", err));
        }
    }, [isLoginView]);

    // === EFFECT: Tải Quận/Huyện khi Tỉnh/Thành thay đổi ===
    useEffect(() => {
        if (selectedProv.code) {
            fetch(`https://provinces.open-api.vn/api/p/${selectedProv.code}?depth=2`)
                .then(res => res.json())
                .then(data => {
                    setDistricts(data.districts || []);
                    setWards([]); // Reset phường xã
                    setSelectedDist({ code: '', name: '' });
                    setSelectedWard({ code: '', name: '' });
                });
        }
    }, [selectedProv.code]);

    // === EFFECT: Tải Phường/Xã khi Quận/Huyện thay đổi ===
    useEffect(() => {
        if (selectedDist.code) {
            fetch(`https://provinces.open-api.vn/api/d/${selectedDist.code}?depth=2`)
                .then(res => res.json())
                .then(data => setWards(data.wards || []));
        }
    }, [selectedDist.code]);

    // === HÀM XỬ LÝ ĐĂNG NHẬP  ===
    const handleLogin = async (e) => {
        if (e) e.preventDefault(); 
        
        setLoginMsg('');
        try {
            const response = await fetch(`${BASE_URL}/login`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username: loginUser, password: loginPass })
            });
            const result = await response.json();

            if (result.status === "success") {
                // Lưu các thông tin chung
                localStorage.setItem('token', result.data.token);
                localStorage.setItem('username', loginUser);
                localStorage.setItem('role', result.data.role);
                
                // LƯU THÊM resId Ở ĐÂY
                if (result.data.role === 'RESTAURANT') {
                    const resId = result.data.restaurantId || result.data.id; 
                    
                    if (resId) {
                        localStorage.setItem('resId', resId);
                        console.log("Đã lưu resId:", resId);
                    } else {
                        console.error("Backend không trả về ID nhà hàng!");
                    }
                    
                    navigate("/restaurant");
                } else if (result.data.role === 'ADMIN') {
                    navigate("/admin"); 
                } else {
                    navigate("/home"); 
                }
            } else {
                setLoginMsg("❌ " + result.message);
            }
        } catch (error) { 
            setLoginMsg("❗ Lỗi kết nối Server!"); 
        }
    };

    // === HÀM XỬ LÝ ĐĂNG KÝ ===
    const handleRegister = async (e) => {
        if (e) e.preventDefault(); 

        setRegMsg('');
        
        // Validation cơ bản
        if (!regData.username || !regData.password || !regData.email || !regData.full_name || 
            !regData.phone || !regData.address_detail || !selectedProv.name || !selectedDist.name || !selectedWard.name) {
            setRegMsg("❌ Ngân ơi, vui lòng điền đầy đủ thông tin!");
            return;
        }

        if (!regData.email.includes('@')) {
            setRegMsg("❌ Email không đúng định dạng!");
            return;
        }

        const fullAddress = `${regData.address_detail.trim()}, ${selectedWard.name}, ${selectedDist.name}, ${selectedProv.name}`;

        const payload = {
            username: regData.username.trim(),
            password: regData.password,
            email: regData.email.trim(),
            full_name: regData.full_name.trim(),
            phone: regData.phone.trim(),
            address: fullAddress,
            role: regData.role
        };

        try {
            const response = await fetch(`${BASE_URL}/register`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });
            const result = await response.json();

            if (result.status === "success") {
                alert("✨ Tuyệt vời! Ngân đã đăng ký thành công.");
                setIsLoginView(true); // Tự động chuyển về form đăng nhập
            } else {
                setRegMsg("❌ " + result.message);
            }
        } catch (error) {
            setRegMsg("❗ Lỗi kết nối Server!");
        }
    };

    // Hàm cập nhật state cho form đăng ký
    const handleRegChange = (e) => {
        setRegData({ ...regData, [e.target.name]: e.target.value });
    };

    return (
        <div id="screen-auth" className="auth-screen">
            <div className="container">
                <div className="left-side"></div>
                <div className="right-side">
                    
                    {/* ===== GIAO DIỆN LOGIN ===== */}
                    {isLoginView ? (
                        <div id="view-login">
                            <h2>Welcome Back!</h2>
                            <input 
                                type="text" placeholder="Username" 
                                value={loginUser} onChange={(e) => setLoginUser(e.target.value)} 
                            />
                            <input 
                                type="password" placeholder="Password" 
                                value={loginPass} onChange={(e) => setLoginPass(e.target.value)} 
                            />
                            <button type = "button" className="btn-primary" onClick={(e) =>handleLogin(e)}>Sign In</button>
                            <div className="error-msg">{loginMsg}</div>
                            <p style={{ textAlign: "center", marginTop: "15px" }}>
                                Chưa có tài khoản? <a href="#!" onClick={(e) => { e.preventDefault(); setIsLoginView(false); }}>Đăng ký</a>
                            </p>
                        </div>
                    ) : (
                        
                    /* ===== GIAO DIỆN REGISTER ===== */
                        <div id="view-register">
                            <h2>Join Us!</h2>
                            <p className="subtitle">Trở thành thành viên của Yummy Food ngay hôm nay!</p>
                            
                            <div className="form-row">
                                <input type="text" name="username" placeholder="Tên đăng nhập *" value={regData.username} onChange={handleRegChange} />
                                <input type="password" name="password" placeholder="Mật khẩu *" value={regData.password} onChange={handleRegChange} />
                            </div>
                            
                            <input type="email" name="email" placeholder="Địa chỉ Email *" style={{ marginBottom: "12px" }} value={regData.email} onChange={handleRegChange} />
                            
                            <div className="form-row">
                                <input type="text" name="full_name" placeholder="Họ và tên *" value={regData.full_name} onChange={handleRegChange} />
                                <input type="text" name="phone" placeholder="Số điện thoại *" value={regData.phone} onChange={handleRegChange} />
                            </div>
                            
                            <div className="form-row">
                                <select 
                                    value={selectedProv.code} 
                                    onChange={(e) => setSelectedProv({ code: e.target.value, name: e.target.options[e.target.selectedIndex].text })}>
                                    <option value="">Tỉnh/Thành *</option>
                                    {provinces.map(p => <option key={p.code} value={p.code}>{p.name}</option>)}
                                </select>
                                <select 
                                    value={selectedDist.code} 
                                    onChange={(e) => setSelectedDist({ code: e.target.value, name: e.target.options[e.target.selectedIndex].text })}>
                                    <option value="">Quận/Huyện *</option>
                                    {districts.map(d => <option key={d.code} value={d.code}>{d.name}</option>)}
                                </select>
                            </div>
                            
                            <div className="form-row">
                                <select 
                                    value={selectedWard.code} 
                                    onChange={(e) => setSelectedWard({ code: e.target.value, name: e.target.options[e.target.selectedIndex].text })}>
                                    <option value="">Phường/Xã *</option>
                                    {wards.map(w => <option key={w.code} value={w.code}>{w.name}</option>)}
                                </select>
                                <input type="text" name="address_detail" placeholder="Số nhà, tên đường *" value={regData.address_detail} onChange={handleRegChange} />
                            </div>
                            
                            <select name="role" style={{ marginBottom: "15px" }} value={regData.role} onChange={handleRegChange}>
                                <option value="CUSTOMER">Vai trò: Khách hàng (Người mua)</option>
                                <option value="RESTAURANT">Vai trò: Nhà hàng (Người bán)</option>
                            </select>
                            
                            <button className="btn-primary" style={{ background: "#007bff" }} onClick={handleRegister}>Tạo tài khoản</button>
                            
                            <p style={{ textAlign: "center", marginTop: "15px" }}>
                                Đã có tài khoản? <a href="#!" onClick={(e) => { e.preventDefault(); setIsLoginView(true); }} style={{ color: "#28a745", fontWeight: "bold" }}>Quay lại Đăng nhập</a>
                            </p>
                            <div className="error-msg">{regMsg}</div>
                        </div>
                    )}

                </div>
            </div>
        </div>
    );
};

export default Auth;