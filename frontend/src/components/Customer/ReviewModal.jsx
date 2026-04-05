import React, { useState } from 'react';

const ReviewModal = ({ isOpen, onClose, order, onSuccess }) => {
    const [rating, setRating] = useState(5);
    const [comment, setComment] = useState("");

    if (!isOpen || !order) return null;

    const handleSubmit = async () => {
        const payload = {
            orderId: order.orderId,
            customerId: order.customerId,
            resId: order.resId,
            rating: rating,
            comment: comment
        };

        try {
            const res = await fetch('http://localhost:8080/api/v1/reviews', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });
            if (res.ok) {
                alert("Cảm ơn bạn đã gửi đánh giá!");
                onSuccess(order.orderId); // Để ẩn nút đánh giá ngoài trang lịch sử
                onClose();
            }
        } catch (error) { console.error("Lỗi:", error); }
    };

    return (
        <div style={modalStyles.overlay}>
            <div style={modalStyles.content}>
                <h3>Đánh giá bữa ăn </h3>
                <p style={{fontSize: '13px', color: '#666'}}>Đơn hàng #{order.orderId}</p>
                
                <div style={{ margin: '20px 0' }}>
                    {[1, 2, 3, 4, 5].map(star => (
                        <span 
                            key={star} 
                            onClick={() => setRating(star)}
                            style={{ fontSize: '30px', cursor: 'pointer', color: star <= rating ? '#f1c40f' : '#ddd' }}
                        >
                            ★
                        </span>
                    ))}
                </div>

                <textarea 
                    placeholder="Món ăn có ngon không bạn ơi? Chia sẻ cảm nhận nhé..."
                    style={modalStyles.input}
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                />

                <div style={{ display: 'flex', gap: '10px', marginTop: '15px' }}>
                    <button onClick={onClose} style={modalStyles.btnCancel}>Đóng</button>
                    <button onClick={handleSubmit} style={modalStyles.btnSubmit}>Gửi ngay</button>
                </div>
            </div>
        </div>
    );
};

const modalStyles = {
    overlay: { position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.8)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 3000 },
    content: { background: '#fff', padding: '25px', borderRadius: '20px', width: '350px', textAlign: 'center' },
    input: { width: '100%', height: '80px', borderRadius: '10px', border: '1px solid #ddd', padding: '10px', outline: 'none' },
    btnSubmit: { flex: 2, background: '#2ecc71', color: '#fff', border: 'none', padding: '10px', borderRadius: '10px', cursor: 'pointer', fontWeight: 'bold' },
    btnCancel: { flex: 1, background: '#eee', border: 'none', padding: '10px', borderRadius: '10px', cursor: 'pointer' }
};

export default ReviewModal;