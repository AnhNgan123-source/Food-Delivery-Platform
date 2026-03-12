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

    private Integer resId; // ID nhà hàng sở hữu món này
    private Integer catId; // ID danh mục (Pizza, Burger...)

    @Column(nullable = false)
    private String itemName;

    private BigDecimal price;
    private String description;
    private String itemImage;

    @Column(name = "is_available")
    private Integer isAvailable = 1; // 1 là còn bán, 0 là hết hàng
}