package com.nhom8.backend.service;

import com.nhom8.backend.model.MenuItem;
import com.nhom8.backend.repository.MenuItemRepository;
import org.springframework.stereotype.Service;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.List;
import java.util.Optional;

@Service
public class MenuItemService {

    private final MenuItemRepository menuItemRepository;
    // Đường dẫn để tìm và xóa file vật lý
    private static final String UPLOAD_DIR = "uploads/";

    public MenuItemService(MenuItemRepository menuItemRepository) {
        this.menuItemRepository = menuItemRepository;
    }

    // ==========================================
    // PHẦN 1: DÀNH CHO KHÁCH HÀNG (CUSTOMER)
    // ==========================================

    // Khách hàng chỉ xem được món đang mở bán
    public List<MenuItem> getAvailableMenuForCustomer(Integer resId) {
        return menuItemRepository.findAvailableMenu(resId);
    }

    // ==========================================
    // PHẦN 2: DÀNH CHO CHỦ NHÀ HÀNG (RESTAURANT)
    // ==========================================

    // Chủ quán xem được tất cả (kể cả món đã ẩn)
    public List<MenuItem> getAllMenuByRestaurant(Integer resId) {
        return menuItemRepository.findAllByRestaurant(resId);
    }

    // Tạo món mới
    public MenuItem createMenuItem(MenuItem item) {
        return menuItemRepository.save(item);
    }

    // Cập nhật món
    public MenuItem updateMenuItem(Integer id, MenuItem newItem) {
        MenuItem item = menuItemRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Menu item not found"));

        // Xử lý ảnh: Nếu có ảnh mới, xóa ảnh cũ trước khi cập nhật
        if (newItem.getItemImage() != null && item.getItemImage() != null) {
            deletePhysicalFile(item.getItemImage());
            item.setItemImage(newItem.getItemImage());
        } else if (newItem.getItemImage() != null) {
            // Trường hợp trước đó chưa có ảnh, giờ mới thêm
            item.setItemImage(newItem.getItemImage());
        }
        // Nếu newItem.getItem_image() là null, ta giữ nguyên item.getItem_image() cũ

        item.setItemName(newItem.getItemName());
        item.setPrice(newItem.getPrice());
        item.setDescription(newItem.getDescription());
        item.setCatId(newItem.getCatId());

        if (newItem.getResId() != null) {
        item.setResId(newItem.getResId());
    }
        return menuItemRepository.save(item);
    }

    public Optional<MenuItem> getMenuItemById(Integer id) {
        return menuItemRepository.findById(id);
    }

    // Xóa món
    public void deleteMenuItem(Integer id) {
        // Trước khi xóa trong DB, tìm để xóa file vật lý
        menuItemRepository.findById(id).ifPresent(item -> {
            if (item.getItemImage() != null) {
                deletePhysicalFile(item.getItemImage());
            }
        });
        menuItemRepository.deleteById(id);
    }

    // Bật/tắt trạng thái món ăn (Còn hàng / Hết hàng)
    public MenuItem toggleAvailability(Integer id) {
        MenuItem item = menuItemRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy món"));

        // Logic đổi trạng thái cực gọn: Đang 1 thì thành 0, đang 0 thì thành 1
        item.setIsAvailable(item.getIsAvailable() == 1 ? 0 : 1);

        return menuItemRepository.save(item);
    }

    /**
     * Hàm phụ trợ để xóa file khỏi thư mục uploads
     */
    private void deletePhysicalFile(String fileName) {
        try {
            Path path = Paths.get(UPLOAD_DIR + fileName);
            Files.deleteIfExists(path);
            System.out.println("Đã xóa file vật lý: " + fileName);
        } catch (IOException e) {
            System.err.println("Lỗi khi xóa file: " + e.getMessage());
        }
    }
}