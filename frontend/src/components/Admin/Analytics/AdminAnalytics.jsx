import React, { useState, useEffect } from 'react';
import { 
    LineChart, Line, AreaChart, Area, XAxis, YAxis, CartesianGrid, 
    Tooltip, ResponsiveContainer, BarChart, Bar, Cell 
} from 'recharts';

const AdminAnalytics = () => {
    const [stats, setStats] = useState({
        totalRevenue: 0,
        totalOrders: 0,
        totalUsers: 0,
        activeRes: 0
    });
    const [revenueData, setRevenueData] = useState([]);
    const [topRestaurants, setTopRestaurants] = useState([]);
    const [loading, setLoading] = useState(true);

    const token = localStorage.getItem('token');

    // Chạy ngay khi component mounted
    useEffect(() => {
        fetchAllData();
    }, []);

    const fetchAllData = async () => {
        setLoading(true);
        try {
            const headers = { "Authorization": `Bearer ${token}` };

            // 1. Fetch Overview Stats
            const overviewRes = await fetch('http://localhost:8080/api/v1/admin/stats/overview', { headers });
            const overviewJson = await overviewRes.json();
            
            // 2. Fetch Chart Data (Revenue over time)
            const chartRes = await fetch('http://localhost:8080/api/v1/admin/stats/revenue-history', { headers });
            const chartJson = await chartRes.json();

            // 3. Fetch Top 5 Restaurants
            const topRes = await fetch('http://localhost:8080/api/v1/admin/stats/top-performers', { headers });
            const topJson = await topRes.json();

            if (overviewJson.status === "success") setStats(overviewJson.data);
            if (chartJson.status === "success") setRevenueData(chartJson.data);
            if (topJson.status === "success") setTopRestaurants(topJson.data);

        } catch (error) {
            console.error("Lỗi đồng bộ dữ liệu báo cáo:", error);
        } finally {
            setLoading(false);
        }
    };

    // Style nhanh
    const cardStyle = {
        background: '#fff',
        padding: '24px',
        borderRadius: '20px',
        boxShadow: '0 10px 30px rgba(0,0,0,0.03)',
        border: '1px solid #f0f0f0'
    };

    if (loading) return (
        <div style={{ display: 'flex', height: '100vh', alignItems: 'center', justifyContent: 'center', fontSize: '18px', fontWeight: 600, color: '#666' }}>
            <i className="fas fa-spinner fa-spin" style={{ marginRight: '10px' }}></i> Đang tổng hợp dữ liệu thời gian thực...
        </div>
    );

    return (
        <div style={{ padding: '40px', background: '#fafafa', minHeight: '100vh', fontFamily: "'Inter', sans-serif" }}>
            
            {/* Header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '40px' }}>
                <div>
                    <h1 style={{ margin: 0, fontSize: '32px', fontWeight: 900, color: '#1a1a1a' }}>Trung tâm Phân tích</h1>
                    <p style={{ margin: '8px 0 0 0', color: '#888' }}>Theo dõi sức khỏe hệ thống Food Delivery của sếp</p>
                </div>
                <button 
                    onClick={fetchAllData}
                    style={{ background: '#000', color: '#fff', border: 'none', padding: '12px 24px', borderRadius: '12px', fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px' }}
                >
                    <i className="fas fa-redo-alt"></i> Cập nhật
                </button>
            </div>

            {/* Stats Grid */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '24px', marginBottom: '40px' }}>
                {[
                    { title: 'Doanh thu thực', value: `${(stats.totalRevenue || 0).toLocaleString()}đ`, icon: 'fa-wallet', color: '#10b981' },
                    { title: 'Tổng đơn hàng', value: stats.totalOrders, icon: 'fa-shopping-bag', color: '#3b82f6' },
                    { title: 'Khách hàng', value: stats.totalUsers, icon: 'fa-users', color: '#f59e0b' },
                    { title: 'Quán đang bán', value: stats.activeRes, icon: 'fa-store', color: '#8b5cf6' }
                ].map((item, idx) => (
                    <div key={idx} style={cardStyle}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                            <div style={{ width: '40px', height: '40px', borderRadius: '10px', background: `${item.color}15`, color: item.color, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                <i className={`fas ${item.icon}`}></i>
                            </div>
                            <span style={{ color: '#10b981', fontSize: '12px', fontWeight: 700 }}>+12% ↑</span>
                        </div>
                        <div style={{ color: '#888', fontSize: '14px', fontWeight: 500 }}>{item.title}</div>
                        <div style={{ fontSize: '22px', fontWeight: 800, marginTop: '4px', color: '#1a1a1a' }}>{item.value}</div>
                    </div>
                ))}
            </div>

            {/* Charts Section */}
            <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '24px', marginBottom: '40px' }}>
                
                {/* Doanh thu theo thời gian */}
                <div style={cardStyle}>
                    <h3 style={{ margin: '0 0 30px 0', fontSize: '18px', fontWeight: 700 }}>Biểu đồ tăng trưởng</h3>
                    <div style={{ width: '100%', height: '300px' }}>
                        <ResponsiveContainer>
                            <AreaChart data={revenueData}>
                                <defs>
                                    <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#10b981" stopOpacity={0.3}/>
                                        <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#999', fontSize: 12}} />
                                <YAxis axisLine={false} tickLine={false} tick={{fill: '#999', fontSize: 12}} />
                                <Tooltip 
                                    contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 20px rgba(0,0,0,0.1)' }}
                                    formatter={(value) => [value.toLocaleString() + 'đ', 'Doanh thu']}
                                />
                                <Area type="monotone" dataKey="revenue" stroke="#10b981" strokeWidth={3} fillOpacity={1} fill="url(#colorRev)" />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Phân bổ đơn hàng (Mẫu) */}
                <div style={cardStyle}>
                    <h3 style={{ margin: '0 0 30px 0', fontSize: '18px', fontWeight: 700 }}>Top 5 Nhà hàng (Tỉ trọng)</h3>
                    <div style={{ width: '100%', height: '300px' }}>
                        <ResponsiveContainer>
                            <BarChart data={topRestaurants}>
                                <XAxis dataKey="res_name" hide />
                                <Tooltip cursor={{fill: 'transparent'}} />
                                <Bar dataKey="revenue" radius={[6, 6, 0, 0]}>
                                    {topRestaurants.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={['#8b5cf6', '#3b82f6', '#10b981', '#f59e0b', '#ef4444'][index % 5]} />
                                    ))}
                                </Bar>
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>

            {/* Top Restaurants Table */}
            <div style={cardStyle}>
                <h3 style={{ margin: '0 0 20px 0', fontSize: '18px', fontWeight: 700 }}>Chi tiết hiệu suất đối tác</h3>
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                    <thead>
                        <tr style={{ textAlign: 'left', borderBottom: '1px solid #f0f0f0' }}>
                            <th style={{ padding: '16px', color: '#888', fontWeight: 600, fontSize: '14px' }}>TÊN NHÀ HÀNG</th>
                            <th style={{ padding: '16px', color: '#888', fontWeight: 600, fontSize: '14px' }}>ĐƠN HOÀN TẤT</th>
                            <th style={{ padding: '16px', color: '#888', fontWeight: 600, fontSize: '14px' }}>DOANH THU</th>
                            <th style={{ padding: '16px', color: '#888', fontWeight: 600, fontSize: '14px' }}>ĐIỂM RATING</th>
                        </tr>
                    </thead>
                    <tbody>
                        {topRestaurants.map((res, i) => (
                            <tr key={i} style={{ borderBottom: '1px solid #fafafa' }}>
                                <td style={{ padding: '16px', fontWeight: 700, color: '#333' }}>{res.res_name}</td>
                                <td style={{ padding: '16px', color: '#666' }}>{res.totalOrders} đơn</td>
                                <td style={{ padding: '16px', fontWeight: 700, color: '#10b981' }}>{(res.revenue || 0).toLocaleString()}đ</td>
                                <td style={{ padding: '16px' }}>
                                    <span style={{ padding: '4px 10px', borderRadius: '20px', background: '#fff9c4', color: '#fbc02d', fontWeight: 700, fontSize: '12px' }}>
                                        ★ {res.rating}
                                    </span>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default AdminAnalytics;