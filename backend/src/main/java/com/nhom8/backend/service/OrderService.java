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
    private final ShipperRepository shipperRepository; // Thêm ShipperRepository
    
    @Autowired
    private SimpMessagingTemplate messagingTemplate;

    // Cập nhật Constructor để Inject thêm ShipperRepository
    public OrderService(OrderRepository orderRepository, 
                        OrderItemRepository orderItemRepository,
                        MenuItemRepository menuItemRepository,
                        ShipperRepository shipperRepository, // Inject vào đây
                        SimpMessagingTemplate messagingTemplate) {
        this.orderRepository = orderRepository;
        this.orderItemRepository = orderItemRepository;
        this.menuItemRepository = menuItemRepository;
        this.shipperRepository = shipperRepository; // Gán vào đây
        this.messagingTemplate = messagingTemplate;
    }

    @Transactional
    public Order createOrder(OrderRequest request) {
        Order order = new Order();
        order.setCustomerId(request.getCustomerId());
        order.setResId(request.getResId());
        order.setDeliveryAddress(request.getDeliveryAddress());
        order.setNote(request.getNote());
        order.setPaymentMethod(request.getPaymentMethod());
        order.setSubtotal(request.getSubtotal());
        order.setShippingFee(request.getShippingFee());
        order.setTotalDiscount(request.getTotalDiscount());
        order.setFinalAmount(request.getFinalAmount());
        order.setCreatedAt(LocalDateTime.now());
        
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

        if ("CASH".equalsIgnoreCase(savedOrder.getPaymentMethod())) {
            String restaurantTopic = "/topic/restaurant/" + savedOrder.getResId();
            messagingTemplate.convertAndSend(restaurantTopic, "NEW_ORDER:" + savedOrder.getOrderId());
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
        messagingTemplate.convertAndSend("/topic/restaurant/" + order.getResId(), "NEW_ORDER:" + orderId);
    }

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
            throw new RuntimeException("Ngân ơi, ID khách hàng không được để trống!");
        }
        return orderRepository.findByCustomerIdOrderByCreatedAtDesc(customerId);
    }

    public List<Order> getOrdersByResId(Integer resId) {
        return orderRepository.findByResIdOrderByCreatedAtDesc(resId);
    }

    public Order getOrderById(Integer orderId) {
        return orderRepository.findById(orderId)
                .orElseThrow(() -> new RuntimeException("Ngân ơi, hệ thống không tìm thấy đơn hàng mang mã #" + orderId));
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

}