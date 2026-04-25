package com.nhom8.backend.repository;

import java.util.List;
import java.util.Map;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;
import com.nhom8.backend.model.Order;

@Repository
public interface OrderRepository extends JpaRepository<Order, Integer> {
    
    // 1. Tìm đơn hàng theo ID khách hàng (Để làm tính năng xem Lịch sử đơn hàng)
    // Spring sẽ tự hiểu: SELECT * FROM orders WHERE customer_id = ?
    List<Order> findByCustomerIdOrderByCreatedAtDesc(Integer customerId);

    // 2. Tìm đơn hàng của một nhà hàng cụ thể (Cho chủ quán xem)
    List<Order> findByResIdOrderByCreatedAtDesc(Integer resId);

    // === THÊM CHO TÍNH NĂNG THỐNG KÊ (11) ===
    
    // Thống kê tổng quan: Doanh thu (chỉ tính đơn COMPLETED), Tổng đơn, Đơn hủy
    @Query(value = "SELECT " +
           "SUM(CASE WHEN order_status = 'COMPLETED' THEN final_amount ELSE 0 END) as totalRevenue, " +
           "COUNT(order_id) as totalOrders, " +
           "SUM(CASE WHEN order_status = 'CANCELLED' THEN 1 ELSE 0 END) as cancelledOrders " +
           "FROM orders WHERE res_id = ?1", nativeQuery = true)
    Map<String, Object> getRestaurantSummary(Integer resId);

    // Thống kê doanh thu theo ngày (7 ngày gần nhất có phát sinh đơn)
    @Query(value = "SELECT DATE(created_at) as name, SUM(final_amount) as revenue " +
           "FROM orders WHERE res_id = ?1 AND order_status = 'COMPLETED' " +
           "GROUP BY DATE(created_at) ORDER BY name ASC LIMIT 7", nativeQuery = true)
    List<Map<String, Object>> getRevenueByDate(Integer resId);

    // Top 5 món bán chạy nhất của quán
    @Query(value = "SELECT item_name as name, SUM(quantity) as sales " +
           "FROM order_item oi " +
           "JOIN orders o ON oi.order_id = o.order_id " +
           "WHERE o.res_id = ?1 AND o.order_status = 'COMPLETED' " +
           "GROUP BY item_name ORDER BY sales DESC LIMIT 5", nativeQuery = true)
    List<Map<String, Object>> getTopSellingItems(Integer resId);

    //Kiểm tra khách đã dùng mã này ở đơn nào CHƯA BỊ HỦY chưa
    boolean existsByCustomerIdAndVoucherIdAndOrderStatusNot(Integer customerId, Integer voucherId, String orderStatus);
}