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
            // Axios trả về data nằm trong res.data
            const data = res?.data || res;
            if (data?.status === "success" || Array.isArray(data)) {
                setRestaurants(Array.isArray(data) ? data : data.data);
            }
        } catch (err) {
            console.error("Lỗi lấy danh sách:", err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { fetchRestaurants(); }, []);

    // Logic lưu thông tin từ Modal (Nhận data từ Component con)
    const handleSaveEdit = async (updatedData) => {
        try {
            setLoading(true);
            await adminApi.updateRestaurant(updatedData.resId, updatedData);
            alert("Cập nhật hệ thống thành công!!!");
            fetchRestaurants(); 
        } catch (err) {
            alert("Lỗi khi cập nhật dữ liệu!");
        } finally {
            setLoading(false);
        }
    };

    const handleToggleStatus = async (resItem) => {
        const newStatus = resItem.isActive === 1 ? 0 : 1;
        if (window.confirm(`Bạn chắc chắn muốn thay đổi trạng thái của ${resItem.resName}?`)) {
            try {
                await adminApi.updateRestaurant(resItem.resId, { ...resItem, isActive: newStatus });
                fetchRestaurants();
            } catch (err) { alert("Lỗi đổi trạng thái!"); }
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm("Nhà hàng sẽ được xóa vĩnh viễn?")) {
            try {
                await adminApi.deleteRestaurant(id);
                fetchRestaurants();
            } catch (err) { alert("Lỗi xóa dữ liệu!"); }
        }
    };

    return (
        <div style={{ padding: '20px' }}>
            <ManageRestaurant 
                list={restaurants} 
                onUpdateStatus={handleToggleStatus} 
                onDelete={handleDelete}
                onSaveEdit={handleSaveEdit}
                onRefresh={fetchRestaurants}
                loading={loading}
            />
        </div>
    );
};

export default ManageResPage;