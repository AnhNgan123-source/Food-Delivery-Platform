package com.nhom8.backend.model;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "Shipper")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor
public class Shipper {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer shipperId;

    @Column(nullable = false)
    private String shipperName;

    @Column(nullable = false)
    private String phone;

    private String vehicleNo;

    @Enumerated(EnumType.STRING)
    private ShipperStatus status = ShipperStatus.IDLE;

    public enum ShipperStatus {
        IDLE, BUSY
    }
}