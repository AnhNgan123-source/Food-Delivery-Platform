import React from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, Cell } from 'recharts';
import styles from './AdminAnalytics.module.css';

const AdminAnalytics = ({ stats, revenueData = [], topRestaurants = [], isLoading, onRefresh }) => {
    
    // Log để kiểm tra data thực tế nhận được từ API
    console.log("Check stats in component:", stats);

    if (isLoading) return (
        <div className={styles.loadingContainer}>
            <div className={styles.spinner}></div>
            <span>Đang cập nhật số liệu ...</span>
        </div>
    );

    // Xử lý giá trị mặc định để tránh lỗi .toLocaleString() khi data chưa về
    const displayStats = [
        { label: 'Doanh thu', val: `${Number(stats?.totalRevenue || 0).toLocaleString('vi-VN')}đ`, color: '#10b981', icon: 'fa-wallet' },
        { label: 'Đơn hàng', val: stats?.totalOrders || 0, color: '#3b82f6', icon: 'fa-shopping-cart' },
        { label: 'Người dùng', val: stats?.totalUsers || 0, color: '#f59e0b', icon: 'fa-users' },
        { label: 'Nhà hàng', val: stats?.activeRes || 0, color: '#8b5cf6', icon: 'fa-store' }
    ];

    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <div>
                    <h3 className={styles.title}>Trung tâm Phân tích</h3>
                    <p className={styles.subtitle}>Báo cáo số liệu thực tế hệ thống</p>
                </div>
                <button onClick={onRefresh} className={styles.btnRefresh}>
                    <i className="fas fa-sync-alt"></i> Cập nhật
                </button>
            </div>

            {/* Stats Cards */}
            <div className={styles.statsGrid}>
                {displayStats.map((item, i) => (
                    <div key={i} className={styles.statCard}>
                        <div className={styles.iconBox} style={{ background: `${item.color}15`, color: item.color }}>
                            <i className={`fas ${item.icon}`}></i>
                        </div>
                        <div className={styles.statInfo}>
                            <span className={styles.statLabel}>{item.label}</span>
                            <span className={styles.statValue}>{item.val}</span>
                        </div>
                    </div>
                ))}
            </div>

            {/* Charts Section */}
            <div className={styles.chartsGrid}>
                <div className={styles.mainCard}>
                    <h4 className={styles.cardTitle}>Tăng trưởng doanh thu</h4>
                    <div className={styles.chartBox}>
                        <ResponsiveContainer width="100%" height={300}>
                            <AreaChart data={revenueData && revenueData.length > 0 ? revenueData : [{name: 'Chưa có data', revenue: 0}]}>
                                <defs>
                                    <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#10b981" stopOpacity={0.2}/>
                                        <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12}} />
                                <YAxis axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12}} />
                                <Tooltip contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 8px 24px rgba(0,0,0,0.05)' }} />
                                <Area type="monotone" dataKey="revenue" stroke="#10b981" strokeWidth={3} fill="url(#colorRev)" />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                <div className={styles.mainCard}>
                    <h4 className={styles.cardTitle}>Top doanh thu quán</h4>
                    <div className={styles.chartBox}>
                        <ResponsiveContainer width="100%" height={300}>
                            <BarChart data={topRestaurants && topRestaurants.length > 0 ? topRestaurants : [{res_name: 'Trống', revenue: 0}]}>
                                <XAxis dataKey="res_name" hide />
                                <Tooltip cursor={{fill: 'transparent'}} />
                                <Bar dataKey="revenue" radius={[4, 4, 0, 0]}>
                                    {(topRestaurants || []).map((entry, index) => (
                                        <Cell key={index} fill={['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6'][index % 5]} />
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

export default AdminAnalytics;