import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import authApi from '../../api/authApi' // Đảm bảo đường dẫn này đúng với cấu trúc thư mục của bạn

const Auth = () => {
    const navigate = useNavigate();

    // === STATE QUẢN LÝ GIAO DIỆN ===
    const [isLoginView, setIsLoginView] = useState(true);

    // === STATE ĐĂNG NHẬP ===
    const [loginUser, setLoginUser] = useState('');
    const [loginPass, setLoginPass] = useState('');
    const [loginMsg, setLoginMsg] = useState('');

    // === STATE ĐĂNG KÝ ===
    const [regData, setRegData] = useState({
        userName: '', 
        passWord: '', 
        email: '', 
        fullName: '', 
        phone: '', 
        address_detail: '', 
        role: 'CUSTOMER'
    });
    const [regMsg, setRegMsg] = useState('');
    
    // === STATE ĐỊA CHỈ (PROVINCES API) ===
    const [provinces, setProvinces] = useState([]);
    const [districts, setDistricts] = useState([]);
    const [wards, setWards] = useState([]);
    
    const [selectedProv, setSelectedProv] = useState({ code: '', name: '' });
    const [selectedDist, setSelectedDist] = useState({ code: '', name: '' });
    const [selectedWard, setSelectedWard] = useState({ code: '', name: '' });

    // === 1. EFFECT: TẢI DANH SÁCH TỈNH/THÀNH ===
    useEffect(() => {
        if (!isLoginView && provinces.length === 0) {
            fetch('https://provinces.open-api.vn/api/?depth=1')
                .then(res => res.json())
                .then(data => setProvinces(data))
                .catch(err => console.error("Lỗi tải Tỉnh/Thành", err));
        }
    }, [isLoginView, provinces.length]);

    // === 2. EFFECT: TẢI QUẬN/HUYỆN KHI CHỌN TỈNH ===
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

    // === 3. EFFECT: TẢI PHƯỜNG/XÃ KHI CHỌN QUẬN ===
    useEffect(() => {
        if (selectedDist.code) {
            fetch(`https://provinces.open-api.vn/api/d/${selectedDist.code}?depth=2`)
                .then(res => res.json())
                .then(data => setWards(data.wards || []));
        }
    }, [selectedDist.code]);

    // === HÀM XỬ LÝ ĐĂNG NHẬP ===
    const handleLogin = async (e) => {
        if (e) e.preventDefault(); 
        setLoginMsg('');
        
        try {
            // Sử dụng authApi (đã qua axiosClient bóc tách dữ liệu)
            const data = await authApi.login({ 
                username: loginUser, 
                password: loginPass 
            });

            // Lưu thông tin vào LocalStorage
            localStorage.setItem('token', data.token);
            localStorage.setItem('role', data.role);
            localStorage.setItem('userId', data.id); 

            // Khớp với key "restaurantId" từ Backend trả về
            if (data.role === 'RESTAURANT' && data.restaurantId) {
                localStorage.setItem('restaurantId', data.restaurantId);
            }

            // Điều hướng người dùng
            if (data.role === 'RESTAURANT') navigate("/restaurant");
            else if (data.role === 'ADMIN') navigate("/admin");
            else navigate("/home");

        } catch (error) { 
            const errorMsg = error.response?.data?.message || "Sai tài khoản hoặc mật khẩu!";
            setLoginMsg("❌ " + errorMsg); 
        }
    };

    // === HÀM XỬ LÝ ĐĂNG KÝ ===
    const handleRegister = async (e) => {
        if (e) e.preventDefault(); 
        setRegMsg('');
        
        // Kiểm tra validation cơ bản
        if (!regData.userName || !regData.passWord || !regData.email || !regData.fullName || 
            !regData.phone || !regData.address_detail || !selectedProv.name || !selectedDist.name || !selectedWard.name) {
            setRegMsg("Vui lòng điền đầy đủ thông tin bắt buộc!");
            return;
        }

        const fullAddress = `${regData.address_detail.trim()}, ${selectedWard.name}, ${selectedDist.name}, ${selectedProv.name}`;

        // Payload phải khớp với Entity User.java ở Backend (userName, passWord, fullName)
        const payload = {
            userName: regData.userName.trim(),
            passWord: regData.passWord,
            email: regData.email.trim(),
            fullName: regData.fullName.trim(),
            phone: regData.phone.trim(),
            address: fullAddress,
            role: regData.role
        };

        try {
            const result = await authApi.register(payload);

            if (result.status === "success") {
                alert("Đăng ký thành công! Hãy đăng nhập nhé.");
                setIsLoginView(true);
            } else {
                setRegMsg("❌ " + result.message);
            }
        } catch (error) {
            const errorMsg = error.response?.data?.message || "Lỗi đăng ký, vui lòng thử lại!";
            setRegMsg("❗ " + errorMsg);
        }
    };

    const handleRegChange = (e) => {
        setRegData({ ...regData, [e.target.name]: e.target.value });
    };

    return (
        <div id="screen-auth" className="auth-screen">
            <div className="container">
                <div className="left-side">
                    {/* Bạn có thể thêm hình ảnh hoặc slogan ở đây */}
                </div>
                
                <div className="right-side">
                    {isLoginView ? (
                        /* VIEW: ĐĂNG NHẬP */
                        <div id="view-login">
                            <h2>Welcome Back!</h2>
                            <input 
                                type="text" 
                                placeholder="Username" 
                                value={loginUser} 
                                onChange={(e) => setLoginUser(e.target.value)} 
                            />
                            <input 
                                type="password" 
                                placeholder="Password" 
                                value={loginPass} 
                                onChange={(e) => setLoginPass(e.target.value)} 
                            />
                            <button type="button" className="btn-primary" onClick={handleLogin}>Sign In</button>
                            <div className="error-msg" style={{color: 'red', marginTop: '10px'}}>{loginMsg}</div>
                            <p style={{ textAlign: "center", marginTop: "15px" }}>
                                Chưa có tài khoản? <a href="#!" onClick={(e) => { e.preventDefault(); setIsLoginView(false); }}>Đăng ký ngay</a>
                            </p>
                        </div>
                    ) : (
                        /* VIEW: ĐĂNG KÝ */
                        <div id="view-register">
                            <h2>Join Us!</h2>
                            <div className="form-row">
                                <input type="text" name="userName" placeholder="Tên đăng nhập *" value={regData.username} onChange={handleRegChange} />
                                <input type="password" name="passWord" placeholder="Mật khẩu *" value={regData.password} onChange={handleRegChange} />
                            </div>
                            <div className="form-row">
                                <input type="text" name="fullName" placeholder="Họ và tên *" value={regData.fullName} onChange={handleRegChange} />
                                <input type="email" name="email" placeholder="Email *" value={regData.email} onChange={handleRegChange} />
                            </div>
                            <div className="form-row">
                                <input type="text" name="phone" placeholder="Số điện thoại *" value={regData.phone} onChange={handleRegChange} />
                                <select name="role" value={regData.role} onChange={handleRegChange}>
                                    <option value="CUSTOMER">Khách hàng</option>
                                    <option value="RESTAURANT">Chủ nhà hàng</option>
                                    <option value="SHIPPER">Shipper</option>
                                </select>
                            </div>

                            {/* CHỌN ĐỊA CHỈ */}
                            <div className="form-row">
                                <select onChange={(e) => {
                                    const opt = e.target.options[e.target.selectedIndex];
                                    setSelectedProv({ code: e.target.value, name: opt.text });
                                }}>
                                    <option value="">Chọn Tỉnh/Thành *</option>
                                    {provinces.map(p => <option key={p.code} value={p.code}>{p.name}</option>)}
                                </select>
                                <select onChange={(e) => {
                                    const opt = e.target.options[e.target.selectedIndex];
                                    setSelectedDist({ code: e.target.value, name: opt.text });
                                }}>
                                    <option value="">Chọn Quận/Huyện *</option>
                                    {districts.map(d => <option key={d.code} value={d.code}>{d.name}</option>)}
                                </select>
                            </div>
                            <div className="form-row">
                                <select onChange={(e) => {
                                    const opt = e.target.options[e.target.selectedIndex];
                                    setSelectedWard({ code: e.target.value, name: opt.text });
                                }}>
                                    <option value="">Chọn Phường/Xã *</option>
                                    {wards.map(w => <option key={w.code} value={w.code}>{w.name}</option>)}
                                </select>
                                <input 
                                    type="text" 
                                    name="address_detail" 
                                    placeholder="Số nhà, tên đường *" 
                                    value={regData.address_detail} 
                                    onChange={handleRegChange} 
                                />
                            </div>

                            <button className="btn-primary" style={{ background: "#007bff" }} onClick={handleRegister}>Tạo tài khoản</button>
                            <p style={{ textAlign: "center", marginTop: "15px" }}>
                                Đã có tài khoản? <a href="#!" onClick={(e) => { e.preventDefault(); setIsLoginView(true); }} style={{ color: "#28a745", fontWeight: "bold" }}>Quay lại Đăng nhập</a>
                            </p>
                            <div className="error-msg" style={{color: 'red', marginTop: '10px'}}>{regMsg}</div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Auth;