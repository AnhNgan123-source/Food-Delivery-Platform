import React, { useState, useEffect } from 'react';
import adminApi from '../../api/adminApi'; // Dùng hàng xịn sếp đã bọc
import ManageVoucher from '../../components/Admin/Voucher/ManageVoucher';

const ManageVoucherPage = () => {
    const [vouchers, setVouchers] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [newVoucher, setNewVoucher] = useState({
        code: '', description: '', discountType: 'fixed_amount',
        discountValue: 0, maxDiscountAmount: 0, minOrderValue: 0,
        usageLimit: 100, endDate: '', isActive: 1
    });

    const fetchVouchers = async () => {
        setIsLoading(true);
        try {
            const res = await adminApi.getAllVouchers();
            const data = res.data || res; 
            if (data.status === "success" || Array.isArray(data)) {
                setVouchers(Array.isArray(data) ? data : data.data);
            }
        } catch (error) {
            console.error("Lỗi lấy voucher:", error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchVouchers();
    }, []);

    const handleCreate = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        const payload = {
            ...newVoucher,
            discountValue: Number(newVoucher.discountValue),
            usageLimit: Number(newVoucher.usageLimit),
            // Format ngày cho khớp với Backend
            endDate: newVoucher.endDate ? `${newVoucher.endDate}T23:59:59` : null
        };

        try {
            // Dùng adminApi thay vì fetch
            const res = await adminApi.createVoucher(payload);
            if (res) {
                alert("Kích hoạt chiến dịch thành công! 🚀");
                setShowModal(false);
                fetchVouchers();
                // Reset form
                setNewVoucher({ code: '', description: '', discountType: 'fixed_amount', discountValue: 0, maxDiscountAmount: 0, minOrderValue: 0, usageLimit: 100, endDate: '', isActive: 1 });
            }
        } catch (error) {
            alert("Lỗi khi tạo Voucher sếp ơi!");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div style={{ padding: '20px' }}>
            <ManageVoucher 
                vouchers={vouchers}
                showModal={showModal}
                setShowModal={setShowModal}
                isLoading={isLoading}
                newVoucher={newVoucher}
                setNewVoucher={setNewVoucher}
                onCreate={handleCreate}
                onRefresh={fetchVouchers}
            />
        </div>
    );
};

export default ManageVoucherPage;