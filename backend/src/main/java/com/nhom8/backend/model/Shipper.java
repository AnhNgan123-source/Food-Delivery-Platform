package com.nhom8.backend.model;

import jakarta.persistence.*;
import lombok.*;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

@Entity
@Table(name = "shipper") 
@Getter 
@Setter 
@NoArgsConstructor 
@AllArgsConstructor
public class Shipper {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "shipper_id") // Khớp với cột shipper_id trong DB
    private Integer shipperId;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "res_id", nullable = false)

    @JsonIgnoreProperties({"hibernateLazyInitializer", "handler", "shippers"})
    private Restaurant restaurant;

    @Column(name = "shipper_name", nullable = false) 
    private String shipperName;

    @Column(name = "phone", nullable = false, length = 15)
    private String phone;

    @Column(name = "vehicle_no", length = 20) 
    private String vehicleNo;

    @Enumerated(EnumType.STRING)
    @Column(name = "status")
    private ShipperStatus status = ShipperStatus.IDLE;

    public enum ShipperStatus {
        IDLE, BUSY
    }
}