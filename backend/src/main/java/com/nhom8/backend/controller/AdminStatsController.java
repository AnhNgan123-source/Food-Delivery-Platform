package com.nhom8.backend.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/v1/admin/stats")
@CrossOrigin("*")
public class AdminStatsController {

    @Autowired
    private JdbcTemplate jdbcTemplate;

    @GetMapping("/overview")
    public ResponseEntity<?> getOverview() {
        String sql = "SELECT " +
                "(SELECT IFNULL(SUM(final_amount), 0) FROM Orders WHERE order_status = 'COMPLETED') as totalRevenue, " +
                "(SELECT COUNT(*) FROM Orders) as totalOrders, " +
                "(SELECT COUNT(*) FROM User WHERE role = 'CUSTOMER') as totalUsers, " +
                "(SELECT COUNT(*) FROM Restaurant WHERE is_active = 1) as activeRes";
        
        Map<String, Object> data = jdbcTemplate.queryForMap(sql);
        return ResponseEntity.ok(Map.of("status", "success", "data", data));
    }

    @GetMapping("/revenue-history")
    public ResponseEntity<?> getRevenueHistory() {
        // SỬA LẠI: total_price -> final_amount
        String sql = "SELECT DATE_FORMAT(created_at, '%m/%Y') as name, SUM(final_amount) as revenue " +
                "FROM Orders WHERE order_status = 'COMPLETED' " +
                "GROUP BY name ORDER BY created_at ASC LIMIT 6";
        
        List<Map<String, Object>> data = jdbcTemplate.queryForList(sql);
        return ResponseEntity.ok(Map.of("status", "success", "data", data));
    }

    @GetMapping("/top-performers")
    public ResponseEntity<?> getTopPerformers() {
        String sql = "SELECT r.res_name, COUNT(o.order_id) as totalOrders, SUM(o.final_amount) as revenue, r.rating_avg as rating " +
                "FROM Restaurant r " +
                "JOIN Orders o ON r.res_id = o.res_id " +
                "WHERE o.order_status = 'COMPLETED' " +
                "GROUP BY r.res_id, r.res_name, r.rating_avg " +
                "ORDER BY revenue DESC LIMIT 5";
        
        List<Map<String, Object>> data = jdbcTemplate.queryForList(sql);
        return ResponseEntity.ok(Map.of("status", "success", "data", data));
    }
}