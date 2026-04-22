package com.nhom8.backend.model;

import jakarta.persistence.*;
import java.math.BigDecimal;

@Entity
@Table(name = "shipping_config")
public class ShippingConfig {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer configId;

    @Column(name = "area_name")
    private String areaName;

    @Column(name = "price")
    private BigDecimal price;

    // Getters và Setters
    public Integer getConfigId() {
        return configId;
    }

    public void setConfigId(Integer configId) {
        this.configId = configId;
    }

    public String getAreaName() {
        return areaName;
    }

    public void setAreaName(String areaName) {
        this.areaName = areaName;
    }

    public BigDecimal getPrice() {
        return price;
    }

    public void setPrice(BigDecimal price) {
        this.price = price;
    }
}