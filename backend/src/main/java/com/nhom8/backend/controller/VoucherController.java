package com.nhom8.backend.controller;

import com.nhom8.backend.model.Voucher;
import com.nhom8.backend.repository.VoucherRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/v1/admin/vouchers")
@CrossOrigin(origins = "*") // Để React gọi qua không bị lỗi CORS
public class VoucherController {

    @Autowired
    private VoucherRepository voucherRepository;

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
            return ResponseEntity.badRequest().body("Lỗi rồi sếp ơi: " + e.getMessage());
        }
    }
}