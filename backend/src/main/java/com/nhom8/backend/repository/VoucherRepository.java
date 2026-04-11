package com.nhom8.backend.repository;
import com.nhom8.backend.model.Voucher;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.math.BigDecimal;
import java.util.List;

@Repository
public interface VoucherRepository extends JpaRepository<Voucher, Integer> {
    List<Voucher> findAllByOrderByCreatedAtDesc();
    
    // Tìm các voucher hợp lệ theo giá trị đơn hàng
    @Query("SELECT v FROM Voucher v WHERE v.isActive = 1 " +
           "AND v.usedCount < v.usageLimit " +
           "AND (v.endDate IS NULL OR v.endDate > CURRENT_TIMESTAMP) " +
           "AND v.minOrderValue <= :cartValue")
    List<Voucher> findAvailableVouchers(BigDecimal cartValue);
}
