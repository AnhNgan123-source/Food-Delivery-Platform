package com.nhom8.backend.controller;

import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

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
    
    try {
        Map<String, Object> queryResult = jdbcTemplate.queryForMap(sql);
        Map<String, Object> data = Map.of(
            "totalRevenue", queryResult.getOrDefault("totalRevenue", queryResult.get("totalrevenue")),
            "totalOrders", queryResult.getOrDefault("totalOrders", queryResult.get("totalorders")),
            "totalUsers", queryResult.getOrDefault("totalUsers", queryResult.get("totalusers")),
            "activeRes", queryResult.getOrDefault("activeRes", queryResult.get("activeres"))
        );

        return ResponseEntity.ok(Map.of("status", "success", "data", data));
    } catch (Exception e) {
        return ResponseEntity.status(500).body(Map.of("status", "error", "message", e.getMessage()));
    }
}

@GetMapping("/revenue-history")
    public ResponseEntity<?> getRevenueHistory() {
        // Dùng IFNULL để đảm bảo revenue luôn là số, không bị null
        String sql = "SELECT DATE_FORMAT(created_at, '%m/%Y') as name, " +
                     "IFNULL(SUM(final_amount), 0) as revenue " +
                     "FROM Orders " + 
                     "WHERE order_status = 'COMPLETED' " +
                     "GROUP BY DATE_FORMAT(created_at, '%m/%Y') " +
                     "ORDER BY STR_TO_DATE(CONCAT('01/', name), '%d/%m/%Y') ASC LIMIT 6";
        
        try {
            List<Map<String, Object>> data = jdbcTemplate.queryForList(sql);
            return ResponseEntity.ok(Map.of("status", "success", "data", data));
        } catch (Exception e) {
            // Log lỗi ra console để sếp xem chính xác là thiếu cột hay sai bảng
            e.printStackTrace(); 
            return ResponseEntity.status(500).body(Map.of("status", "error", "message", e.getMessage()));
        }
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