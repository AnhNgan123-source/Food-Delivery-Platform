import React, { useState, useEffect } from 'react';
import adminApi from '../../api/adminApi';
import ApproveRestaurant from '../../components/Admin/ApproveRestaurant/ApproveRestaurant';

const ApproveResPage = () => {
    const [pendingList, setPendingList] = useState([]);
    const [loading, setLoading] = useState(false);

const fetchPendingRestaurants = async () => {
    setLoading(true);
    try {
        const res = await adminApi.getAllRestaurants();
        console.log("Dữ liệu thô từ API:", res);

        const allData = Array.isArray(res) ? res : (res?.data || []); 
        
        console.log("Dữ liệu thực tế để xử lý:", allData);

        const pending = allData.filter(item => item.isActive === 0);
        
        setPendingList(pending);
    } catch (err) {
        console.error("Lỗi lấy danh sách đợi duyệt:", err);
    } finally {
        setLoading(false);
    }
};

    useEffect(() => {
        fetchPendingRestaurants();
    }, []);

    const handleApprove = async (resItem, newStatus) => {
        if (window.confirm(`Bạn có yêu cầu phê duyệt từ nhà hàng ${resItem.resName} ?`)) {
            try {
                await adminApi.updateRestaurant(resItem.resId, {
                    ...resItem,
                    isActive: newStatus
                });
                alert("Đã phê duyệt thành công!");
                fetchPendingRestaurants(); // Refresh lại danh sách
            } catch (err) {
                alert("Phê duyệt lỗi rồi!");
            }
        }
    };

    return (
        <div style={{ padding: '20px' }}>
            <ApproveRestaurant 
                list={pendingList}
                onUpdateStatus={handleApprove}
                onRefresh={fetchPendingRestaurants}
            />
            {loading && <p style={{ textAlign: 'center', marginTop: '10px' }}>Đang tải...</p>}
        </div>
    );
};

export default ApproveResPage;