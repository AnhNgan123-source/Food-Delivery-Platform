package com.nhom8.backend.model;

import jakarta.persistence.*;
import lombok.Data;
import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Data
@Table(name = "voucher")
public class Voucher {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer voucherId;

    @Column(unique = true, nullable = false)
    private String code;

    private String description;

    @Column(name = "discount_type")
    private String discountType; // 'percentage' hoặc 'fixed_amount'

    private BigDecimal discountValue;
    private BigDecimal maxDiscountAmount;
    private BigDecimal minOrderValue;
    
    private LocalDateTime startDate;
    private LocalDateTime endDate;
    
    private Integer usageLimit;
    private Integer usedCount = 0;
    private Integer isActive = 1;
    private LocalDateTime createdAt = LocalDateTime.now();
}