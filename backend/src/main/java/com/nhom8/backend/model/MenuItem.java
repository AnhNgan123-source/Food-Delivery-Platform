package com.nhom8.backend.model;

import jakarta.persistence.*;
import java.math.BigDecimal;

@Entity
@Table(name = "menu_item") // Tên bảng trong MySQL
public class MenuItem {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "item_id") // Map với cột item_id trong DB
    private Integer itemId;

    @Column(name = "res_id")
    private Integer resId;

    @Column(name = "cat_id")
    private Integer catId;

    @Column(name = "item_name", nullable = false)
    private String itemName;

    private BigDecimal price;
    private String description;

    @Column(name = "item_image")
    private String itemImage;

    @Column(name = "is_available")
    private Integer isAvailable = 1; // 1: Còn, 0: Hết

    // --- GETTERS & SETTERS (Viết theo kiểu camelCase) ---

    public Integer getItemId() { return itemId; }
    public void setItemId(Integer itemId) { this.itemId = itemId; }

    public Integer getResId() { return resId; }
    public void setResId(Integer resId) { this.resId = resId; }

    public Integer getCatId() { return catId; }
    public void setCatId(Integer catId) { this.catId = catId; }

    public String getItemName() { return itemName; }
    public void setItemName(String itemName) { this.itemName = itemName; }

    public BigDecimal getPrice() { return price; }
    public void setPrice(BigDecimal price) { this.price = price; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    public String getItemImage() { return itemImage; }
    public void setItemImage(String itemImage) { this.itemImage = itemImage; }

    public Integer getIsAvailable() { return isAvailable; }
    public void setIsAvailable(Integer isAvailable) { this.isAvailable = isAvailable; }
}