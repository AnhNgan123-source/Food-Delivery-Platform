import React, { useState, useEffect, useCallback } from 'react';
import restaurantApi from '../../api/restaurantApi';
import ReviewList from '../../components/Restaurant/Reviews/ReviewList';
import styles from './ResReviewsPage.module.css';

const ResReviewsPage = () => {
    const [reviews, setReviews] = useState([]);
    const [avgRating, setAvgRating] = useState(0); // Lưu điểm trung bình
    const [loading, setLoading] = useState(true);
    
    const resId = localStorage.getItem('resId'); 

    const fetchReviewsData = useCallback(async () => {
        if (!resId) {
            setLoading(false);
            return;
        }

        setLoading(true);
        try {
            // Chạy song song 2 API để tối ưu thời gian load
            const [reviewsData, avgData] = await Promise.all([
                restaurantApi.getReviewsByResId(resId),
                restaurantApi.getAverageRating(resId) // API mới sếp vừa thêm ở Backend
            ]);
            
            if (reviewsData) {
                setReviews(reviewsData); 
            }
            
            if (avgData && avgData.average !== undefined) {
                setAvgRating(avgData.average);
            }
        } catch (error) {
            console.error("Lỗi lấy dữ liệu đánh giá rồi sếp ơi:", error);
        } finally {
            setLoading(false);
        }
    }, [resId]);

    useEffect(() => {
        fetchReviewsData();
    }, [fetchReviewsData]);

    // Hàm phụ trợ để hiển thị sao cho điểm trung bình
    const renderAvgStars = (rating) => {
        const roundedRating = Math.round(rating);
        return [...Array(5)].map((_, i) => (
            <i key={i} 
               className={i < roundedRating ? "fas fa-star" : "far fa-star"} 
               style={{ color: '#ffb800', marginRight: '2px' }}>
            </i>
        ));
    };

    return (
        <div className={styles.pageContainer}>
            <header className={styles.header}>
                <div className={styles.headerLeft}>
                    <h2 className={styles.pageTitle}>Phản hồi khách hàng</h2>
                    
                    {/* KHU VỰC HIỂN THỊ ĐIỂM TRUNG BÌNH MỚI */}
                    <div className={styles.ratingOverview}>
                        <div className={styles.avgBox}>
                            <span className={styles.avgNumber}>{Number(avgRating).toFixed(1)}</span>
                            <div className={styles.starsWrap}>
                                {renderAvgStars(avgRating)}
                            </div>
                            <p className={styles.totalText}>({reviews.length} đánh giá)</p>
                        </div>
                    </div>

                    <p className={styles.pageSubtitle}>
                        Nhà hàng đang có <span className={styles.highlight}>{reviews.length}</span> đánh giá từ thực khách
                    </p>
                </div>

                <div className={styles.statsBadge}>
                    <div className={styles.badgeIcon}>
                        <i className="fas fa-chart-line"></i>
                    </div>
                    <div className={styles.badgeText}>
                        <span>Tỉ lệ hài lòng</span>
                        <strong>{avgRating >= 4 ? "Rất Cao" : "Ổn định"}</strong>
                    </div>
                </div>
            </header>

            <main className={styles.content}>
                {loading ? (
                    <div className={styles.loadingState}>
                        <div className={styles.spinner}></div>
                        <p>Đang tải dữ liệu sếp ơi...</p>
                    </div>
                ) : (
                    <ReviewList reviews={reviews} onRefresh={fetchReviewsData} />
                )}
            </main>
        </div>
    );
};

export default ResReviewsPage;