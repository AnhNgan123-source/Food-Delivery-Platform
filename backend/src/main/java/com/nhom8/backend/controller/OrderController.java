package com.nhom8.backend.controller;

import com.nhom8.backend.dto.OrderRequest;
import com.nhom8.backend.model.Order;
import com.nhom8.backend.dto.ResponseData;
import com.nhom8.backend.service.OrderService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/v1/orders")
@CrossOrigin(origins = "*") // Cho phép tất cả các nguồn để tránh lỗi CORS khi Ngân test
public class OrderController {

    private final OrderService orderService;

    public OrderController(OrderService orderService) {
        this.orderService = orderService;
    }

    // 1. Tạo đơn hàng mới
    @PostMapping
    public ResponseEntity<Map<String, Object>> createOrder(@RequestBody OrderRequest request) {
        Map<String, Object> response = new HashMap<>();
        try {
            Order newOrder = orderService.createOrder(request);
            response.put("status", "success");
            response.put("data", newOrder);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            response.put("status", "error");
            response.put("message", "Lỗi tạo đơn: " + e.getMessage());
            return ResponseEntity.status(400).body(response);
        }
    }

    // 2. Lấy lịch sử đơn hàng của khách hàng
    @GetMapping("/history")
    public ResponseEntity<Map<String, Object>> getOrderHistory(@RequestParam Integer customerId) {
        Map<String, Object> response = new HashMap<>();
        try {
            List<Order> history = orderService.getOrdersByCustomerId(customerId);
            response.put("status", "success");
            response.put("data", history);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            response.put("status", "error");
            response.put("message", "Không thể lấy lịch sử: " + e.getMessage());
            return ResponseEntity.status(500).body(response);
        }
    }

    // 3. Lấy danh sách đơn hàng cho từng Nhà hàng
    @GetMapping("/restaurant/{resId}")
    public ResponseEntity<?> getOrdersByRestaurant(@PathVariable Integer resId) {
        List<Order> orders = orderService.getOrdersByResId(resId);
        return ResponseEntity.ok(new ResponseData("success", orders));
    }

    // // 4. Endpoint quan trọng: Thống kê doanh thu (Để hiện biểu đồ bên React)
    // @GetMapping("/restaurant/{resId}/stats")
    // public ResponseEntity<?> getRestaurantStats(@PathVariable Integer resId) {
    //     try {
    //         Map<String, Object> stats = orderService.getStatsByRestaurant(resId);
    //         return ResponseEntity.ok(new ResponseData("success", stats));
    //     } catch (Exception e) {
    //         return ResponseEntity.status(500).body(new ResponseData("error", e.getMessage()));
    //     }
    // }

    // 5. Cập nhật trạng thái đơn hàng (Xác nhận, Đang nấu, Đang giao...)
    @PutMapping("/{id}/status")
    public ResponseEntity<?> updateOrderStatus(@PathVariable Integer id, @RequestParam String status, @RequestParam(required = false) String reason) {
        try {
            orderService.updateOrderStatus(id, status, reason);
            Map<String, Object> response = new HashMap<>();
            response.put("status", "success");
            response.put("message", "Đã cập nhật trạng thái đơn hàng thành " + status);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            return ResponseEntity.status(400).body(new ResponseData("error", e.getMessage()));
        }
    }

    // 6. Cập nhật trạng thái đã thanh toán (Dùng cho Mock VNPAY)
    @PutMapping("/{id}/pay")
    public ResponseEntity<Map<String, Object>> updatePaymentStatus(@PathVariable Integer id) {
        Map<String, Object> response = new HashMap<>();
        try {
            orderService.markAsPaid(id);
            response.put("status", "success");
            response.put("message", "Thanh toán thành công!");
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            response.put("status", "error");
            response.put("message", e.getMessage());
            return ResponseEntity.status(400).body(response);
        }
    }

    // 7. Lấy chi tiết một đơn hàng cụ thể
    @GetMapping("/{id}")
    public ResponseEntity<?> getOrderById(@PathVariable Integer id) {
        try {
            Order order = orderService.getOrderById(id);
            return ResponseEntity.ok(Map.of("status", "success", "data", order));
        } catch (Exception e) {
            return ResponseEntity.status(404).body(Map.of("status", "error", "message", e.getMessage()));
        }
    }

    // // 8. Điều phối Shipper (Dành cho Admin hoặc Nhà hàng)
    // @PutMapping("/{orderId}/assign-shipper/{shipperId}")
    // public ResponseEntity<?> assignShipper(@PathVariable Integer orderId, @PathVariable Integer shipperId) {
    //     try {
    //         orderService.assignShipperToOrder(orderId, shipperId);
    //         return ResponseEntity.ok(Map.of("status", "success", "message", "Đã điều phối shipper thành công!"));
    //     } catch (Exception e) {
    //         return ResponseEntity.status(400).body(Map.of("status", "error", "message", e.getMessage()));
    //     }
    // }

    // // 9. Lấy tất cả đơn hàng (Dành cho Admin quản lý hệ thống)
    // @GetMapping("/all")
    // public ResponseEntity<?> getAllOrders() {
    //     try {
    //         List<Order> orders = orderService.getAllOrders();
    //         return ResponseEntity.ok(Map.of("status", "success", "data", orders));
    //     } catch (Exception e) {
    //         return ResponseEntity.status(500).body(Map.of("status", "error", "message", e.getMessage()));
    //     }
    // }
}