package com.nhom8.backend.controller;

import com.nhom8.backend.dto.OrderRequest;
import com.nhom8.backend.model.Order;
import com.nhom8.backend.dto.ResponseData;
import com.nhom8.backend.service.OrderService;
import com.nhom8.backend.service.ShipperService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/v1/orders")
@CrossOrigin(origins = "*") // Cho phép tất cả các nguồn để tránh lỗi CORS khi test
public class OrderController {

    private final OrderService orderService;
    private final ShipperService shipperService;

    public OrderController(OrderService orderService, ShipperService shipperService) {
        this.orderService = orderService;
        this.shipperService = shipperService;
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
            response.put("message", "Yêu cầu không hợp lệ: " + e.getMessage());
            return ResponseEntity.status(400).body(response);
        }
    }

    // Cập nhật trạng thái thanh toán
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

    // Lấy lịch sử đơn hàng của khách
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
            response.put("message", "Không thể lấy lịch sử đơn hàng: " + e.getMessage());
            return ResponseEntity.status(500).body(response);
        }
    }

    @GetMapping("/restaurant/{resId}")
    public ResponseEntity<?> getOrdersByRestaurant(@PathVariable Integer resId) {
        List<Order> orders = orderService.getOrdersByResId(resId);
        return ResponseEntity.ok(new ResponseData("success", orders));
    }

    // === THÊM ENDPOINT THỐNG KÊ DOANH THU ===
    @GetMapping("/restaurant/{resId}/stats")
    public ResponseEntity<?> getRestaurantStats(@PathVariable Integer resId) {
        try {
            Map<String, Object> stats = orderService.getStatsByRestaurant(resId);
            return ResponseEntity.ok(new ResponseData("success", stats));
        } catch (Exception e) {
            return ResponseEntity.status(500).body(new ResponseData("error", e.getMessage()));
        }
    }

    // Cập nhật trạng thái đơn hàng (Đang nấu, Hoàn thành, Hủy...)
    @PutMapping("/{id}/status")
    public ResponseEntity<?> updateOrderStatus(
        @PathVariable Integer id, 
        @RequestParam String status, 
        @RequestParam(required = false) String reason,
        @RequestParam(required = false) Integer shipperId // THÊM DÒNG NÀY
    ) {
        try {
            // Nếu status là SHIPPING và có shipperId, ta gọi hàm assign trong service luôn cho tiện
            if ("SHIPPING".equals(status) && shipperId != null) {
                orderService.assignShipperToOrder(id, shipperId);
            } else {
                orderService.updateOrderStatus(id, status, reason);
            }
            
            Map<String, Object> response = new HashMap<>();
            response.put("status", "success");
            response.put("message", "Đã cập nhật trạng thái thành " + status);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            return ResponseEntity.status(400).body(new ResponseData("error", e.getMessage()));
        }
    }

    // Lấy chi tiết một đơn hàng
    @GetMapping("/{id}")
    public ResponseEntity<?> getOrderById(@PathVariable Integer id) {
        try {
            Order order = orderService.getOrderById(id);
            Map<String, Object> response = new HashMap<>();
            response.put("status", "success");
            response.put("data", order);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            return ResponseEntity.status(404).body(new HashMap<String, String>() {{
                put("status", "error");
                put("message", e.getMessage());
            }});
        }
    }

    @PutMapping("/{orderId}/assign-shipper/{shipperId}")
    public ResponseEntity<?> assignShipper(@PathVariable Integer orderId, @PathVariable Integer shipperId) {
        try {
            orderService.assignShipperToOrder(orderId, shipperId);
            return ResponseEntity.ok(Map.of(
                "status", "success", 
                "message", "Đã điều phối shipper thành công!"
            ));
        } catch (Exception e) {
            return ResponseEntity.status(400).body(Map.of(
                "status", "error",
                "message", e.getMessage()
            ));
        }
    }
    
    @GetMapping("/all")
    public ResponseEntity<?> getAllOrders() {
        try {
            List<Order> orders = orderService.getAllOrders();
            Map<String, Object> response = new HashMap<>();
            response.put("status", "success");
            response.put("data", orders);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            return ResponseEntity.status(500).body(Map.of("status", "error", "message", e.getMessage()));
        }
    }


    // CHỨC NĂNG HỦY ĐƠN HÀNG
    @PutMapping("/{id}/cancel")
    public ResponseEntity<?> cancelOrder(@PathVariable Integer id, @RequestParam(required = false) String reason) {
    try {
        // Gọi hàm Service 
        // Truyền "CUSTOMER" vì đây là API dành cho khách hàng
        orderService.cancelOrder(id, "CUSTOMER", reason);
        
        return ResponseEntity.ok(Map.of(
            "status", "success", 
            "message", "Đã hủy đơn hàng và hoàn voucher thành công!"
        ));
    } catch (RuntimeException e) {
        // Trả về lỗi nếu đơn đã nấu không cho hủy
        return ResponseEntity.badRequest().body(e.getMessage());
    }
}

    @GetMapping("/shippers-by-restaurant/{resId}")
    public ResponseEntity<?> getShippersForMerchant(@PathVariable Integer resId) {
        // Gọi hàm trong ShipperService mà mình đã bàn lúc nãy
        return ResponseEntity.ok(new ResponseData("success", shipperService.getShippersByRestaurant(resId)));
    }
}