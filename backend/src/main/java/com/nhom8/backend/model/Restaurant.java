package com.nhom8.backend.model;

import jakarta.persistence.*;
import lombok.*;
import java.math.BigDecimal;

@Entity
@Table(name = "Restaurant")
@Getter 
@Setter 
@NoArgsConstructor 
@AllArgsConstructor
@Builder
public class Restaurant {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "res_id")
    private Integer resId;

    @Column(name = "owner_id", nullable = false)
    private Integer ownerId; 

    @Column(name = "res_name", nullable = false)
    private String resName;

    @Column(name = "res_address", nullable = false)
    private String resAddress;

    @Column(name = "res_image")
    private String resImage;

    @Column(name = "rating_avg")
    private BigDecimal ratingAvg = BigDecimal.ZERO;

    @Column(name = "is_active")
    private Integer isActive = 0; 
}