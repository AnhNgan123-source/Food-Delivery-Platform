package com.nhom8.backend.controller;

import com.nhom8.backend.model.Voucher;
import com.nhom8.backend.repository.OrderRepository;
import com.nhom8.backend.repository.VoucherRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/v1/admin/vouchers")
@CrossOrigin(origins = "*") // Để React gọi qua không bị lỗi CORS
public class VoucherController {

    @Autowired
    private VoucherRepository voucherRepository;

    @Autowired
    private OrderRepository orderRepository;

    // GET: Lấy danh sách voucher
    @GetMapping
    public ResponseEntity<?> getAllVouchers() {
        List<Voucher> list = voucherRepository.findAllByOrderByCreatedAtDesc();
        Map<String, Object> response = new HashMap<>();
        response.put("status", "success");
        response.put("data", list);
        return ResponseEntity.ok(response);
    }

    // POST: Tạo voucher mới
    @PostMapping
    public ResponseEntity<?> createVoucher(@RequestBody Voucher voucher) {
        try {
            // Đảm bảo các giá trị mặc định nếu React gửi thiếu
            if (voucher.getUsedCount() == null) voucher.setUsedCount(0);
            if (voucher.getIsActive() == null) voucher.setIsActive(1);
            
            Voucher saved = voucherRepository.save(voucher);
            return ResponseEntity.ok(saved);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Lỗi rồi bạn ơi: " + e.getMessage());
        }
    }
    //Lấy voucher hợp lệ 
@GetMapping("/available")
public ResponseEntity<?> getAvailableVouchers(
        @RequestParam BigDecimal cartValue,
        @RequestParam Integer userId) { // <--- Thêm tham số userId ở đây
    
    // 1. Lấy danh sách voucher đủ điều kiện đơn tối thiểu và còn hạn từ DB
    List<Voucher> allAvailable = voucherRepository.findAvailableVouchers(cartValue);
    
    // 2. Lọc bỏ những mã mà userId này đã dùng rồi (trừ đơn bị CANCELLED)
    List<Voucher> filteredList = allAvailable.stream().filter(v -> {
        // Kiểm tra xem khách đã có đơn nào dùng mã này chưa
        boolean alreadyUsed = orderRepository.existsByCustomerIdAndVoucherIdAndOrderStatusNot(
                userId, 
                v.getVoucherId(), 
                "CANCELLED"
        );
        // Trả về true nếu CHƯA dùng (alreadyUsed == false)
        return !alreadyUsed;
    }).toList(); 

    return ResponseEntity.ok(Map.of(
        "status", "success", 
        "data", filteredList
    ));
}
    
    // Đổi từ xóa hẳn sang dừng (cập nhật isActive = 0)
    @PutMapping("/{id}/stop")
    public ResponseEntity<?> stopVoucher(@PathVariable Integer id) {
        try {
            if (!voucherRepository.existsById(id)) {
                return ResponseEntity.status(404).body(Map.of("message", "Không tìm thấy voucher"));
            }
            voucherRepository.stopVoucher(id);
            return ResponseEntity.ok(Map.of("status", "success", "message", "Đã dừng chiến dịch!"));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Lỗi: " + e.getMessage());
        }
    }
}