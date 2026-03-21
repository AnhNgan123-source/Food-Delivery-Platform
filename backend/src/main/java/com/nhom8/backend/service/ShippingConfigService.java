package com.nhom8.backend.service;

import com.nhom8.backend.model.ShippingConfig;
import com.nhom8.backend.repository.ShippingConfigRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
public class ShippingConfigService {

    @Autowired
    private ShippingConfigRepository repository;

    public List<ShippingConfig> getAllConfigs() {
        return repository.findAll();
    }

    public void updateConfigs(List<ShippingConfig> configs) {
        for (ShippingConfig incoming : configs) {
            repository.findByAreaName(incoming.getAreaName()).ifPresent(existing -> {
                existing.setPrice(incoming.getPrice());
                repository.save(existing);
            });
        }
    }
}