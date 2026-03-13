package com.nhom8.backend.model;

import jakarta.persistence.*;
import lombok.Data;
import java.math.BigDecimal;

@Entity
@Table(name = "Restaurant")
@Data
public class Restaurant {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "res_id")
    private Integer resId;

    @Column(name = "owner_id", nullable = false)
    private Integer ownerId; // chủ quán

    @Column(name = "res_name", nullable = false)
    private String resName;

    @Column(name = "res_address", nullable = false)
    private String resAddress;

    @Column(name = "res_image")
    private String resImage;

    @Column(name = "rating_avg")
    private BigDecimal ratingAvg = BigDecimal.ZERO;

    @Column(name = "is_active")
    private Integer isActive = 0; // 0 = chưa duyệt, 1 = đang hoạt động
}