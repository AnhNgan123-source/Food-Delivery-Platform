package com.nhom8.backend.repository;

import com.nhom8.backend.model.Review;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface ReviewRepository extends JpaRepository<Review, Integer> {
    // Lấy đánh giá của một quán, cái mới nhất hiện lên đầu
    List<Review> findByResIdOrderByCreatedAtDesc(Integer resId);
    
    // Kiểm tra xem đơn này đã review chưa
    boolean existsByOrderId(Integer orderId);
}