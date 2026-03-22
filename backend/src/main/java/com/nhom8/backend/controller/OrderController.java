package com.nhom8.backend.controller;

import com.nhom8.backend.dto.OrderRequest;
import com.nhom8.backend.model.Order;
import com.nhom8.backend.service.OrderService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/v1/orders")
@CrossOrigin(origins = "http://localhost:5173")
public class OrderController {

    private final OrderService orderService;

    // Constructor tay cho Ngân (không dùng Lombok)
    public OrderController(OrderService orderService) {
        this.orderService = orderService;
    }

    // 7.5 Tạo đơn hàng: POST /api/v1/orders
    @PostMapping
    public ResponseEntity<Map<String, Object>> createOrder(@RequestBody OrderRequest request) {
        Map<String, Object> response = new HashMap<>();
        try {
            Order newOrder = orderService.createOrder(request);
            
            // Khởi tạo cấu trúc "success" trực tiếp
            response.put("status", "success");
            response.put("data", newOrder);
            
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            // Khởi tạo cấu trúc "error" trực tiếp
            response.put("status", "error");
            response.put("message", "Yêu cầu không hợp lệ: " + e.getMessage());
            
            return ResponseEntity.status(400).body(response);
        }
    }

        // Trong OrderController.java
    @PutMapping("/{id}/pay")
    public ResponseEntity<Map<String, Object>> updatePaymentStatus(@PathVariable Integer id) {
        Map<String, Object> response = new HashMap<>();
        try {
            orderService.markAsPaid(id);
            response.put("status", "success");
            response.put("message", "Đã cập nhật trạng thái thanh toán thành công");
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            response.put("status", "error");
            response.put("message", e.getMessage());
            return ResponseEntity.status(400).body(response);
        }
    }
    @GetMapping("/history")
public ResponseEntity<Map<String, Object>> getOrderHistory(@RequestParam Integer customerId) {
    Map<String, Object> response = new HashMap<>();
    try {
        // Gọi Service lấy danh sách đơn hàng
        List<Order> history = orderService.getOrdersByCustomerId(customerId);
        
        response.put("status", "success");
        response.put("data", history);
        
        return ResponseEntity.ok(response);
    } catch (Exception e) {
        response.put("status", "error");
        response.put("message", "Không thể lấy lịch sử đơn hàng: " + e.getMessage());
        
        return ResponseEntity.status(500).body(response);
    }
}
}

