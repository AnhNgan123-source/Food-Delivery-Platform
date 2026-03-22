package com.nhom8.backend.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.nhom8.backend.model.Order;


@Repository
public interface OrderRepository extends JpaRepository< Order, Integer> {
    
    // 1. Tìm đơn hàng theo ID khách hàng (Để làm tính năng xem Lịch sử đơn hàng)
    // Spring sẽ tự hiểu: SELECT * FROM orders WHERE customer_id = ?
    List<Order> findByCustomerIdOrderByCreatedAtDesc(Integer customerId);

    // 2. Tìm đơn hàng của một nhà hàng cụ thể (Cho chủ quán xem)
    List<Order> findByResIdOrderByCreatedAtDesc(Integer resId);

}
