package com.nhom8.backend.controller;

import com.nhom8.backend.model.Review;
import com.nhom8.backend.repository.ReviewRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.*;

@RestController
@RequestMapping("/api/v1/reviews")
@CrossOrigin(origins = "*")
public class ReviewController {

    @Autowired
    private ReviewRepository reviewRepository;

    // POST: Lưu đánh giá mới
    @PostMapping
    public ResponseEntity<?> createReview(@RequestBody Review review) {
        if (reviewRepository.existsByOrderId(review.getOrderId())) {
            return ResponseEntity.badRequest().body("Đơn hàng này đã được đánh giá!");
        }
        Review saved = reviewRepository.save(review);
        return ResponseEntity.ok(Map.of("status", "success", "data", saved));
    }

    // GET: Lấy danh sách đánh giá của quán
    @GetMapping("/restaurant/{resId}")
    public ResponseEntity<?> getReviews(@PathVariable Integer resId) {
        List<Review> list = reviewRepository.findByResIdOrderByCreatedAtDesc(resId);
        return ResponseEntity.ok(Map.of("status", "success", "data", list));
    }

    @PutMapping("/{reviewId}/reply")
    public ResponseEntity<?> replyReview(@PathVariable Integer reviewId, @RequestBody Map<String, String> body) {
    String replyText = body.get("reply");
    Review review = reviewRepository.findById(reviewId).orElseThrow();
    
    // Lấy comment cũ, kiểm tra xem đã có phản hồi chưa để tránh ghi đè lặp lại
    String currentComment = review.getComment();
    if (currentComment.contains("||REPLY||")) {
        // Nếu đã có phản hồi rồi thì chỉ cập nhật phần sau dấu ||REPLY||
        currentComment = currentComment.split("\\|\\|REPLY\\|\\|")[0];
    }
    
    // Gộp chung vào 1 cột duy nhất
    review.setComment(currentComment + "||REPLY||" + replyText);
    reviewRepository.save(review);
    
    return ResponseEntity.ok(Map.of("status", "success"));
}

    @GetMapping("/restaurant/{resId}/average")
    public ResponseEntity<?> getAverage(@PathVariable Integer resId) {
        Double avg = reviewRepository.getAverageRatingByResId(resId);
        Long total = reviewRepository.countByResId(resId);
    Map<String, Object> response = new HashMap<>();
        response.put("status", "success");
        response.put("average", avg != null ? avg : 0.0);
        response.put("total", total != null ? total : 0); 
        
        return ResponseEntity.ok(response);    }
}