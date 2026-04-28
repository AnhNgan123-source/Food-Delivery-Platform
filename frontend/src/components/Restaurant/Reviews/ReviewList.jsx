import React, { useState } from 'react';
import restaurantApi from '../../../api/restaurantApi';
import styles from './ReviewList.module.css';

const ReviewList = ({ reviews, onRefresh }) => {
    const [replyingId, setReplyingId] = useState(null); // Lưu ID của review đang được phản hồi
    const [replyText, setReplyText] = useState(""); // Nội dung phản hồi đang nhập

    const renderStars = (rating) => {
        return [...Array(5)].map((_, i) => (
            <i key={i} className={i < rating ? "fas fa-star" : "far fa-star"} 
               style={{ color: i < rating ? '#ffb800' : '#e0e5f2' }}></i>
        ));
    };

    const handleSendReply = async (reviewId) => {
        if (!replyText.trim()) return alert("Hãy nhập nội dung phản hồi đã nhé!");
        
        try {
            // Gọi API gửi phản hồi (lưu ý: Backend xử lý gộp chuỗi ||REPLY||)
            const response = await restaurantApi.replyToReview(reviewId, replyText);
            if (response.status === 'success' || response) {
                alert("Đã gửi phản hồi thành công!");
                setReplyingId(null);
                setReplyText("");
                if (onRefresh) onRefresh(); // Load lại danh sách để thấy phản hồi mới
            }
        } catch (error) {
            console.error("Lỗi gửi phản hồi:", error);
            alert("Có lỗi khi gửi phản hồi rồi!");
        }
    };

    if (reviews.length === 0) {
        return (
            <div className={styles.emptyContainer}>
                <i className="fas fa-comment-slash"></i>
                <p>Chưa có đánh giá nào để hiển thị!</p>
            </div>
        );
    }

    return (
        <div className={styles.grid}>
            {reviews.map((rev) => {
                // TÁCH CHUỖI: Chia comment khách và reply của shop
                const parts = rev.comment ? rev.comment.split("||REPLY||") : ["", ""];
                const customerComment = parts[0];
                const shopReply = parts[1];

                return (
                    <div key={rev.reviewId} className={styles.card}>
                        <div className={styles.cardHeader}>
                            <div className={styles.userInfo}>
                                <div className={styles.avatar}>
                                    {rev.customerId ? "U" : "?"}
                                </div>
                                <div>
                                    <h4 className={styles.userName}>Khách hàng #{rev.customerId}</h4>
                                    <span className={styles.date}>
                                        {new Date(rev.createdAt).toLocaleDateString('vi-VN')}
                                    </span>
                                </div>
                            </div>
                            <div className={styles.ratingGroup}>
                                {renderStars(rev.rating)}
                            </div>
                        </div>

                        <div className={styles.cardBody}>
                            <p className={styles.comment}>"{customerComment || "Khách hàng không để lại bình luận."}"</p>
                            
                            {/* Hiển thị vùng phản hồi nếu đã có reply trong chuỗi */}
                            {shopReply && (
                                <div className={styles.shopReplyBox}>
                                    <div className={styles.replyHeader}>
                                        <i className="fas fa-reply fa-flip-horizontal"></i>
                                        <strong>Phản hồi từ chủ quán</strong>
                                    </div>
                                    <p className={styles.replyContent}>{shopReply}</p>
                                </div>
                            )}

                            {rev.itemNameList && (
                                <div className={styles.orderTags}>
                                    <i className="fas fa-shopping-bag"></i>
                                    <span>{rev.itemNameList}</span>
                                </div>
                            )}
                        </div>
                        
                        <div className={styles.cardFooter}>
                            {replyingId === rev.reviewId ? (
                                <div className={styles.replyArea}>
                                    <textarea 
                                        autoFocus
                                        placeholder="Nhập lời cảm ơn hoặc giải thích..."
                                        value={replyText}
                                        onChange={(e) => setReplyText(e.target.value)}
                                        className={styles.replyTextarea}
                                    />
                                    <div className={styles.replyActions}>
                                        <button className={styles.cancelBtn} onClick={() => setReplyingId(null)}>Hủy</button>
                                        <button className={styles.confirmBtn} onClick={() => handleSendReply(rev.reviewId)}>Gửi</button>
                                    </div>
                                </div>
                            ) : (
                                <button 
                                    className={styles.replyBtn} 
                                    onClick={() => {
                                        setReplyingId(rev.reviewId);
                                        setReplyText(shopReply || ""); // Nếu có reply rồi thì cho sửa
                                    }}
                                >
                                    {shopReply ? "Sửa phản hồi" : "Phản hồi khách hàng"}
                                </button>
                            )}
                        </div>
                    </div>
                );
            })}
        </div>
    );
};

export default ReviewList;