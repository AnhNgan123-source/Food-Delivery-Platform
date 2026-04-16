package com.nhom8.backend.model;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "Shipper")
@Getter 
@Setter 
@NoArgsConstructor 
@AllArgsConstructor
public class Shipper {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer shipperId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "res_id", nullable = false)
    private Restaurant restaurant;

    @Column(nullable = false)
    private String shipperName;

    @Column(nullable = false, length = 15)
    private String phone;

    @Column(length = 20)
    private String vehicleNo;

    @Enumerated(EnumType.STRING)
    private ShipperStatus status = ShipperStatus.IDLE;

    public enum ShipperStatus {
        IDLE, BUSY
    }
}