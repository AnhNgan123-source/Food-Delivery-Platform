package com.nhom8.backend.model;

import jakarta.persistence.*;
import lombok.*;
import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "voucher")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class Voucher {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "voucher_id")
    private Integer voucherId;

    @Column(unique = true, nullable = false, length = 50)
    private String code;

    @Column(columnDefinition = "TEXT")
    private String description;

    @Column(name = "discount_type", nullable = false)
    private String discountType; // 'percentage' hoặc 'fixed_amount'

    @Column(name = "discount_value", nullable = false, precision = 10, scale = 2)
    private BigDecimal discountValue;

    @Column(name = "max_discount_amount", precision = 10, scale = 2)
    private BigDecimal maxDiscountAmount;

    @Column(name = "min_order_value", precision = 10, scale = 2)
    private BigDecimal minOrderValue = BigDecimal.ZERO;

    @Column(name = "start_date")
    private LocalDateTime startDate;

    @Column(name = "end_date")
    private LocalDateTime endDate;

    @Column(name = "usage_limit")
    private Integer usageLimit = 100;

    @Column(name = "used_count")
    private Integer usedCount = 0;

    @Column(name = "is_active")
    private Integer isActive = 1;

    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;

    // Tự động gán ngày tạo trước khi lưu vào DB
    @PrePersist
    protected void onCreate() {
        this.createdAt = LocalDateTime.now();
        if (this.usedCount == null) this.usedCount = 0;
        if (this.isActive == null) this.isActive = 1;
        if (this.minOrderValue == null) this.minOrderValue = BigDecimal.ZERO;
    }
}