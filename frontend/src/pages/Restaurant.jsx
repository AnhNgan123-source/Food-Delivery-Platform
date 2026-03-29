import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Profile from './Profile';
import AddMenuItemForm from '../components/Restaurant/AddMenuItemForm';
import MenuList from '../components/Restaurant/MenuList';
import RestaurantInfoForm from '../components/Restaurant/RestaurantInfoForm';
import RestaurantOrders from '../components/Restaurant/RestaurantOrders';
import RestaurantStats from '../components/Restaurant/RestaurantStats'; 

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

    // === HÀM BẬT/TẮT TRẠNG THÁI MÓN ===
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
                                style={{ width: 'auto', padding: '10px 25px', display: 'flex', alignItems: 'center', gap: '8px' }}
                            >
                                <i className="fas fa-plus"></i> Thêm món
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

            case 'manage-orders': 
                return (
                    <div className="orders-container">
                        {/* Bỏ cái nút button onClick={fetchOrders} ở đây đi vì nó nằm trong component rồi */}
                        <RestaurantOrders />
                    </div>
                );

            case 'revenue-stats': 
                return <RestaurantStats />;
            case 'res-info': 
                return <RestaurantInfoForm />;
            case 'profile': return <Profile />;

            default: return null;
        }
    };

    // === LẤY TIÊU ĐỀ ===
    const getPageTitle = () => {
        const titles = {
            'manage-menu': 'Quản lý menu',
            'add-food': editingItem ? 'Cập nhật món ăn' : 'Thêm món mới', 
            'manage-orders': 'Quản lý Đơn hàng',
            'revenue-stats': 'Thống kê Doanh thu',
            'res-info': 'Thông tin nhà hàng',
            'profile': 'Hồ sơ cá nhân'
        };
        return titles[activeTab] || 'Dashboard';
    };

    return (
        <div className="dashboard-layout">
            <aside className="sidebar">
                <div className="brand" style={{ padding: '0 10px 20px' }}>
                    <h3 style={{ color: '#28a745', display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <i className="fas fa-utensils"></i> Yummy Hub
                    </h3>
                    <p style={{ fontSize: '12px', color: '#666', fontWeight: 'bold', marginTop: '5px' }}>Nhà hàng của bạn</p>
                </div>

                <ul>
                    <li className={(activeTab === 'manage-menu' || activeTab === 'add-food') ? 'active' : ''} onClick={() => setActiveTab('manage-menu')}> 
                        <i className="fas fa-list-alt"></i> Quản lý menu
                    </li>
                    <li className={activeTab === 'manage-orders' ? 'active' : ''} onClick={() => setActiveTab('manage-orders')}>
                        <i className="fas fa-shopping-bag"></i> Đơn hàng
                    </li>
                    <li className={activeTab === 'revenue-stats' ? 'active' : ''} onClick={() => setActiveTab('revenue-stats')}>
                        <i className="fas fa-chart-pie"></i> Doanh thu
                    </li>
                    <li className={activeTab === 'res-info' ? 'active' : ''} onClick={() => setActiveTab('res-info')}>
                        <i className="fas fa-store-alt"></i> Thông tin quán
                    </li>
                    <hr style={{ margin: '15px 0', opacity: '0.1' }} />
                    <li className={activeTab === 'profile' ? 'active' : ''} onClick={() => setActiveTab('profile')}>
                        <i className="fas fa-user-cog"></i> Hồ sơ cá nhân
                    </li>
                </ul>

                <button onClick={handleLogout} className="btn-logout">
                    <i className="fas fa-sign-out-alt"></i> Đăng xuất
                </button>
            </aside>

            <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
                <header className="main-header" style={{
                    display: 'flex', 
                    justifyContent: 'space-between', 
                    alignItems: 'center',
                    padding: '15px 35px',
                    background: '#fff',
                    borderBottom: '1px solid #eee'
                }}>
                    <h2 style={{ fontSize: '20px', margin: 0, color: '#333' }}>{getPageTitle()}</h2>
                    <div className="user-profile-mini" style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <div style={{ textAlign: 'right' }}>
                            <span style={{ display: 'block', fontWeight: 'bold', fontSize: '14px' }}>{fullName}</span>
                            <span style={{ fontSize: '12px', color: '#28a745' }}>Chủ cửa hàng</span>
                        </div>
                        <div className="avatar-mini" style={{
                            width: '35px', 
                            height: '35px', 
                            background: '#28a745', 
                            color: '#fff', 
                            borderRadius: '50%', 
                            display: 'flex', 
                            alignItems: 'center', 
                            justifyContent: 'center',
                            fontWeight: 'bold'
                        }}>{avatarChar}</div>
                    </div>
                </header>

                <main className="main-content" style={{ flex: 1, padding: '30px 35px' }}>
                    <div id="content-area">
                        {renderContent()}
                    </div>
                </main>
            </div>
        </div>
    );
};

export default Restaurant;