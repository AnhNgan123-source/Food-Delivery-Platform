import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import customerApi from '../../api/customerApi';
import styles from './Home.module.css';
import RestaurantCard from '../../components/Customer/Restaurant/RestaurantCard';

const Home = () => {
    const navigate = useNavigate();
    const [allRestaurants, setAllRestaurants] = useState([]);
    const [searchKeyword, setSearchKeyword] = useState('');

    useEffect(() => {
        const fetchRestaurants = async () => {
            try {
                const data = await customerApi.getAllRestaurants();
                setAllRestaurants(data?.data || data || []);
            } catch (error) { console.error("Lỗi:", error); }
        };
        fetchRestaurants();
    }, []);

    return (
        <main style={{ padding: '20px 5%' }}>
            <section className={styles.promoBanner}>
                <div className={styles.promoContent}>
                    <h1>Chào mừng bạn đến với Yummy Hub</h1>
                    <p>Đặt ngay món ngon và nhiều ưu đãi hấp dẫn nhé !!!</p>
                </div>
            </section>

            <div className={styles.sectionHeader}>
                <h3 className={styles.sectionTitle}>Nhà hàng dành cho bạn</h3>
                <input
                    type="text"
                    placeholder="Tìm tên nhà hàng..."
                    className={styles.searchInput}
                    value={searchKeyword}
                    onChange={(e) => setSearchKeyword(e.target.value)}
                />
            </div>

            
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '25px' }}>
                {allRestaurants
                    .filter(res => (res.resName || '').toLowerCase().includes(searchKeyword.toLowerCase()))
                    .map(res => (
                        <RestaurantCard key={res.resId} res={res} onClick={(id) => navigate(`/restaurant/${id}`)} />
                    ))
                }
            </div>
        </main>
    );
};

export default Home;