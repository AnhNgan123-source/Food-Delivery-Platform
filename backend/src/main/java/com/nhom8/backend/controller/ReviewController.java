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
}