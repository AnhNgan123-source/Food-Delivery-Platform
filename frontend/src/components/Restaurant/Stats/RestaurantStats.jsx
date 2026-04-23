import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, Cell } from 'recharts';
import styles from './RestaurantStats.module.css';

const RestaurantStats = ({ stats, chartData, topItems, loading }) => {
    if (loading) return (
        <div className={styles.loaderContainer}>
            <div>Đang tính toán sổ sách...</div>
        </div>
    );

    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <h2>Báo cáo doanh thu</h2>
                <p>Hiệu quả kinh doanh dựa trên các đơn hàng đã hoàn thành</p>
            </div>

            {/* HÀNG 1: TỔNG QUAN */}
            <div className={styles.summaryRow}>
                <div className={styles.card}>
                    <div className={styles.cardTitle} style={{ color: '#28a745' }}>TỔNG DOANH THU</div>
                    <div className={styles.cardValue}>{stats.totalRevenue.toLocaleString()}đ</div>
                </div>
                <div className={styles.card}>
                    <div className={styles.cardTitle} style={{ color: '#007bff' }}>TỔNG ĐƠN HÀNG</div>
                    <div className={styles.cardValue}>{stats.totalOrders}</div>
                </div>
                <div className={styles.card}>
                    <div className={styles.cardTitle} style={{ color: '#ff9800' }}>TỈ LỆ THÀNH CÔNG</div>
                    <div className={styles.cardValue}>{stats.successRate}</div>
                </div>
                <div className={styles.card}>
                    <div className={styles.cardTitle} style={{ color: '#dc3545' }}>ĐƠN ĐÃ HỦY</div>
                    <div className={styles.cardValue}>{stats.cancelledOrders}</div>
                </div>
            </div>

            <div className={styles.chartsRow}>
                {/* BIỂU ĐỒ DOANH THU */}
                <div className={`${styles.chartBox} ${styles.revenueChart}`}>
                    <h4 className={styles.chartTitle}>Biểu đồ tăng trưởng doanh thu (VNĐ)</h4>
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
                <div className={`${styles.chartBox} ${styles.topItemsChart}`}>
                    <h4 className={styles.chartTitle}>Top 5 món bán chạy</h4>
                    <div style={{ width: '100%', height: 300 }}>
                        <ResponsiveContainer>
                            <BarChart data={topItems} layout="vertical">
                                <XAxis type="number" hide />
                                <YAxis dataKey="name" type="category" axisLine={false} tickLine={false} width={100} style={{ fontSize: '11px' }} />
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