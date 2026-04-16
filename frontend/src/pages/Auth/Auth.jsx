import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const Auth = () => {
    const navigate = useNavigate();

    const [isLoginView, setIsLoginView] = useState(true);
    const [loginUser, setLoginUser] = useState('');
    const [loginPass, setLoginPass] = useState('');
    const [loginMsg, setLoginMsg] = useState('');

    const [regData, setRegData] = useState({
        username: '', password: '', email: '', full_name: '', phone: '', address_detail: '', role: 'CUSTOMER'
    });
    const [regMsg, setRegMsg] = useState('');
    
    const [provinces, setProvinces] = useState([]);
    const [districts, setDistricts] = useState([]);
    const [wards, setWards] = useState([]);
    
    const [selectedProv, setSelectedProv] = useState({ code: '', name: '' });
    const [selectedDist, setSelectedDist] = useState({ code: '', name: '' });
    const [selectedWard, setSelectedWard] = useState({ code: '', name: '' });

    const BASE_URL = "http://localhost:8080/auth";

    // === EFFECTS (Giữ nguyên logic của bạn) ===
    useEffect(() => {
        if (!isLoginView && provinces.length === 0) {
            fetch('https://provinces.open-api.vn/api/?depth=1')
                .then(res => res.json())
                .then(data => setProvinces(data))
                .catch(err => console.error("Lỗi tải Tỉnh/Thành", err));
        }
    }, [isLoginView]);

    useEffect(() => {
        if (selectedProv.code) {
            fetch(`https://provinces.open-api.vn/api/p/${selectedProv.code}?depth=2`)
                .then(res => res.json())
                .then(data => {
                    setDistricts(data.districts || []);
                    setWards([]);
                    setSelectedDist({ code: '', name: '' });
                    setSelectedWard({ code: '', name: '' });
                });
        }
    }, [selectedProv.code]);

    useEffect(() => {
        if (selectedDist.code) {
            fetch(`https://provinces.open-api.vn/api/d/${selectedDist.code}?depth=2`)
                .then(res => res.json())
                .then(data => setWards(data.wards || []));
        }
    }, [selectedDist.code]);

    // === HÀM XỬ LÝ ĐĂNG NHẬP (ĐÃ SỬA LOGIC) ===
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
                localStorage.setItem('token', result.data.token);
                localStorage.setItem('role', result.data.role);
                localStorage.setItem('userId', result.data.id); 

                // Nếu là Nhà hàng, lưu thêm resId
                if (result.data.role === 'RESTAURANT') {
                    if (result.data.resId) {
                        localStorage.setItem('resId', result.data.resId);
                    }
                }

                // ĐIỀU HƯỚNG RA NGOÀI KHỐI IF RESTAURANT
                if (result.data.role === 'RESTAURANT') navigate("/restaurant");
                else if (result.data.role === 'ADMIN') navigate("/admin");
                else navigate("/home");

            } else {
                setLoginMsg("❌ " + result.message);
            }
        } catch (error) { 
            setLoginMsg("❗ Lỗi kết nối Server!"); 
        }
    };

    const handleRegister = async (e) => {
        if (e) e.preventDefault(); 
        setRegMsg('');
        
        if (!regData.username || !regData.password || !regData.email || !regData.full_name || 
            !regData.phone || !regData.address_detail || !selectedProv.name || !selectedDist.name || !selectedWard.name) {
            setRegMsg("Bạn ơi, vui lòng điền đầy đủ thông tin!");
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
                alert("✨ Tuyệt vời! Bạn đã đăng ký thành công.");
                setIsLoginView(true);
            } else {
                setRegMsg("❌ " + result.message);
            }
        } catch (error) {
            setRegMsg("❗ Lỗi kết nối Server!");
        }
    };

    const handleRegChange = (e) => {
        setRegData({ ...regData, [e.target.name]: e.target.value });
    };

    return (
        // ... (Phần UI return của bạn giữ nguyên, nó đã ổn rồi) ...
        <div id="screen-auth" className="auth-screen">
             {/* Nội dung UI cũ của bạn */}
             <div className="container">
                <div className="left-side"></div>
                <div className="right-side">
                    {isLoginView ? (
                        <div id="view-login">
                            <h2>Welcome Back!</h2>
                            <input type="text" placeholder="Username" value={loginUser} onChange={(e) => setLoginUser(e.target.value)} />
                            <input type="password" placeholder="Password" value={loginPass} onChange={(e) => setLoginPass(e.target.value)} />
                            <button type="button" className="btn-primary" onClick={handleLogin}>Sign In</button>
                            <div className="error-msg">{loginMsg}</div>
                            <p style={{ textAlign: "center", marginTop: "15px" }}>
                                Chưa có tài khoản? <a href="#!" onClick={(e) => { e.preventDefault(); setIsLoginView(false); }}>Đăng ký</a>
                            </p>
                        </div>
                    ) : (
                        <div id="view-register">
                            {/* Form Đăng ký */}
                            <h2>Join Us!</h2>
                            <div className="form-row">
                                <input type="text" name="username" placeholder="Tên đăng nhập *" value={regData.username} onChange={handleRegChange} />
                                <input type="password" name="password" placeholder="Mật khẩu *" value={regData.password} onChange={handleRegChange} />
                            </div>
                            {/* ... Các ô input khác của bạn ... */}
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