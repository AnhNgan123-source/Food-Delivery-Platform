package com.nhom8.backend.model;

import jakarta.persistence.*;
//import lombok.Data;
import java.math.BigDecimal;

@Entity
@Table(name = "Restaurant")
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

    public Integer getResId() {
        return resId;
    }

    public void setResId(Integer resId) {
        this.resId = resId;
    }

    public Integer getOwnerId() {
        return ownerId;
    }

    public void setOwnerId(Integer ownerId) {
        this.ownerId = ownerId;
    }

    public String getResName() {
        return resName;
    }

    public void setResName(String resName) {
        this.resName = resName;
    }

    public String getResAddress() {
        return resAddress;
    }

    public void setResAddress(String resAddress) {
        this.resAddress = resAddress;
    }

    public String getResImage() {
        return resImage;
    }

    public void setResImage(String resImage) {
        this.resImage = resImage;
    }

    public BigDecimal getRatingAvg() {
        return ratingAvg;
    }

    public void setRatingAvg(BigDecimal ratingAvg) {
        this.ratingAvg = ratingAvg;
    }

    public Integer getIsActive() {
        return isActive;
    }

    public void setIsActive(Integer isActive) {
        this.isActive = isActive;
    }

    
}