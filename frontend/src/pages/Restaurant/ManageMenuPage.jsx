import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import restaurantApi from '../../api/restaurantApi';
import MenuList from '../../components/Restaurant/Menu/MenuList';
import styles from '../../components/Restaurant/Menu/MenuManagement.module.css';

const ManageMenuPage = () => {
    const navigate = useNavigate();
    const [menuItems, setMenuItems] = useState([]);
    const [filteredMenu, setFilteredMenu] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const resId = localStorage.getItem('resId');

    const fetchMenu = useCallback(async () => {
        if (!resId) return;
        setIsLoading(true);
        try {
            const data = await restaurantApi.getMenuByResId(resId);
            // Đảm bảo data là array
            const menuData = Array.isArray(data) ? data : (data.data || []);
            setMenuItems(menuData);
            setFilteredMenu(menuData);
        } catch (error) {
            console.error("Lỗi tải menu:", error);
        } finally {
            setIsLoading(false);
        }
    }, [resId]);

    useEffect(() => {
        fetchMenu();
    }, [fetchMenu]);

    const handleToggleStatus = async (foodId) => {
        try {
            await restaurantApi.toggleMenuStatus(foodId);
            fetchMenu(); 
        } catch (error) {
            console.error("Lỗi toggle:", error);
            alert("Không thể cập nhật trạng thái");
        }
    };

    const handleDelete = async (foodId) => {
        if (window.confirm("Bạn có chắc chắn muốn xóa món này? Ảnh trong hệ thống cũng sẽ bị xóa vĩnh viễn.")) {
            try {
                await restaurantApi.deleteMenuItem(foodId);
                fetchMenu();
            } catch (error) {
                console.error("Lỗi delete:", error);
                alert("Lỗi khi xóa món ăn");
            }
        }
    };

    // --- SỬA HÀM NÀY ĐỂ TRUYỀN DATA SANG FORM ---
    const handleEdit = (food) => {
        const foodId = food.itemId || food.item_id || food.id;
        // Truyền kèm state để trang AddMenuItemForm nhận được dữ liệu ngay
        navigate(`/restaurant/edit-food/${foodId}`, { state: { foodData: food } });
    };

    useEffect(() => {
        const results = menuItems.filter(item =>
            (item.item_name || item.itemName || '').toLowerCase().includes(searchTerm.toLowerCase())
        );
        setFilteredMenu(results);
    }, [searchTerm, menuItems]);

    return (
        <div className={styles.container}>
            <div className={styles.actionBar}>
                <div className={styles.searchWrapper}>
                    <i className="fas fa-search"></i>
                    <input 
                        type="text" 
                        className={styles.searchInput}
                        placeholder="Tìm kiếm món ăn trong thực đơn..." 
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>

                <button 
                    className={styles.btnAddMain}
                    onClick={() => navigate('/restaurant/add-food')}
                >
                    <i className="fas fa-plus"></i> Thêm món mới
                </button>
            </div>

            <div className={styles.summaryText}>
                Tổng cộng: <strong>{filteredMenu.length}</strong> món ăn
            </div>

            {isLoading ? (
                <div className={styles.loaderSection}>
                    <i className="fas fa-circle-notch fa-spin"></i> Đang tải thực đơn...
                </div>
            ) : (
                <MenuList 
                    foods={filteredMenu} 
                    onToggleStatus={handleToggleStatus}
                    onDelete={handleDelete}
                    onEdit={handleEdit}
                />
            )}
        </div>
    );
};

export default ManageMenuPage;