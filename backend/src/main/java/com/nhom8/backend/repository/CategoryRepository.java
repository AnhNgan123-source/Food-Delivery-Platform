package com.nhom8.backend.repository;

import com.nhom8.backend.model.Category;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

public interface CategoryRepository extends JpaRepository<Category, Integer> {
    Optional<Category> findByCatName(String catName);
}