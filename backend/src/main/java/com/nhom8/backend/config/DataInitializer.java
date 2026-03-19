package com.nhom8.backend.config;

import com.nhom8.backend.model.User;
import com.nhom8.backend.model.Role;
import com.nhom8.backend.model.Category;
import com.nhom8.backend.repository.CategoryRepository;
import com.nhom8.backend.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

@Component
public class DataInitializer implements CommandLineRunner {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private CategoryRepository categoryRepository;

    @Override
    public void run(String... args) throws Exception {
        // ===== INIT ADMIN =====
        // 1. Kiểm tra xem trong DB đã có tài khoản admin chưa
        if (userRepository.findByUsername("admin").isEmpty()) {

            User admin = new User();
            admin.setUsername("admin");
            admin.setPassword(passwordEncoder.encode("123456"));
            admin.setEmail("nhuvy.admin@gmail.com");
            admin.setRole(Role.ADMIN);

            // --- THÊM CÁC THÔNG TIN MỚI Ở ĐÂY ---
            admin.setFull_name("Nguyễn Như Vy");
            admin.setPhone("0912345678");
            admin.setAddress("TP. Hồ Chí Minh, Việt Nam");
            admin.setIs_active(1);
            // ------------------------------------

            userRepository.save(admin);

            System.out.println(">>>>> Đã khởi tạo tài khoản Admin: Nguyễn Như Vy (admin/123456) <<<<<");
        } else {
            System.out.println(">>>>> Tài khoản Admin đã tồn tại, không cập nhật thêm. <<<<<");
        }

        // ================== INIT CATEGORY ==================
        if (categoryRepository.count() == 0) {
            String[] names = {
                    "Cơm", "Bún", "Phở", "Mì", "Cháo", "Đồ chiên",
                    "Đồ nướng", "Lẩu", "Hải sản", "Ăn vặt",
                    "Tráng miệng", "Đồ uống", "Cơm tấm", "Bánh mì",
                    "Bánh xèo", "Gỏi / Salad"
            };

            for (String n : names) {
                Category cat = new Category();
                cat.setCat_name(n);
                categoryRepository.save(cat);
            }

            System.out.println(">>>>> Đã khởi tạo 16 CATEGORY thành công! <<<<<");
        }
    }
}