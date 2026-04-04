package com.nhom8.backend.model;

import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalDateTime;

@Entity
@Data
@Table(name = "review")
public class Review {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer reviewId;
    private Integer orderId;
    private Integer customerId;
    private Integer resId;
    private Integer rating;
    private String comment;
    @Column(insertable = false, updatable = false)
    private LocalDateTime createdAt;
}