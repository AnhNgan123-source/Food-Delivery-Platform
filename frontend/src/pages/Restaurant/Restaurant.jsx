import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import Profile from '../../components/Common/Profile';
import AddMenuItemForm from '../../components/Restaurant/AddMenuItemForm';
import RestaurantOrders from '../../components/Restaurant/RestaurantOrders';
import RestaurantStats from '../../components/Restaurant/RestaurantStats';
import MenuList from '../../components/Restaurant/MenuList';
import SockJS from 'sockjs-client'; 
import Stomp from 'stompjs';


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
    const [newOrderCount, setNewOrderCount] = useState(0);
    const stompClientRef = useRef(null);
    const isConnected = useRef(false);

    // Dùng để giữ thông tin món cần sửa
    const [editingItem, setEditingItem] = useState(null);

    // === 1. CHECK QUYỀN TRUY CẬP ===
    useEffect(() => {
        const token = localStorage.getItem('token');
        const role = localStorage.getItem('role');

        if (!token || role !== 'RESTAURANT') {
            alert("Bạn không có quyền truy cập vùng Nhà hàng!");
            navigate('/');
            return;  // return () => {}; bắt buộc phải có hàm return
            //gd mounting là có hàm return, gd update là toàn bộ hàm useeffect, 
        }

        const storedName = localStorage.getItem('username');
        if (storedName) {
            setFullName(storedName);
            setAvatarChar(storedName.charAt(0).toUpperCase());
        }

    }, [navigate]);// -> navigate là dependency: chạy lại nếu navigate thay đổi

    // === LOAD MENU KHI MỞ TAB ===
    useEffect(() => {
        if (activeTab === 'manage-menu') {
            fetchMenuData();
        }else if (activeTab === 'new-orders' || activeTab === 'order-status') { }
    }, [activeTab]);

    //Logic lắng nghe Đơn hàng Real-time
    useEffect(() => {
    const resId = localStorage.getItem('resId');
    const token = localStorage.getItem('token');
    
    // Nếu chưa đăng nhập hoặc không có resId thì không kết nối
    if (!resId || !token) return;

    const socket = new SockJS('http://localhost:8080/ws-delivery');
    const client = Stomp.over(socket);
    client.debug = null; 

    client.connect({}, () => {
        console.log(">>> [Restaurant] WebSocket đã thông!");
        isConnected.current = true;
        stompClientRef.current = client;

        client.subscribe(`/topic/restaurant/${resId}`, (message) => {
            if (message.body.startsWith("NEW_ORDER")) {
                setNewOrderCount(prev => prev + 1);
                // Alert này sẽ nhắc có đơn mới dù đang ở bất kỳ đâu
                alert("Ngân ơi! Có đơn hàng mới nổ kìa!");
            }
        });
    }, (err) => {
        console.error("Lỗi kết nối WebSocket nhà hàng:", err);
        isConnected.current = false;
    });
   return () => {
        if (isConnected.current && stompClientRef.current) {
            stompClientRef.current.disconnect(() => {
                console.log("<<< [Restaurant] Đã đóng kết nối an toàn.");
                isConnected.current = false;
            });
        }
    };
    }, []); 


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


    // // HÀM LẤY DANH SÁCH ĐƠN HÀNG
    // const fetchOrders = async () => {
    // const token = localStorage.getItem('token');
    // const resId = localStorage.getItem('resId');
    // try {
    //     const response = await fetch(`http://localhost:8080/api/v1/orders/restaurant/${resId}`, {
    //         headers: { 'Authorization': 'Bearer ' + token }
    //     });
    //     const result = await response.json();
    //     if (result.status === 'success') {
    //         setOrders(result.data);
    //     }
    // } catch (error) { console.error("Lỗi tải đơn hàng:", error); }
    // };

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

            case 'new-orders':
            case 'order-status': // HIỆN CÁC ĐƠN SAU KHI DUYỆT 
                return <RestaurantOrders key={newOrderCount} />;
            case 'revenue-stats': 
                return <RestaurantStats />
            case 'manage-orders': 
                return (
                    <div className="orders-container">
                        {/* Bỏ cái nút button onClick={fetchOrders} ở đây đi vì nó nằm trong component rồi */}
                        <RestaurantOrders />
                    </div>
                );
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
        {/* --- 1. SIDEBAR (THANH ĐIỀU HƯỚNG BÊN TRÁI) --- */}
        <aside className="sidebar">
            <div className="brand">
                <h3>Yummy Hub</h3>
                <p style={{ fontSize: '12px', color: '#28a745', fontWeight: 'bold' }}>Nhà hàng của bạn</p>
            </div>

            <ul>
                {/* Tab Quản lý Menu */}
                <li className={(activeTab === 'manage-menu' || activeTab === 'add-food') ? 'active' : ''} 
                    onClick={() => setActiveTab('manage-menu')}> 
                    <i className="fas fa-utensils"></i> Quản lý menu
                </li>

                {/*Tab Đơn hàng mới - Có đốm đỏ REALTIME */}
                <li className={activeTab === 'new-orders' ? 'active' : ''} 
                    onClick={() => {
                        setActiveTab('new-orders');
                        setNewOrderCount(0); // Bấm vào xem thì xóa số thông báo đi
                    }}
                    style={{ position: 'relative' }} // Để đốm đỏ nằm đè lên
                >
                    <i className="fas fa-shopping-bag"></i> Đơn hàng mới
                    
                    {/* Nếu có đơn mới (từ WebSocket bắn về) thì hiện số lượng ở đây */}
                    {newOrderCount > 0 && (
                        <span className="order-badge-notify">{newOrderCount}</span>
                    )}
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

        {/* --- 2. MAIN CONTENT (NỘI DUNG CHÍNH BÊN PHẢI) --- */}
        <main className="main-content">
            <header className="main-header">
                <div>
                    {/* Tiêu đề tự động đổi theo Tab */}
                    <h2>{getPageTitle()}</h2>
                </div>
                <div className="user-profile-mini">
                    <span>{fullName}</span>
                    <div className="avatar-mini">{avatarChar}</div>
                </div>
            </header>

            {/* Nơi hiển thị nội dung chi tiết của từng chức năng */}
            <div id="content-area" style={{ padding: '20px' }}>
                {renderContent()}
            </div>
        </main>
    </div>
);
}
export default Restaurant;