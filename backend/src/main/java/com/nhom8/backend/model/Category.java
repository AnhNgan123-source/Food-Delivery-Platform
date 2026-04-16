package com.nhom8.backend.model;

import jakarta.persistence.*;
import lombok.Data;

@Entity
@Table(name = "Category")
@Data
public class Category {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    
    @Column(name = "cat_id")
    private Integer catId;

    @Column(name = "cat_name")
    private String catName;
}