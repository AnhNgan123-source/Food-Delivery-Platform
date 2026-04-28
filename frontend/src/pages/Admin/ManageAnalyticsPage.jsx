import React, { useState, useEffect } from 'react';
import adminApi from '../../api/adminApi'; 
import AdminAnalytics from '../../components/Admin/Analytics/AdminAnalytics';

const ManageAnalyticsPage = () => {
    const [stats, setStats] = useState({
        totalRevenue: 0, totalOrders: 0, totalUsers: 0, activeRes: 0
    });
    const [revenueData, setRevenueData] = useState([]);
    const [topRestaurants, setTopRestaurants] = useState([]);
    const [isLoading, setIsLoading] = useState(false);

    const fetchData = async () => {
        setIsLoading(true);
        try {
            const [overviewRes, historyRes, topRes] = await Promise.all([
                adminApi.getStatsOverview(),
                adminApi.getRevenueHistory(),
                adminApi.getTopPerformers()
            ]);

            if (overviewRes) setStats(overviewRes); 
            if (historyRes) setRevenueData(historyRes);
            if (topRes) setTopRestaurants(topRes);

        } catch (error) {
            console.error("Lỗi lấy dữ liệu rồi:", error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    return (
        <div style={{ padding: '20px' }}>
            <AdminAnalytics 
                stats={stats}
                revenueData={revenueData}
                topRestaurants={topRestaurants}
                isLoading={isLoading}
                onRefresh={fetchData}
            />
        </div>
    );
};

export default ManageAnalyticsPage;