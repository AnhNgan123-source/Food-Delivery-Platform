import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Profile from './Profile';



const Restaurant = () => {
    const navigate = useNavigate();
    
    // === QUẢN LÝ THÔNG TIN NGƯỜI DÙNG ===
    const [fullName, setFullName] = useState('Restaurant Admin');
    const [avatarChar, setAvatarChar] = useState('R');

    // === QUẢN LÝ TAB & DỮ LIỆU ===
    const [activeTab, setActiveTab] = useState('manage-menu'); // Mặc định mở Quản lý Menu
    const [menuItems, setMenuItems] = useState([]);
    const [filteredMenu, setFilteredMenu] = useState([]);
    const [searchKeyword, setSearchKeyword] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    // === 1. KIỂM TRA QUYỀN TRUY CẬP ===
    useEffect(() => {
        const token = localStorage.getItem('token');
        const role = localStorage.getItem('role');

        if (!token || role !== 'RESTAURANT') {
            alert("Bạn không có quyền truy cập vùng Nhà hàng!");
            navigate('/');
            return;
        }

        // Lấy tên hiển thị lên Header nếu có
        const storedName = localStorage.getItem('username'); // Hoặc full_name tùy bạn lưu lúc đăng nhập
        if (storedName) {
            setFullName(storedName);
            setAvatarChar(storedName.charAt(0).toUpperCase());
        }

    }, [navigate]);

    // === 2. GỌI API KHI CHUYỂN TAB ĐẾN "QUẢN LÝ MENU" ===
    useEffect(() => {
        if (activeTab === 'manage-menu') {
            fetchMenuData();
        }
    }, [activeTab]);

    const fetchMenuData = async () => {
        setIsLoading(true);
        try {
            // Lưu ý: Đường dẫn API này phải khớp với Backend của bạn
            const response = await fetch('http://localhost:8080/api/admin/foods');
            if (response.ok) {
                const foods = await response.json();
                setMenuItems(foods);
                setFilteredMenu(foods);
            } else {
                console.error("Lỗi: Không tải được menu từ Backend");
            }
        } catch (error) {
            console.error("Lỗi kết nối:", error);
        } finally {
            setIsLoading(false);
        }
    };

    // === 3. XỬ LÝ TÌM KIẾM MÓN ĂN ===
    const handleSearch = (e) => {
        const keyword = e.target.value.toLowerCase();
        setSearchKeyword(keyword);
        
        const filtered = menuItems.filter(item => {
            const name = (item.foodName || '').toLowerCase();
            return name.includes(keyword);
        });
        setFilteredMenu(filtered);
    };

    // === CÁC HÀM XỬ LÝ KHÁC ===
    const handleLogout = () => {
        if (window.confirm("Bạn có chắc chắn muốn đăng xuất?")) {
            localStorage.clear();
            navigate('/');
        }
    };

    const handleAddFood = () => {
        alert("Chức năng thêm món đang phát triển");
    };

    // === 4. HÀM RENDER NỘI DUNG TỪNG TAB ===
    const renderContent = () => {
        switch (activeTab) {
            case 'manage-menu':
                return (
                    <div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px' }}>
                            <input 
                                type="text" 
                                placeholder="Tìm món..." 
                                value={searchKeyword}
                                onChange={handleSearch}
                                style={{ width: '250px', padding: '10px' }}
                            />
                            <button className="btn-primary" onClick={handleAddFood}>
                                + Thêm món
                            </button>
                        </div>

                        {isLoading ? (
                            <div className="loader">Đang tải menu...</div>
                        ) : (
                            <div className="grid-container">
                                {filteredMenu.length === 0 ? (
                                    <p>Không tìm thấy món ăn nào.</p>
                                ) : (
                                    filteredMenu.map((food, index) => (
                                        <div className="card" key={index}>
                                            <div className="card-img">
                                                <img 
                                                    src={`/image/${food.image || 'default.jpg'}`} 
                                                    alt={food.foodName}
                                                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                                                />
                                            </div>
                                            <div className="card-body">
                                                <div className="card-title">{food.foodName}</div>
                                                <div className="card-price">
                                                    {food.price ? food.price.toLocaleString() : 0} đ
                                                </div>
                                                <button className="card-btn">Chỉnh sửa</button>
                                            </div>
                                        </div>
                                    ))
                                )}
                            </div>
                        )}
                    </div>
                );
            case 'toggle-items': return <h3>Bật / tắt món</h3>;
            case 'new-orders': return <h3>Đơn mới</h3>;
            case 'order-status': return <h3>Trạng thái đơn</h3>;
            case 'revenue-stats': return <h3>Thống kê doanh thu</h3>;
            case 'res-info': return <h3>Thông tin nhà hàng</h3>;
            case 'profile': 
                return <Profile />;     

            default: return null;    
        }    
    };

    // === HÀM LẤY TIÊU ĐỀ HEADER ===
    const getPageTitle = () => {
        const titles = {
            'manage-menu': 'Quản lý menu',
            'toggle-items': 'Bật/tắt món',
            'new-orders': 'Đơn hàng mới',
            'order-status': 'Trạng thái đơn',
            'revenue-stats': 'Doanh thu',
            'res-info': 'Thông tin quán',
            'profile': 'Hồ sơ cá nhân'
        };
        return titles[activeTab] || 'Dashboard';
    };

    // ==========================================
    // RENDER GIAO DIỆN CHÍNH
    // ==========================================
    return (
        <div className="dashboard-layout">
            <aside className="sidebar">
                <div className="brand">
                    <h3>Yummy Hub</h3>
                    <p style={{ fontSize: '12px', color: '#28a745', fontWeight: 'bold' }}>Nhà hàng của bạn</p>
                </div>
                <ul>
                    <li className={activeTab === 'manage-menu' ? 'active' : ''} onClick={() => setActiveTab('manage-menu')} style={{ cursor: 'pointer' }}>
                        <i className="fas fa-utensils"></i> Quản lý menu
                    </li>
                    <li className={activeTab === 'toggle-items' ? 'active' : ''} onClick={() => setActiveTab('toggle-items')} style={{ cursor: 'pointer' }}>
                        <i className="fas fa-toggle-on"></i> Bật/tắt món
                    </li>
                    <li className={activeTab === 'new-orders' ? 'active' : ''} onClick={() => setActiveTab('new-orders')} style={{ cursor: 'pointer' }}>
                        <i className="fas fa-shopping-bag"></i> Đơn hàng mới
                    </li>
                    <li className={activeTab === 'order-status' ? 'active' : ''} onClick={() => setActiveTab('order-status')} style={{ cursor: 'pointer' }}>
                        <i className="fas fa-truck"></i> Trạng thái đơn
                    </li>
                    <li className={activeTab === 'revenue-stats' ? 'active' : ''} onClick={() => setActiveTab('revenue-stats')} style={{ cursor: 'pointer' }}>
                        <i className="fas fa-chart-line"></i> Doanh thu
                    </li>
                    <li className={activeTab === 'res-info' ? 'active' : ''} onClick={() => setActiveTab('res-info')} style={{ cursor: 'pointer' }}>
                        <i className="fas fa-store"></i> Thông tin quán
                    </li>
                    <li className={activeTab === 'profile' ? 'active' : ''} onClick={() => setActiveTab('profile')} style={{ cursor: 'pointer' }}>
                        <i className="fas fa-user-circle"></i> Hồ sơ cá nhân
                    </li>
                </ul>
                <button onClick={handleLogout} className="btn-logout">
                    <i className="fas fa-sign-out-alt"></i> Đăng xuất
                </button>
            </aside>

            <main className="main-content">
                <header className="main-header">
                    <div>
                        <h2>{getPageTitle()}</h2>
                    </div>
                    <div className="user-profile-mini">
                        <span>{fullName}</span>
                        <div className="avatar-mini">{avatarChar}</div>
                    </div>
                </header>

                <div id="content-area">
                    {renderContent()}
                </div>
            </main>
        </div>
    );
};
export default Restaurant;