import React, { useState } from 'react';
import customerApi from '../../../api/customerApi';
import styles from './ReviewModal.module.css'; 

const ReviewModal = ({ order, isOpen, onClose, onReviewSuccess }) => {
    const [rating, setRating] = useState(5);
    const [comment, setComment] = useState('');
    const [loading, setLoading] = useState(false);

    if (!isOpen || !order) return null;

    const handleSubmit = async () => {
    if (!comment.trim()) return alert("Viết vài lời cảm nhận nhé!");

    setLoading(true);
    try {
        const payload = {
            orderId: order.orderId,
            resId: order.resId,
            customerId: order.customerId,
            rating: rating,
            comment: comment
        };

        console.log("Đang gửi payload:", payload);
        const res = await customerApi.createReview(payload);
        console.log("Kết quả từ server:", res);

        // SỬA CHỖ NÀY: Kiểm tra linh hoạt hơn
        if (res && (res.status === 'success' || res.data || res.orderId)) {
            alert("Đánh giá thành công! Cảm ơn bạn");
            onClose(); // Đóng modal ngay
            if (onReviewSuccess) onReviewSuccess(); // Load lại danh sách
        }
    } catch (error) {
        console.error("Lỗi 400 hoặc 500:", error);
        // Nếu là lỗi 400 (đã đánh giá), Backend trả về string thì hiện string đó luôn
        const errorMsg = error.response?.data?.message || error.response?.data || "Lỗi rồi bạn ơi!";
        alert(typeof errorMsg === 'string' ? errorMsg : "Đơn hàng này bạn đã đánh giá rồi nha!");
        
        // Dù lỗi 400 (đã tồn tại) thì cũng nên đóng modal cho khách đỡ bấm lại
        onClose();
    } finally {
        setLoading(false);
    }
};

    return (
        <div className={styles.overlay} onClick={onClose}>
            <div className={styles.modal} onClick={e => e.stopPropagation()}>
                <div className={styles.header}>
                    <h3>Đánh giá đơn hàng #{order.orderId}</h3>
                    <button className={styles.closeBtn} onClick={onClose}>&times;</button>
                </div>

                <div className={styles.body}>
                    <p className={styles.resName}>Nhà hàng: <b>{order.restaurantName || "Đối tác"}</b></p>
                    
                    <div className={styles.stars}>
                        {[1, 2, 3, 4, 5].map(star => (
                            <i 
                                key={star}
                                className={star <= rating ? "fas fa-star" : "far fa-star"}
                                onClick={() => setRating(star)}
                                style={{ color: star <= rating ? '#f1c40f' : '#ccc', cursor: 'pointer' }}
                            ></i>
                        ))}
                    </div>
                    <div style={{textAlign: 'center', color: '#f1c40f', fontSize: '14px', marginBottom: '15px'}}>
                        {rating === 5 ? "Rất hài lòng" : rating >= 3 ? "Bình thường" : "Không hài lòng"}
                    </div>

                    <textarea 
                        className={styles.textarea}
                        placeholder="Món ăn ngon không bạn ơi? Chia sẻ cảm nhận tại đây nhé..."
                        value={comment}
                        onChange={(e) => setComment(e.target.value)}
                    />
                </div>

                <div className={styles.footer}>
                    <button className={styles.cancelBtn} onClick={onClose}>Bỏ qua</button>
                    <button 
                        className={styles.submitBtn} 
                        onClick={handleSubmit}
                        disabled={loading}
                    >
                        {loading ? "Đang gửi..." : "Gửi đánh giá"}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ReviewModal;