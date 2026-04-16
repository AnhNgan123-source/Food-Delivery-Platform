package com.nhom8.backend.config;

import com.nhom8.backend.model.User;
import com.nhom8.backend.model.Role;
import com.nhom8.backend.model.Category;
import com.nhom8.backend.model.ShippingConfig; // Nhớ import model mới
import com.nhom8.backend.repository.CategoryRepository;
import com.nhom8.backend.repository.UserRepository;
import com.nhom8.backend.repository.ShippingConfigRepository; // Nhớ import repo mới
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.math.BigDecimal;

@Component
public class DataInitializer implements CommandLineRunner {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private CategoryRepository categoryRepository;

    @Autowired
    private ShippingConfigRepository shippingConfigRepository; // Thêm repo này

    @Override
    public void run(String... args) throws Exception {
        // ===== 1. INIT ADMIN =====
        if (userRepository.findByUserName("admin").isEmpty()) {
            User admin = new User();
            admin.setUserName("admin");
            admin.setPassWord(passwordEncoder.encode("123456"));
            admin.setEmail("nhuvy.admin@gmail.com");
            admin.setRole(Role.ADMIN);
            admin.setFullName("Nguyễn Như Vy");
            admin.setPhone("0912345678");
            admin.setAddress("TP. Hồ Chí Minh, Việt Nam");
            admin.setIsActive(1);

            userRepository.save(admin);
            System.out.println(">>>>> Đã khởi tạo tài khoản Admin: Nguyễn Như Vy (admin/123456) <<<<<");
        }

        // ===== 2. INIT CATEGORY =====
        if (categoryRepository.count() == 0) {
            String[] names = {
                    "Cơm", "Bún", "Phở", "Mì", "Cháo", "Đồ chiên",
                    "Đồ nướng", "Lẩu", "Hải sản", "Ăn vặt",
                    "Tráng miệng", "Đồ uống", "Cơm tấm", "Bánh mì",
                    "Bánh xèo", "Gỏi / Salad"
            };

            for (String n : names) {
                Category cat = new Category();
                cat.setCatName(n);
                categoryRepository.save(cat);
            }
            System.out.println(">>>>> Kiem tra xong danh sach CATEGORY! <<<<<");
        
            // ===== 3. INIT SHIPPING CONFIG (NỘI THÀNH/NGOẠI THÀNH) =====
        if (shippingConfigRepository.count() == 0) {
            // Tạo dòng Nội thành
            ShippingConfig noiThanh = new ShippingConfig();
            noiThanh.setAreaName("Nội thành");
            noiThanh.setPrice(new BigDecimal("20000"));
            shippingConfigRepository.save(noiThanh);

            // Tạo dòng Ngoại thành
            ShippingConfig ngoaiThanh = new ShippingConfig();
            ngoaiThanh.setAreaName("Ngoại thành");
            ngoaiThanh.setPrice(new BigDecimal("35000"));
            shippingConfigRepository.save(ngoaiThanh);

            System.out.println(">>>>> Đa khoi tao phi ship: Noi thanh (20k) & Ngoai thanh (35k) <<<<<");
        }
    }
  }
}