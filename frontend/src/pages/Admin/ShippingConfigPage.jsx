import React, { useState, useEffect } from 'react';
import adminApi from '../../api/adminApi';
import ShippingConfig from '../../components/Admin/Shipping/ShippingConfig';

const ShippingConfigPage = () => {
    const [shippingFees, setShippingFees] = useState([]);
    const [loading, setLoading] = useState(false);

    const fetchFees = async () => {
        setLoading(true);
        try {
            const res = await adminApi.getShippingConfigs(); 
            const data = res?.data?.data || res?.data || res;
            setShippingFees(Array.isArray(data) ? data : []);
        } catch (err) {
            console.error("Lỗi lấy phí ship:", err);
        } finally {
            setLoading(false);
        }
    };

    const handleSave = async () => {
        try {
            await adminApi.updateShippingConfigs(shippingFees); 
            alert("Đã cập nhật biểu phí vận chuyển mới sếp ơi! 🚚");
            fetchFees();
        } catch (err) {
            alert("Lỗi lưu biểu phí rồi sếp!");
        }
    };

    useEffect(() => {
        fetchFees();
    }, []);

    return (
        <div style={{ padding: '20px' }}>
            <ShippingConfig 
                shippingFees={shippingFees} 
                setShippingFees={setShippingFees} 
                onSave={handleSave}
                loading={loading}
            />
        </div>
    );
};

export default ShippingConfigPage;