package com.nhom8.backend.service;

import com.nhom8.backend.model.Shipper;
import com.nhom8.backend.repository.ShipperRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
@RequiredArgsConstructor
public class ShipperService {
    private final ShipperRepository shipperRepository;

    public List<Shipper> getAllShippers() { return shipperRepository.findAll(); }
    
    public List<Shipper> getShippersByRestaurant(Integer resId) {
        return shipperRepository.findByRestaurantResId(resId);
    }

    public Shipper saveShipper(Shipper shipper) {
        return shipperRepository.save(shipper);
    }

    public void deleteShipper(Integer id) {
        shipperRepository.deleteById(id);
    }

    public Shipper findById(Integer id) {
        return shipperRepository.findById(id).orElse(null);
    }
}