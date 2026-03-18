package com.nhom8.backend.service;

import com.nhom8.backend.model.MenuItem;
import com.nhom8.backend.repository.MenuItemRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class MenuItemService {

    private final MenuItemRepository menuItemRepository;

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

        // Lưu ý: Tên hàm có dấu gạch dưới theo chuẩn Entity
        item.setItem_name(newItem.getItem_name());
        item.setPrice(newItem.getPrice());
        item.setDescription(newItem.getDescription());
        item.setItem_image(newItem.getItem_image());
        item.setCat_id(newItem.getCat_id());

        return menuItemRepository.save(item);
    }

    // Xóa món
    public void deleteMenuItem(Integer id) {
        menuItemRepository.deleteById(id);
    }

    // Bật/tắt trạng thái món ăn (Còn hàng / Hết hàng)
    public MenuItem toggleAvailability(Integer id) {
        MenuItem item = menuItemRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy món"));

        // Logic đổi trạng thái cực gọn: Đang 1 thì thành 0, đang 0 thì thành 1
        item.setIs_available(item.getIs_available() == 1 ? 0 : 1);

        return menuItemRepository.save(item);
    }
}