import React, { useState, useEffect } from 'react';
import restaurantApi from '../../api/restaurantApi';
import RestaurantStats from '../../components/Restaurant/Stats/RestaurantStats';

const RestaurantStatsPage = () => {
    const [stats, setStats] = useState({ totalRevenue: 0, totalOrders: 0, successRate: '0%', cancelledOrders: 0 });
    const [chartData, setChartData] = useState([]);
    const [topItems, setTopItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const resId = localStorage.getItem('resId') || JSON.parse(localStorage.getItem('user'))?.resId;

    useEffect(() => {
        const fetchStats = async () => {
            if (!resId || resId === 'null' || resId === 'undefined') {
                console.error("Không tìm thấy resId. Đang đợi hoặc kiểm tra lại login...");
                return; 
            }

            setLoading(true);
            try {
                // Gọi API
                const response = await restaurantApi.getRestaurantStats(resId);
                
                // Xử lý data trả về (Lưu ý: axios interceptor của ông trả về data trực tiếp)
                const data = response.data || response;
                const resultData = data.status === "success" ? data.data : data;

                if (resultData) {
                    const summary = resultData.summary || {};
                    const total = summary.totalOrders || 0;
                    const cancelled = summary.cancelledOrders || 0;
                    
                    setStats({
                        totalRevenue: summary.totalRevenue || 0,
                        totalOrders: total,
                        cancelledOrders: cancelled,
                        successRate: total > 0 ? Math.round(((total - cancelled) / total) * 100) + '%' : '0%'
                    });

                    setChartData((resultData.chart || []).map(item => ({ 
                        name: item.name, 
                        revenue: item.revenue 
                    })));
                    
                    setTopItems((resultData.topItems || []).map((item, index) => ({
                        ...item,
                        color: ['#28a745', '#ffc107', '#dc3545', '#007bff', '#6f42c1'][index % 5]
                    })));
                }
            } catch (error) {
                console.error("Lỗi API Stats:", error);
                if(error.response?.status === 403) {
                    alert("Backend đang chặn quyền truy cập Thống kê (403). Kiểm tra SecurityConfig!");
                }
            } finally {
                setLoading(false);
            }
        };

        fetchStats();
    }, [resId]);

    return (
        <RestaurantStats 
            stats={stats} 
            chartData={chartData} 
            topItems={topItems} 
            loading={loading} 
        />
    );
};

export default RestaurantStatsPage;