package com.nhom8.backend.model;

import jakarta.persistence.*;
import lombok.Data;
import java.math.BigDecimal;

@Entity
@Table(name = "Menu_Item")
@Data
public class MenuItem {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer itemId;

    private Integer res_id; // ID nhà hàng sở hữu món này
    private Integer cat_id; // ID danh mục (Pizza, Burger...)

    @Column(nullable = false)
    private String item_name;

    private BigDecimal price;
    private String description;
    private String item_image;

    @Column(name = "is_available")
    private Integer is_available = 1; // 1 là còn bán, 0 là hết hàng
}