import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Profile from './Profile';


const Home = () => {
    const navigate = useNavigate();

    // === QUẢN LÝ GIAO DIỆN (Thay thế cho loadFragment) ===
    const [currentView, setCurrentView] = useState('restaurants'); // 'restaurants' hoặc 'menu'

    // === STATE DỮ LIỆU NHÀ HÀNG ===
    const [allRestaurants, setAllRestaurants] = useState([]);
    const [filteredRestaurants, setFilteredRestaurants] = useState([]);
    const [searchKeyword, setSearchKeyword] = useState('');

    // === STATE DỮ LIỆU MENU ===
    const [selectedResInfo, setSelectedResInfo] = useState(null);
    const [menuItems, setMenuItems] = useState([]);

    // === BƯỚC 1: KIỂM TRA QUYỀN & TẢI DỮ LIỆU LẦN ĐẦU ===
    useEffect(() => {
        const token = localStorage.getItem('token');
        const role = localStorage.getItem('role');

        if (!token || role !== 'CUSTOMER') {
            navigate('/'); // Đẩy về trang đăng nhập nếu không có quyền
            return;
        }

        // Gọi API tải danh sách nhà hàng
        fetchRestaurants(token);
    }, [navigate]);

    const fetchRestaurants = async (token) => {
        try {
            const response = await fetch('http://localhost:8080/api/v1/restaurants', {
                headers: { 'Authorization': 'Bearer ' + token }
            });
            const result = await response.json();
            
            if (result.status === 'success') {
                setAllRestaurants(result.data);
                setFilteredRestaurants(result.data); // Mặc định hiển thị tất cả
            }
        } catch (error) {
            console.error("Lỗi tải nhà hàng:", error);
        }
    };

    // === HÀM TÌM KIẾM NHÀ HÀNG ===
    const handleSearch = (e) => {
        const keyword = e.target.value.toLowerCase();
        setSearchKeyword(keyword);
        
        const filtered = allRestaurants.filter(res => {
            const name = (res.res_name || res.resName || '').toLowerCase();
            return name.includes(keyword);
        });
        setFilteredRestaurants(filtered);
    };

    // === HÀM XEM MENU (Đổi view và gọi API) ===
    const viewRestaurantMenu = async (resId) => {
        const token = localStorage.getItem('token');
        try {
            const response = await fetch(`http://localhost:8080/api/v1/restaurants/${resId}`, {
                headers: { 'Authorization': 'Bearer ' + token }
            });
            const result = await response.json();
            
            if (result.status === 'success') {
                setSelectedResInfo(result.data.restaurant);
                setMenuItems(result.data.menu);
                setCurrentView('menu'); // Chuyển giao diện sang Menu
            }
        } catch (error) {
            console.error("Lỗi tải menu:", error);
        }
    };

    // === CÁC HÀM XỬ LÝ KHÁC ===
    const handleLogout = () => {
        localStorage.clear();
        navigate('/');
    };

    const addToCart = (itemId) => {
        alert("Chuẩn bị thêm món " + itemId + " vào giỏ hàng!");
    };

    // ==========================================
    // RENDER GIAO DIỆN
    // ==========================================
    return (
        <div style={{ backgroundColor: "#f8f9fa", minHeight: "100vh", margin: 0 }}>
            {/* HEADER GIỮ NGUYÊN BỐ CỤC CŨ */}
            <header className="wf-header">
                <div className="wf-header-left">
                    <div className="wf-logo">🍕 YUMMY</div>
                    <div className="delivery-location">
                        <i className="fas fa-map-marker-alt"></i>
                        <span>Giao đến:</span>
                        <input type="text" id="delivery-address" placeholder="Nhập địa chỉ của bạn..." />
                        <div id="ship-fee-display" style={{ fontSize: "12px", color: "#e67e22", marginLeft: "10px", fontWeight: "bold" }}></div>
                    </div>
                </div>
                
                <div className="wf-header-center">
                    <div className="wf-search-box">
                        <i className="fas fa-search"></i>
                        <input 
                            type="text" 
                            placeholder="Tìm món ăn, nhà hàng..." 
                            value={searchKeyword}
                            onChange={handleSearch} 
                        />
                    </div>
                </div>
                
                <div className="wf-header-right">
                    <button className="wf-icon-btn"><i className="fas fa-shopping-cart"></i></button>
                    <button className="wf-icon-btn" onClick={handleLogout}><i className="fas fa-user"></i></button>
                </div>
            </header>

            {/* MAIN CONTENT AREA */}
            <main id="customer-content-area" style={{ padding: "20px" }}>
                
                {/* ĐIỀU KIỆN 1: NẾU ĐANG Ở TRANG DANH SÁCH NHÀ HÀNG */}
                {currentView === 'restaurants' && (
                    <div id="restaurant-list" className="grid-container">
                        {filteredRestaurants.length === 0 ? (
                            <p style={{ textAlign: "center", gridColumn: "1 / -1", color: "#7f8c8d" }}>Hiện chưa có nhà hàng nào hoạt động hoặc khớp với tìm kiếm.</p>
                        ) : (
                            filteredRestaurants.map(res => {
                                const id = res.res_id || res.resId || res.id;
                                const name = res.res_name || res.resName || 'Nhà hàng Yummy';
                                const address = res.res_address || res.resAddress || 'Đang cập nhật địa chỉ';
                                const imgUrl = res.res_image || res.resImage || 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=400&q=80';
                                const rating = res.rating_avg || res.ratingAvg || 5.0;

                                return (
                                    <div key={id} className="restaurant-card" onClick={() => viewRestaurantMenu(id)}>
                                        <img src={imgUrl} alt={name} />
                                        <div className="card-body">
                                            <h4 className="res-name">{name}</h4>
                                            <p className="res-address"><i className="fas fa-map-marker-alt"></i> {address}</p>
                                            <div className="res-rating" style={{ marginTop: "8px", color: "#f39c12", fontWeight: "bold", fontSize: "14px" }}>
                                                <i className="fas fa-star"></i> {rating}
                                            </div>
                                        </div>
                                    </div>
                                );
                            })
                        )}
                    </div>
                )}

                {/* ĐIỀU KIỆN 2: NẾU ĐANG Ở TRANG MENU CỦA 1 NHÀ HÀNG */}
                {currentView === 'menu' && selectedResInfo && (
                    <div>
                        <button 
                            className="btn-primary" 
                            style={{ marginBottom: "20px", background: "#6c757d" }} 
                            onClick={() => setCurrentView('restaurants')}
                        >
                            <i className="fas fa-arrow-left"></i> Quay lại danh sách
                        </button>
                        
                        <div id="res-header-info" style={{ marginBottom: "20px" }}>
                            <h2>{selectedResInfo.res_name}</h2>
                            <p><i className="fas fa-map-marker-alt"></i> {selectedResInfo.res_address}</p>
                        </div>

                        <div id="menu-list" className="grid-container">
                            {menuItems.length === 0 ? (
                                <p>Nhà hàng chưa có món ăn nào.</p>
                            ) : (
                                menuItems.map(item => {
                                    const imgUrl = item.item_image || 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=200&q=80';
                                    return (
                                        <div key={item.item_id} className="menu-card">
                                            <img src={imgUrl} alt={item.item_name} />
                                            <div className="menu-info">
                                                <h5>{item.item_name}</h5>
                                                <p className="menu-price">{item.price.toLocaleString('vi-VN')} đ</p>
                                            </div>
                                            <button className="btn-add-cart" onClick={() => addToCart(item.item_id)}>
                                                <i className="fas fa-plus"></i>
                                            </button>
                                        </div>
                                    );
                                })
                            )}
                        </div>
                    </div>
                )}

            </main>
        </div>
    );
};

export default Home;