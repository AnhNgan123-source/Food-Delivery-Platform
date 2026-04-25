package com.nhom8.backend.service;

import com.nhom8.backend.dto.OrderRequest;
import com.nhom8.backend.model.MenuItem;
import com.nhom8.backend.model.Order;
import com.nhom8.backend.model.OrderItem;
import com.nhom8.backend.model.Shipper;
import com.nhom8.backend.repository.MenuItemRepository;
import com.nhom8.backend.repository.OrderItemRepository;
import com.nhom8.backend.repository.OrderRepository;
import com.nhom8.backend.repository.ShipperRepository;
import com.nhom8.backend.repository.VoucherRepository;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;
import java.util.HashMap;
import java.util.stream.Collectors;

@Service
public class OrderService {

    private final OrderRepository orderRepository;
    private final OrderItemRepository orderItemRepository;
    private final MenuItemRepository menuItemRepository;
    private final ShipperRepository shipperRepository; 
    private final VoucherRepository voucherRepository; 
    
    @Autowired
    private SimpMessagingTemplate messagingTemplate;

    // Cập nhật Constructor để Inject thêm ShipperRepository
    public OrderService(OrderRepository orderRepository, 
                        OrderItemRepository orderItemRepository,
                        MenuItemRepository menuItemRepository,
                        ShipperRepository shipperRepository,
                        VoucherRepository voucherRepository,
                        SimpMessagingTemplate messagingTemplate) {
        this.orderRepository = orderRepository;
        this.orderItemRepository = orderItemRepository;
        this.menuItemRepository = menuItemRepository;
        this.shipperRepository = shipperRepository; 
        this.voucherRepository = voucherRepository;
        this.messagingTemplate = messagingTemplate;
    }

    @Transactional
    public Order createOrder(OrderRequest request) {
        Order order = new Order();
        order.setCustomerId(request.getCustomerId());
        order.setResId(request.getResId());
        order.setDeliveryAddress(request.getDeliveryAddress());
        order.setNote(request.getNote());
        order.setPaymentMethod(request.getPaymentMethod()); // CASH OR VNPAY
        order.setSubtotal(request.getSubtotal());
        order.setShippingFee(request.getShippingFee());
        order.setTotalDiscount(request.getTotalDiscount());
        order.setFinalAmount(request.getFinalAmount());
        order.setCreatedAt(LocalDateTime.now());
        order.setCancellationReason(null);

        
            // 2. XỬ LÝ VOUCHER
            if (request.getVoucherId() != null) {
                // CHÈN THÊM LOGIC ( 1 VOUCHER/ KHÁCH HÀNG)
                boolean alreadyUsed = orderRepository.existsByCustomerIdAndVoucherIdAndOrderStatusNot(
                    request.getCustomerId(), 
                    request.getVoucherId(), 
                    "CANCELLED"
                );

                if (alreadyUsed) {
                    throw new RuntimeException("Bạn đã sử dụng mã giảm giá này rồi!");
                }
                
            // 3. LOGIC TRỪ LƯỢT DÙNG VOUCHER
            voucherRepository.findById(request.getVoucherId()).ifPresent(voucher -> {
                // Tăng số lượt đã dùng
                int currentUsed = voucher.getUsedCount() != null ? voucher.getUsedCount() : 0;
                voucher.setUsedCount(currentUsed + 1);
                
                // Nếu đạt giới hạn thì có thể set isActive = 0 
                if (voucher.getUsedCount() >= voucher.getUsageLimit()) {
                    voucher.setIsActive(0);
                }
                
                voucherRepository.save(voucher); // Lưu lại thay đổi vào DB
            });
            order.setVoucherId(request.getVoucherId());
        }
        
        if ("CASH".equalsIgnoreCase(request.getPaymentMethod())) {
            order.setOrderStatus("PENDING");
            order.setPaymentStatus("UNPAID");
        } else {
            order.setOrderStatus("AWAITING_PAYMENT");
            order.setPaymentStatus("UNPAID");
        }

        Order savedOrder = orderRepository.save(order);

        List<OrderItem> orderItems = request.getItems().stream().map(itemRequest -> {
            OrderItem orderItem = new OrderItem();
            orderItem.setOrderId(savedOrder.getOrderId());
            orderItem.setItemId(itemRequest.getItemId());
            orderItem.setQuantity(itemRequest.getQuantity());
            orderItem.setPriceAtOrder(itemRequest.getPriceAtOrder());
            
            String itemNameFromDB = menuItemRepository.findById(itemRequest.getItemId())
                    .map(MenuItem::getItemName)
                    .orElse("Món ăn không xác định");
            orderItem.setItemName(itemNameFromDB);

            return orderItem;
        }).collect(Collectors.toList());

        orderItemRepository.saveAll(orderItems);
        savedOrder.setItems(orderItems);
        if ("CASH".equalsIgnoreCase(savedOrder.getPaymentMethod())) {
        String restaurantTopic = "/topic/restaurant/" + savedOrder.getResId();
        // SỬA: Gửi nguyên object savedOrder thay vì String
        messagingTemplate.convertAndSend(restaurantTopic, savedOrder); 
    }

        return savedOrder;
    }

    @Transactional
    public void markAsPaid(Integer orderId) {
        Order order = orderRepository.findById(orderId)
            .orElseThrow(() -> new RuntimeException("Không tìm thấy đơn hàng"));
        
        order.setPaymentStatus("PAID");
        order.setPaidAt(LocalDateTime.now());
        order.setOrderStatus("CONFIRMED");
        orderRepository.save(order);

        messagingTemplate.convertAndSend("/topic/order/" + orderId, "CONFIRMED");
        messagingTemplate.convertAndSend("/topic/restaurant/" + order.getResId(), order);    }

    @Transactional
    public void markAsCompleted(Integer orderId) {
        Order order = orderRepository.findById(orderId)
            .orElseThrow(() -> new RuntimeException("Không tìm thấy đơn hàng"));
        
        order.setOrderStatus("COMPLETED");
        order.setCompletedAt(LocalDateTime.now());
        
        // Nếu có shipper, trả shipper về trạng thái IDLE khi hoàn thành đơn
        if (order.getShipper() != null) {
            Shipper shipper = order.getShipper();
            shipper.setStatus(Shipper.ShipperStatus.IDLE);
            shipperRepository.save(shipper);
        }

        orderRepository.save(order);
    }

    public Map<String, Object> getStatsByRestaurant(Integer resId) {
        Map<String, Object> stats = new HashMap<>();
        stats.put("summary", orderRepository.getRestaurantSummary(resId));
        stats.put("chart", orderRepository.getRevenueByDate(resId));
        stats.put("topItems", orderRepository.getTopSellingItems(resId));
        return stats;
    }

    public List<Order> getOrdersByCustomerId(Integer customerId) {
        if (customerId == null) {
            throw new RuntimeException("Bạn ơi, ID khách hàng không được để trống!");
        }
        return orderRepository.findByCustomerIdOrderByCreatedAtDesc(customerId);
    }

    public List<Order> getOrdersByResId(Integer resId) {
        return orderRepository.findByResIdOrderByCreatedAtDesc(resId);
    }

    public Order getOrderById(Integer orderId) {
        return orderRepository.findById(orderId)
                .orElseThrow(() -> new RuntimeException("Bạn ơi, hệ thống không tìm thấy đơn hàng mang mã #" + orderId));
    }

    @Transactional
    public void updateOrderStatus(Integer orderId, String status, String reason) {
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy đơn hàng"));
        
        order.setOrderStatus(status);

        if ("CANCELLED".equals(status) && reason != null) {
            order.setCancellationReason(reason);
            // Nếu hủy đơn mà đã có shipper, giải phóng shipper luôn
            if (order.getShipper() != null) {
                Shipper s = order.getShipper();
                s.setStatus(Shipper.ShipperStatus.IDLE);
                shipperRepository.save(s);
            }
        }
        
        if ("COMPLETED".equals(status)) {
            order.setCompletedAt(LocalDateTime.now());
            if (order.getShipper() != null) {
                Shipper s = order.getShipper();
                s.setStatus(Shipper.ShipperStatus.IDLE);
                shipperRepository.save(s);
            }
        }
        
        orderRepository.save(order);
        messagingTemplate.convertAndSend("/topic/order/" + orderId, status + (reason != null ? ":" + reason : ""));
        messagingTemplate.convertAndSend("/topic/restaurant/" + order.getResId(), "UPDATE_LIST");
    }

    // === THÊM HÀM GÁN SHIPPER MÀ CONTROLLER ĐANG GỌI ===
    @Transactional
    public void assignShipperToOrder(Integer orderId, Integer shipperId) {
        Order order = orderRepository.findById(orderId)
            .orElseThrow(() -> new RuntimeException("Không tìm thấy đơn hàng"));
            
        Shipper shipper = shipperRepository.findById(shipperId)
            .orElseThrow(() -> new RuntimeException("Không tìm thấy shipper"));

        // Cập nhật quan hệ và trạng thái
        order.setShipper(shipper);
        order.setOrderStatus("SHIPPING");
        shipper.setStatus(Shipper.ShipperStatus.BUSY);

        orderRepository.save(order);
        shipperRepository.save(shipper);

        // Báo qua WebSocket cho khách hàng biết đang đi giao
        messagingTemplate.convertAndSend("/topic/order/" + orderId, "SHIPPING");
    }

    public List<Order> getAllOrders() {
        return orderRepository.findAll(); 
    }
    


    // HỦY ĐƠN HÀNG DÀNH CHO KHÁCH HÀNG
    @Transactional
    public void cancelOrder(Integer orderId, String role, String reason) {
    // 1. Tìm đơn hàng
    Order order = orderRepository.findById(orderId)
            .orElseThrow(() -> new RuntimeException("Không tìm thấy đơn hàng #" + orderId));

    // 2. Kiểm tra logic: Chỉ cho phép hoàn voucher nếu chưa nấu (PENDING/AWAITING_PAYMENT)
    String status = order.getOrderStatus();
    boolean canRefund = "PENDING".equals(status) || "AWAITING_PAYMENT".equals(status);

    // Nếu khách tự hủy mà đơn đã CONFIRMED hoặc PREPARING thì chặn lại
    if ("CUSTOMER".equals(role) && !canRefund) {
        throw new RuntimeException("Đơn hàng đã được quán xử lý, bạn không thể tự hủy lúc này!");
    }

    // 3. Cập nhật trạng thái đơn thành CANCELLED
    order.setOrderStatus("CANCELLED");

    // Gán lý do từ tham số truyền vào, nếu rỗng thì mới lấy mặc định
    if (reason != null && !reason.trim().isEmpty()) {
        order.setCancellationReason(reason);
    } else {
        order.setCancellationReason("CUSTOMER".equals(role) ? "Khách hàng hủy đơn" : "Nhà hàng không thể phục vụ");
    }

    orderRepository.save(order);
    messagingTemplate.convertAndSend("/topic/restaurant/" + order.getResId(), order);   

    // 4. LOGIC HOÀN VOUCHER (Nếu đủ điều kiện chưa nấu)
    if (canRefund && order.getVoucherId() != null) {
        voucherRepository.findById(order.getVoucherId()).ifPresent(v -> {
            if (v.getUsedCount() > 0) {
                v.setUsedCount(v.getUsedCount() - 1); // Trả lại 1 lượt
                v.setIsActive(1); // Mở lại mã nếu lỡ bị khóa do hết lượt
                voucherRepository.save(v);
            }
        });
    }
}

}