package com.nhom8.backend.repository;

import com.nhom8.backend.model.MenuItem;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface MenuItemRepository extends JpaRepository<MenuItem, Integer> {

    // Lấy menu theo nhà hàng
    List<MenuItem> findByResId(Integer resId);

}