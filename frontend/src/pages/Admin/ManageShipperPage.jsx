import React, { useState, useEffect } from 'react';
import adminApi from '../../api/adminApi'; 
import ManageShipper from '../../components/Admin/Shipper/ManageShipper';

const ManageShipperPage = () => {
    const [shippers, setShippers] = useState([]);
    const [restaurants, setRestaurants] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [formData, setFormData] = useState({ shipperName: '', phone: '', vehicleNo: '', resId: '' });
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        fetchShippers();
        fetchRestaurants();
    }, []);

    const fetchShippers = async () => {
        setLoading(true);
        try {
            const res = await adminApi.getAllShippers(); // Giả định adminApi đã có hàm này
            const data = res?.data || res;
            if (data?.status === "success") {
                setShippers(data.data || []);
            } else {
                setShippers(Array.isArray(data) ? data : []);
            }
        } catch (err) {
            console.error("Lỗi lấy ds shipper:", err);
            alert("Không lấy được danh sách tài xế sếp ơi!");
        } finally {
            setLoading(false);
        }
    };

    const fetchRestaurants = async () => {
        try {
            const res = await adminApi.getAllRestaurants();
            const data = res?.data || res;
            setRestaurants(Array.isArray(data) ? data : (data.data || []));
        } catch (err) {
            console.error("Lỗi lấy ds nhà hàng:", err);
        }
    };

    const handleSave = async () => {
        if (!formData.shipperName || !formData.resId) return alert("Vui lòng điền tên và chọn nhà hàng!");

        try {
            const payload = {
                shipperName: formData.shipperName,
                phone: formData.phone,
                vehicleNo: formData.vehicleNo,
                restaurant: { resId: parseInt(formData.resId) }
            };
            
            await adminApi.createShipper(payload);
            alert("Thêm tài xế mới thành công!");
            setShowModal(false);
            fetchShippers();
            setFormData({ shipperName: '', phone: '', vehicleNo: '', resId: '' });
        } catch (err) {
            console.error(err);
            alert("Lỗi thêm tài xế rồi sếp!");
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm("Xóa tài xế này khỏi hệ thống?")) return;
        try {
            await adminApi.deleteShipper(id); 
            alert("Đã xóa xong!");
            fetchShippers();
        } catch (err) {
            console.error(err);
            alert("Xóa không được sếp ơi.");
        }
    };

    return (
        <div style={{ padding: '20px' }}>
            <ManageShipper 
                shippers={shippers}
                restaurants={restaurants}
                showModal={showModal}
                setShowModal={setShowModal}
                formData={formData}
                setFormData={setFormData}
                onSave={handleSave}
                onDelete={handleDelete}
                onRefresh={fetchShippers}
                loading={loading}
            />
        </div>
    );
};

export default ManageShipperPage;