import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Profile from './Profile';
import AddMenuItemForm from '../components/Restaurant/AddMenuItemForm';
import MenuList from '../components/Restaurant/MenuList';

const Restaurant = () => {
    const navigate = useNavigate();
    
    // === QUẢN LÝ THÔNG TIN NGƯỜI DÙNG ===
    const [fullName, setFullName] = useState('Restaurant Admin');
    const [avatarChar, setAvatarChar] = useState('R');

    // === QUẢN LÝ TAB & DỮ LIỆU ===
    const [activeTab, setActiveTab] = useState('manage-menu'); 
    const [menuItems, setMenuItems] = useState([]);
    const [filteredMenu, setFilteredMenu] = useState([]);
    const [searchKeyword, setSearchKeyword] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    // Dùng để giữ thông tin món cần sửa
    const [editingItem, setEditingItem] = useState(null);

    // === 1. CHECK QUYỀN TRUY CẬP ===
    useEffect(() => {
        const token = localStorage.getItem('token');
        const role = localStorage.getItem('role');

        if (!token || role !== 'RESTAURANT') {
            alert("Bạn không có quyền truy cập vùng Nhà hàng!");
            navigate('/');
            return;
        }

        const storedName = localStorage.getItem('username');
        if (storedName) {
            setFullName(storedName);
            setAvatarChar(storedName.charAt(0).toUpperCase());
        }

    }, [navigate]);

    // === LOAD MENU KHI MỞ TAB ===
    useEffect(() => {
        if (activeTab === 'manage-menu') {
            fetchMenuData();
        }
    }, [activeTab]);

    const fetchMenuData = async () => {
        setIsLoading(true);
        const token = localStorage.getItem('token'); 
        try {
            const resId = localStorage.getItem('resId'); 

            const response = await fetch(
                `http://localhost:8080/api/menu/restaurant/${resId}`,
                {
                    headers: {
                        "Authorization": `Bearer ${token}` 
                    }
                }
            );

            if (response.ok) {
                const foods = await response.json();
                setMenuItems(foods);
                setFilteredMenu(foods);
            } else {
                console.error("Không load được menu");
            }
        } catch (error) {
            console.error("Lỗi:", error);
        } finally {
            setIsLoading(false);
        }
    };

    // === SEARCH ===
    const handleSearch = (e) => {
        const keyword = e.target.value.toLowerCase();
        setSearchKeyword(keyword);
        
        const filtered = menuItems.filter(item => {
            const name = (item.item_name || '').toLowerCase();
            return name.includes(keyword);
        });
        setFilteredMenu(filtered);
    };

    // === LOGOUT ===
    const handleLogout = () => {
        if (window.confirm("Bạn có chắc chắn muốn đăng xuất?")) {
            localStorage.clear();
            navigate('/');
        }
    };

    const handleAddFood = () => {
        setEditingItem(null); 
        setActiveTab('add-food');
    };

    const handleEdit = (food) => {
        setEditingItem(food); 
        setActiveTab('add-food'); 
    };

    // === DELETE FOOD ===
    const handleDelete = async (id) => {
        if (!window.confirm("Bạn chắc chắn muốn xoá món này?")) return;
        const token = localStorage.getItem('token'); 

        try {
            const response = await fetch(`http://localhost:8080/api/menu/${id}`, {
                method: "DELETE",
                headers: {
                    "Authorization": `Bearer ${token}` 
                }
            });

            if (response.ok) {
                alert("Xoá món thành công!");
                fetchMenuData();
            } else {
                alert("Lỗi khi xoá món!");
            }
        } catch (err) {
            console.error(err);
        }
    };

    // === HÀM BẬT/TẮT TRẠNG THÁI MÓN (Dùng ngay tại Card) ===
    const handleToggleStatus = async (id, isCurrentlyAvailable) => {
        const action = isCurrentlyAvailable ? "ẨN (Hết hàng)" : "HIỆN (Còn hàng)";
        if (!window.confirm(`Bạn có chắc muốn ${action} món này không?`)) return;

        const token = localStorage.getItem('token');
        try {
            const response = await fetch(`http://localhost:8080/api/menu/${id}/toggle`, {
                method: "PUT",
                headers: {
                    "Authorization": `Bearer ${token}`
                }
            });

            if (response.ok) {
                const updatedList = menuItems.map(item => 
                    item.itemId === id ? { ...item, is_available: isCurrentlyAvailable ? 0 : 1 } : item
                );
                setMenuItems(updatedList);
                setFilteredMenu(updatedList);
            } else {
                alert("Cập nhật trạng thái thất bại!");
            }
        } catch (error) {
            console.error("Lỗi:", error);
        }
    };

    // === RENDER TỪNG TAB ===
    const renderContent = () => {
        switch (activeTab) {
            case 'manage-menu':
                return (
                    <div>
                        <div style={{ 
                            display: 'flex', 
                            justifyContent: 'space-between', 
                            alignItems: 'center', 
                            marginBottom: '20px',
                            gap: '20px' 
                        }}>
                            <div className="wf-search-box" style={{ width: '300px' }}>
                                <i className="fas fa-search"></i>
                                <input 
                                    type="text" 
                                    placeholder="Tìm món..." 
                                    value={searchKeyword}
                                    onChange={handleSearch}
                                />
                            </div>

                            <button 
                                className="btn-primary" 
                                onClick={handleAddFood}
                                style={{ width: 'auto', padding: '10px 25px' }}
                            >
                                + Thêm món
                            </button>
                        </div>

                        {isLoading ? (
                            <div className="loader">Đang tải menu...</div>
                        ) : (
                            <MenuList
                                foods={filteredMenu}
                                onEdit={handleEdit}
                                onDelete={handleDelete}
                                onToggleStatus={handleToggleStatus} 
                            />
                        )}
                    </div>
                );

            case 'add-food':
                return (
                    <AddMenuItemForm
                        initialData={editingItem} 
                        onCancel={() => {
                            setEditingItem(null);
                            setActiveTab('manage-menu');
                        }}
                        onSuccess={() => {
                            setEditingItem(null);
                            setActiveTab('manage-menu');
                            fetchMenuData();
                        }}
                    />
                );

            case 'new-orders': return <h3>Đơn hàng đang chờ xử lý...</h3>;
            case 'order-status': return <h3>Lịch sử đơn hàng</h3>;
            case 'revenue-stats': return <h3>Thống kê doanh thu</h3>;
            case 'res-info': return <h3>Thông tin cửa hàng</h3>;
            case 'profile': return <Profile />;

            default: return null;
        }
    };

    // === LẤY TIÊU ĐỀ ===
    const getPageTitle = () => {
        const titles = {
            'manage-menu': 'Quản lý menu',
            'add-food': editingItem ? 'Cập nhật món ăn' : 'Thêm món mới', 
            'new-orders': 'Đơn hàng mới',
            'order-status': 'Trạng thái đơn',
            'revenue-stats': 'Doanh thu',
            'res-info': 'Thông tin quán',
            'profile': 'Hồ sơ cá nhân'
        };
        return titles[activeTab] || 'Dashboard';
    };

    return (
        <div className="dashboard-layout">
            <aside className="sidebar">
                <div className="brand">
                    <h3>Yummy Hub</h3>
                    <p style={{ fontSize: '12px', color: '#28a745', fontWeight: 'bold' }}>Nhà hàng của bạn</p>
                </div>

                <ul>
                    <li className={(activeTab === 'manage-menu' || activeTab === 'add-food') ? 'active' : ''} onClick={() => setActiveTab('manage-menu')}> 
                        <i className="fas fa-utensils"></i> Quản lý menu
                    </li>
                    <li className={activeTab === 'new-orders' ? 'active' : ''} onClick={() => setActiveTab('new-orders')}>
                        <i className="fas fa-shopping-bag"></i> Đơn hàng mới
                    </li>
                    <li className={activeTab === 'order-status' ? 'active' : ''} onClick={() => setActiveTab('order-status')}>
                        <i className="fas fa-truck"></i> Trạng thái đơn
                    </li>
                    <li className={activeTab === 'revenue-stats' ? 'active' : ''} onClick={() => setActiveTab('revenue-stats')}>
                        <i className="fas fa-chart-line"></i> Doanh thu
                    </li>
                    <li className={activeTab === 'res-info' ? 'active' : ''} onClick={() => setActiveTab('res-info')}>
                        <i className="fas fa-store"></i> Thông tin quán
                    </li>
                    <li className={activeTab === 'profile' ? 'active' : ''} onClick={() => setActiveTab('profile')}>
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