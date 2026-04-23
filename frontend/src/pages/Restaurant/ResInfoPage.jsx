import React, { useState, useEffect } from 'react';
import restaurantApi from '../../api/restaurantApi';
import RestaurantInfoForm from '../../components/Restaurant/ResInfo/RestaurantInfoForm';

const ResInfoPage = () => {
    const [restaurant, setRestaurant] = useState(null);
    const [isEditing, setIsEditing] = useState(false);
    const [loading, setLoading] = useState(true);
    const [formData, setFormData] = useState({ resName: '', resAddress: '', resImage: '' });

    const ownerId = localStorage.getItem('userId') || localStorage.getItem('id');

    useEffect(() => {
        if (ownerId) fetchRestaurantData();
    }, [ownerId]);

    const fetchRestaurantData = async () => {
        try {
            setLoading(true);
            const data = await restaurantApi.getRestaurantByOwner(ownerId);
            setRestaurant(data);
            setFormData({ 
                resName: data.resName || '', 
                resAddress: data.resAddress || '', 
                resImage: data.resImage || '' 
            });
        } catch (error) {
            console.error("Lỗi lấy data:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleFileUpload = async (e) => {
        const file = e.target.files[0];
        if (!file) return;
        try {
            const fileName = await restaurantApi.uploadResImage(file);
            setFormData(prev => ({ ...prev, resImage: fileName }));
            alert("Ảnh đã tải lên! Nhấn Lưu để xác nhận.");
        } catch (error) {
            alert("Lỗi upload ảnh!");
        }
    };

    const handleSave = async () => {
        if (!restaurant?.resId) return alert("Thiếu ID nhà hàng!");

        try {
            // 1. Gửi lệnh update lên DB Restaurant
            await restaurantApi.updateRestaurant(restaurant.resId, formData);

            // 2. CẬP NHẬT LOCALSTORAGE (Để đồng bộ giao diện toàn trang)
            // Lấy object user hiện tại ra
            const currentUser = JSON.parse(localStorage.getItem('user') || '{}');
            
            // Cập nhật các thông tin mới vào object đó
            const updatedUser = {
                ...currentUser,
                resName: formData.resName,
                resImage: formData.resImage
            };
            
            // Lưu ngược lại vào localStorage
            localStorage.setItem('user', JSON.stringify(updatedUser));

            // 3. Thông báo và reset giao diện
            alert("Cập nhật thông tin và đồng bộ hệ thống thành công!");
            setIsEditing(false);
            fetchRestaurantData();

            // Mẹo: Nếu ông có dùng Context API hoặc Redux, hãy gọi dispatch ở đây.
            // Nếu không, ông có thể dùng lệnh này để load lại các component khác (như Sidebar):
            window.dispatchEvent(new Event("storage")); 

        } catch (error) {
            console.error("LỖI KHI LƯU:", error);
            alert("Lưu thất bại. Kiểm tra lại kết nối.");
        }
    };

    return (
        <RestaurantInfoForm 
            restaurant={restaurant} 
            isEditing={isEditing} 
            setIsEditing={setIsEditing}
            loading={loading} 
            formData={formData} 
            setFormData={setFormData}
            onSave={handleSave} 
            onFileUpload={handleFileUpload}
        />
    );
};

export default ResInfoPage;