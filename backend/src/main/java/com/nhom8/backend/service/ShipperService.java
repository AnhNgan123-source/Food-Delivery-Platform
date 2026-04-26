package com.nhom8.backend.service;

import com.nhom8.backend.model.Restaurant;
import com.nhom8.backend.model.Shipper;
import com.nhom8.backend.repository.RestaurantRepository;
import com.nhom8.backend.repository.ShipperRepository;

import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
@RequiredArgsConstructor
public class ShipperService {
    private final ShipperRepository shipperRepository;
    private final RestaurantRepository restaurantRepository; 

    public List<Shipper> getAllShippers() { return shipperRepository.findAll(); }
    
    public List<Shipper> getShippersByRestaurant(Integer resId) {
        return shipperRepository.findByRestaurantResId(resId);
    }

    @Transactional
        public Shipper saveShipper(Shipper shipper) {
            // 1. Tìm nhà hàng thật từ DB dựa trên ID mà React gửi lên
            Integer resId = shipper.getRestaurant().getResId();
            Restaurant res = restaurantRepository.findById(resId)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy nhà hàng!"));
                
            // 2. Gán Object thật (đã đầy đủ thông tin) vào Shipper
            shipper.setRestaurant(res);
            if (shipper.getStatus() == null) {
            shipper.setStatus(Shipper.ShipperStatus.IDLE);}
            
            // 3. Lúc này save mới là an toàn nhất
            return shipperRepository.save(shipper);
        }

    public void deleteShipper(Integer id) {
        shipperRepository.deleteById(id);
    }

    public Shipper findById(Integer id) {
        return shipperRepository.findById(id).orElse(null);
    }

    @Transactional
    public Shipper updateShipper(Integer id, Shipper updatedData) {
        Shipper existing = shipperRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Tài xế không tồn tại"));

        existing.setShipperName(updatedData.getShipperName());
        existing.setPhone(updatedData.getPhone());
        existing.setVehicleNo(updatedData.getVehicleNo());

        // Cập nhật lại nhà hàng nếu cần
        Integer resId = updatedData.getRestaurant().getResId();
        Restaurant res = restaurantRepository.findById(resId).orElseThrow();
        existing.setRestaurant(res);

        return shipperRepository.save(existing);
    }
}
