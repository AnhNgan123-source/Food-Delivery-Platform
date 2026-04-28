import React, { useState, useEffect, useCallback } from 'react';
import restaurantApi from '../../api/restaurantApi';
import RestaurantInfoForm from '../../components/Restaurant/ResInfo/RestaurantInfoForm';

const ResInfoPage = () => {
    const [restaurant, setRestaurant] = useState(null);
    const [reviews, setReviews] = useState([]); // State lưu danh sách reviews
    const [isEditing, setIsEditing] = useState(false);
    const [loading, setLoading] = useState(true);
    const [formData, setFormData] = useState({ resName: '', resAddress: '', resImage: '' });

    // Lấy ownerId từ localStorage
    const ownerId = localStorage.getItem('userId') || localStorage.getItem('id');

    /**
     * LOGIC CHÍNH: Lấy tất cả dữ liệu liên quan đến nhà hàng
     */
    const fetchFullData = useCallback(async () => {
        try {
            setLoading(true);
            
            // Bước 1: Lấy thông tin cơ bản của nhà hàng bằng ownerId
            const resData = await restaurantApi.getRestaurantByOwner(ownerId);
            
            if (resData) {
                setRestaurant(resData);
                setFormData({ 
                    resName: resData.resName || '', 
                    resAddress: resData.resAddress || '', 
                    resImage: resData.resImage || '' 
                });

                // Bước 2: Khi đã có resId, lấy tiếp Reviews và Average Rating (chạy song song)
                if (resData.resId) {
                    const [reviewsList, avgData] = await Promise.all([
                        restaurantApi.getReviewsByResId(resData.resId),
                        restaurantApi.getAverageRating(resData.resId)
                    ]);

                    if (reviewsList) setReviews(reviewsList);
                    
                    // Cập nhật rating vào object restaurant để Form hiển thị
                    if (avgData && avgData.average !== undefined) {
                        setRestaurant(prev => ({
                            ...prev,
                            ratingAvg: avgData.average
                        }));
                    }
                }
            }
        } catch (error) {
            console.error("Lỗi lấy dữ liệu tổng hợp:", error);
        } finally {
            setLoading(false);
        }
    }, [ownerId]);

    useEffect(() => {
        if (ownerId) {
            fetchFullData();
        }
    }, [ownerId, fetchFullData]);

    /**
     * XỬ LÝ UPLOAD ẢNH
     */
    const handleFileUpload = async (e) => {
        const file = e.target.files[0];
        if (!file) return;
        try {
            const fileName = await restaurantApi.uploadResImage(file);
            setFormData(prev => ({ ...prev, resImage: fileName }));
            alert("Ảnh đã tải lên! Nhấn Lưu để xác nhận.");
        } catch (error) {
            console.warn("Lỗi upload ảnh:", error);
            alert("Lỗi upload ảnh!");
        }
    };

    /**
     * XỬ LÝ LƯU THÔNG TIN
     */
    const handleSave = async () => {
        if (!restaurant?.resId) return alert("Thiếu ID nhà hàng!");

        try {
            // 1. Cập nhật DB
            await restaurantApi.updateRestaurant(restaurant.resId, formData);

            // 2. Đồng bộ LocalStorage
            const currentUser = JSON.parse(localStorage.getItem('user') || '{}');
            const updatedUser = {
                ...currentUser,
                resName: formData.resName,
                resImage: formData.resImage
            };
            localStorage.setItem('user', JSON.stringify(updatedUser));

            // 3. Thông báo và làm mới dữ liệu
            alert("Cập nhật hồ sơ thành công!");
            setIsEditing(false);
            fetchFullData(); // Gọi lại hàm tổng hợp để cập nhật UI

            // Kích hoạt event để các component khác (Sidebar/Header) cập nhật theo
            window.dispatchEvent(new Event("storage")); 

        } catch (error) {
            console.error("LỖI KHI LƯU:", error);
            alert("Lưu thất bại. Vui lòng thử lại.");
        }
    };

    return (
        <RestaurantInfoForm 
            restaurant={restaurant} 
            reviews={reviews} // Truyền list reviews vào để hiện "Latest Review"
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