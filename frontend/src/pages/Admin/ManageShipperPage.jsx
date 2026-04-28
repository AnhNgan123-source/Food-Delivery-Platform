import React, { useState, useEffect } from 'react';
import adminApi from '../../api/adminApi'; 
import ManageShipper from '../../components/Admin/Shipper/ManageShipper';
import SockJS from 'sockjs-client';
import { Stomp } from '@stomp/stompjs';

const ManageShipperPage = () => {
    const [shippers, setShippers] = useState([]);
    const [restaurants, setRestaurants] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [formData, setFormData] = useState({ shipperName: '', phone: '', vehicleNo: '', resId: '' });
    const [loading, setLoading] = useState(false);
    const [isEditMode, setIsEditMode] = useState(false);
    const [editingId, setEditingId] = useState(null);
    

    // --- 1. LẤY DỮ LIỆU & KẾT NỐI WEBSOCKET ---
    useEffect(() => {
        fetchShippers();
        fetchRestaurants();

        const socket = new SockJS('http://localhost:8080/ws-delivery');
        const stompClient = Stomp.over(() => socket);
        stompClient.debug = () => {}; 

        stompClient.connect({}, () => {
            console.log("Admin đã sẵn sàng nhận cập nhật Shipper!");
            stompClient.subscribe('/topic/admin/shippers', (message) => {
                const updatedShipper = JSON.parse(message.body);
                setShippers(prevList => {
                    // Nếu shipper đã có trong bảng thì update, chưa có thì thêm vào đầu
                    const isExist = prevList.find(s => s.shipperId === updatedShipper.shipperId);
                    if (isExist) {
                        return prevList.map(s => s.shipperId === updatedShipper.shipperId ? updatedShipper : s);
                    }
                    return [updatedShipper, ...prevList];
                });
            });
        });

        return () => { if (stompClient && stompClient.connected) stompClient.disconnect(); };
    }, []);

    const fetchShippers = async () => {
        setLoading(true);
        try {
            const data = await adminApi.getAllShippers(); 
            setShippers(Array.isArray(data) ? data : []);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const fetchRestaurants = async () => {
        try {
            const data = await adminApi.getAllRestaurants();
            setRestaurants(Array.isArray(data) ? data : (data.data || []));
        } catch (err) {
            console.error(err);
        }
    };

    const handleEdit = (shipper) => {
        setIsEditMode(true);
        setEditingId(shipper.shipperId);
        setFormData({
            shipperName: shipper.shipperName,
            phone: shipper.phone,
            vehicleNo: shipper.vehicleNo,
            resId: shipper.restaurant?.resId.toString() || ""
        });
        setShowModal(true);
    };

    const handleSave = async () => {
        if (!formData.shipperName || !formData.resId) return alert("Vui lòng điền đủ thông tin!");

        const payload = {
            shipperName: formData.shipperName,
            phone: formData.phone,
            vehicleNo: formData.vehicleNo,
            restaurant: { resId: parseInt(formData.resId) }
        };

        try {
            if (isEditMode) {
                await adminApi.updateShipper(editingId, payload);
                alert("Cập nhật thành công!");
            } else {
                await adminApi.createShipper(payload);
                alert("Thêm mới thành công!");
            }
            closeModal();
            fetchShippers();
        } catch (err) {
            alert("Lỗi lưu dữ liệu!");
        }
    };

    const closeModal = () => {
        setShowModal(false);
        setIsEditMode(false);
        setEditingId(null);
        setFormData({ shipperName: '', phone: '', vehicleNo: '', resId: '' });
    };

    const handleDelete = async (id) => {
        if (!window.confirm("Bạn chắc chắn muốn xóa tài xế này không ?")) return;
        try {
            await adminApi.deleteShipper(id); 
            fetchShippers();
        } catch (err) {
            alert("Xóa không được!");
        }
    };

    return (
        <ManageShipper 
            shippers={shippers}
            restaurants={restaurants}
            showModal={showModal}
            setShowModal={setShowModal}
            formData={formData}
            setFormData={setFormData}
            onSave={handleSave}
            onEdit={handleEdit}
            onDelete={handleDelete}
            onClose={closeModal}
            isEditMode={isEditMode}
            loading={loading}
        />
    );
};

export default ManageShipperPage;