import React, { useState, useEffect } from 'react';
import adminApi from '../../api/adminApi';
import ManageRestaurant from '../../components/Admin/ManageRestaurant/ManageRestaurant';

const ManageResPage = () => {
    const [restaurants, setRestaurants] = useState([]);
    const [loading, setLoading] = useState(false);

    const fetchRestaurants = async () => {
        setLoading(true);
        try {
            const res = await adminApi.getAllRestaurants();
            // Xử lý linh hoạt các kiểu response từ Axios
            const data = res?.data || res;
            
            // Nếu data là object có field data bên trong (từ Backend bọc thêm)
            if (data?.data && Array.isArray(data.data)) {
                setRestaurants(data.data);
            } else {
                setRestaurants(Array.isArray(data) ? data : []);
            }
        } catch (err) {
            console.error("Lỗi lấy danh sách nhà hàng:", err);
            alert("Lỗi kết nối API lấy nhà hàng!");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchRestaurants();
    }, []);

    const handleToggleStatus = async (resItem) => {
        const newStatus = resItem.isActive === 1 ? 0 : 1;
        const action = newStatus === 1 ? "Mở khóa" : "Khóa";
        
        if (window.confirm(`${action} nhà hàng ${resItem.resName} hả sếp?`)) {
            try {
                await adminApi.updateRestaurant(resItem.resId, { 
                    ...resItem, 
                    isActive: newStatus 
                });
                alert(`${action} thành công!`);
                fetchRestaurants(); 
            } catch (err) {
                alert("Không đổi trạng thái được sếp ơi!");
            }
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm("Xóa là mất luôn đó, sếp chắc chưa?")) {
            try {
                await adminApi.deleteRestaurant(id);
                alert("Đã xóa vĩnh viễn!");
                fetchRestaurants();
            } catch (err) {
                alert("Lỗi xóa rồi sếp.");
            }
        }
    };

    return (
        <div style={{ padding: '20px' }}>
            <ManageRestaurant 
                list={restaurants} 
                onUpdateStatus={handleToggleStatus} 
                onDelete={handleDelete}
                onRefresh={fetchRestaurants}
                loading={loading}
            />
        </div>
    );
};

export default ManageResPage;