package com.nhom8.backend.repository;

import com.nhom8.backend.model.Review;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

public interface ReviewRepository extends JpaRepository<Review, Integer> {
    // Lấy đánh giá của một quán, cái mới nhất hiện lên đầu
    List<Review> findByResIdOrderByCreatedAtDesc(Integer resId);
    
    // Kiểm tra xem đơn này đã review chưa
    boolean existsByOrderId(Integer orderId);

    @Query("SELECT AVG(r.rating) FROM Review r WHERE r.resId = ?1")
    Double getAverageRatingByResId(Integer resId);

    Long countByResId(Integer resId);
}