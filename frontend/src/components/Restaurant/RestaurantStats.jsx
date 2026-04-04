import React, { useState, useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, Cell } from 'recharts';

const RestaurantStats = () => {
    const [stats, setStats] = useState({
        totalRevenue: 0,
        totalOrders: 0,
        successRate: '0%',
        cancelledOrders: 0
    });
    const [chartData, setChartData] = useState([]);
    const [topItems, setTopItems] = useState([]);
    const [loading, setLoading] = useState(true);

    const resId = localStorage.getItem('resId');
    const token = localStorage.getItem('token');

    // Mảng màu sắc cho biểu đồ cột món ăn bán chạy
    const COLORS = ['#28a745', '#ffc107', '#dc3545', '#007bff', '#6f42c1'];

    useEffect(() => {
        const fetchStats = async () => {
            setLoading(true);
            try {
                // Gọi API lấy thống kê từ Backend Spring Boot
                const response = await fetch(`http://localhost:8080/api/v1/orders/restaurant/${resId}/stats`, {
                    headers: {
                        "Authorization": `Bearer ${token}`
                    }
                });
                
                const result = await response.json();

                if (result.status === "success") {
                    const data = result.data;

                    // 1. Xử lý Summary
                    const summary = data.summary || {};
                    const total = summary.totalOrders || 0;
                    const cancelled = summary.cancelledOrders || 0;
                    const successCount = total - cancelled;
                    
                    setStats({
                        totalRevenue: summary.totalRevenue || 0,
                        totalOrders: total,
                        cancelledOrders: cancelled,
                        successRate: total > 0 ? Math.round((successCount / total) * 100) + '%' : '0%'
                    });

                    // 2. Xử lý dữ liệu biểu đồ đường (Doanh thu theo ngày)
                    // Map lại key "name" để phù hợp với Recharts
                    const formattedChart = (data.chart || []).map(item => ({
                        name: item.name, // Ngày (YYYY-MM-DD)
                        revenue: item.revenue
                    }));
                    setChartData(formattedChart);

                    // 3. Xử lý dữ liệu biểu đồ cột (Món bán chạy)
                    const formattedTopItems = (data.topItems || []).map((item, index) => ({
                        name: item.name,
                        sales: item.sales,
                        color: COLORS[index % COLORS.length]
                    }));
                    setTopItems(formattedTopItems);
                }
            } catch (error) {
                console.error("Lỗi khi lấy dữ liệu thống kê:", error);
            } finally {
                setLoading(false);
            }
        };

        if (resId && token) {
            fetchStats();
        }
    }, [resId, token]);

    const cardStyle = {
        background: '#fff',
        padding: '20px',
        borderRadius: '16px',
        boxShadow: '0 4px 15px rgba(0,0,0,0.05)',
        flex: 1,
        textAlign: 'center'
    };

    if (loading) return (
        <div style={{ padding: '50px', textAlign: 'center' }}>
            <div className="loader">Đang tính toán sổ sách...</div>
        </div>
    );

    return (
        <div style={{ padding: '30px', background: '#f4f7f6', minHeight: '100vh', fontFamily: "'Inter', sans-serif" }}>
            <div style={{ marginBottom: '30px' }}>
                <h2 style={{ margin: 0, fontWeight: 800, color: '#333' }}>Báo cáo doanh thu</h2>
                <p style={{ color: '#666', marginTop: '5px' }}>Hiệu quả kinh doanh dựa trên các đơn hàng đã hoàn thành</p>
            </div>

            {/* HÀNG 1: CÁC CON SỐ TỔNG QUAN */}
            <div style={{ display: 'flex', gap: '20px', marginBottom: '30px' }}>
                <div style={cardStyle}>
                    <div style={{ color: '#28a745', fontSize: '12px', fontWeight: 700, marginBottom: '10px' }}>TỔNG DOANH THU</div>
                    <div style={{ fontSize: '24px', fontWeight: 800 }}>{stats.totalRevenue.toLocaleString()}đ</div>
                </div>
                <div style={cardStyle}>
                    <div style={{ color: '#007bff', fontSize: '12px', fontWeight: 700, marginBottom: '10px' }}>TỔNG ĐƠN HÀNG</div>
                    <div style={{ fontSize: '24px', fontWeight: 800 }}>{stats.totalOrders}</div>
                </div>
                <div style={cardStyle}>
                    <div style={{ color: '#ff9800', fontSize: '12px', fontWeight: 700, marginBottom: '10px' }}>TỈ LỆ THÀNH CÔNG</div>
                    <div style={{ fontSize: '24px', fontWeight: 800 }}>{stats.successRate}</div>
                </div>
                <div style={cardStyle}>
                    <div style={{ color: '#dc3545', fontSize: '12px', fontWeight: 700, marginBottom: '10px' }}>ĐƠN ĐÃ HỦY</div>
                    <div style={{ fontSize: '24px', fontWeight: 800 }}>{stats.cancelledOrders}</div>
                </div>
            </div>

            <div style={{ display: 'flex', gap: '25px' }}>
                {/* BIỂU ĐỒ DOANH THU THEO THỜI GIAN */}
                <div style={{ flex: 2, background: '#fff', padding: '25px', borderRadius: '20px', boxShadow: '0 4px 20px rgba(0,0,0,0.05)' }}>
                    <h4 style={{ marginTop: 0, marginBottom: '25px' }}>Biểu đồ tăng trưởng doanh thu (VNĐ)</h4>
                    <div style={{ width: '100%', height: 300 }}>
                        <ResponsiveContainer>
                            <LineChart data={chartData}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#eee" />
                                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#999', fontSize: 12 }} />
                                <YAxis axisLine={false} tickLine={false} tick={{ fill: '#999', fontSize: 12 }} />
                                <Tooltip 
                                    contentStyle={{ borderRadius: '10px', border: 'none', boxShadow: '0 5px 15px rgba(0,0,0,0.1)' }}
                                    formatter={(value) => [`${value.toLocaleString()}đ`, "Doanh thu"]}
                                />
                                <Line type="monotone" dataKey="revenue" stroke="#28a745" strokeWidth={4} dot={{ r: 6, fill: '#28a745' }} activeDot={{ r: 8 }} />
                            </LineChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* BIỂU ĐỒ MÓN BÁN CHẠY */}
                <div style={{ flex: 1, background: '#fff', padding: '25px', borderRadius: '20px', boxShadow: '0 4px 20px rgba(0,0,0,0.05)' }}>
                    <h4 style={{ marginTop: 0, marginBottom: '25px' }}>Top 5 món bán chạy</h4>
                    <div style={{ width: '100%', height: 300 }}>
                        <ResponsiveContainer>
                            <BarChart data={topItems} layout="vertical">
                                <XAxis type="number" hide />
                                <YAxis dataKey="name" type="category" axisLine={false} tickLine={false} width={120} style={{ fontSize: '12px', fontWeight: 500 }} />
                                <Tooltip cursor={{ fill: 'transparent' }} />
                                <Bar dataKey="sales" radius={[0, 10, 10, 0]} barSize={20}>
                                    {topItems.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={entry.color} />
                                    ))}
                                </Bar>
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default RestaurantStats;