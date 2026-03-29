package com.nhom8.backend.service;

import com.nhom8.backend.dto.OrderRequest;
import com.nhom8.backend.model.MenuItem;
import com.nhom8.backend.model.Order;
import com.nhom8.backend.model.OrderItem;
import com.nhom8.backend.repository.MenuItemRepository;
import com.nhom8.backend.repository.OrderItemRepository;
import com.nhom8.backend.repository.OrderRepository;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class OrderService {

    private final OrderRepository orderRepository;
    private final OrderItemRepository orderItemRepository;
    private final MenuItemRepository menuItemRepository; //Thêm Repository này để lấy tên món

   // Cập nhật Constructor để Inject thêm MenuItemRepository
    public OrderService(OrderRepository orderRepository, 
                        OrderItemRepository orderItemRepository,
                        MenuItemRepository menuItemRepository,
                        SimpMessagingTemplate messagingTemplate) {
        this.orderRepository = orderRepository;
        this.orderItemRepository = orderItemRepository;
        this.menuItemRepository = menuItemRepository;
        this.messagingTemplate = messagingTemplate;
    }
    @Transactional
    public Order createOrder(OrderRequest request) {
        // 1. Tạo thực thể Order từ DTO gửi lên
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
        
        // 2. LOGIC TRẠNG THÁI (Dành cho Tester GPA 9.3)
    if ("CASH".equalsIgnoreCase(request.getPaymentMethod())) {
        order.setOrderStatus("PENDING");   // Chờ nhà hàng xác nhận
        order.setPaymentStatus("UNPAID");  // Chưa trả tiền (trả sau)
    } else {
        order.setOrderStatus("AWAITING_PAYMENT"); // Trạng thái chờ thanh toán Online
        order.setPaymentStatus("UNPAID");         // Chưa trả tiền
    }

    // 3. Lưu đơn hàng tổng
    Order savedOrder = orderRepository.save(order);

    // 4. Lưu chi tiết món ăn
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

    // 5.WEBSOCKET CHO NHÀ HÀNG (Nếu là Tiền mặt)
    if ("CASH".equalsIgnoreCase(savedOrder.getPaymentMethod())) {
        String restaurantTopic = "/topic/restaurant/" + savedOrder.getResId();
        // Gửi thông báo "Có đơn hàng mới (Tiền mặt)" cho nhà hàng
        messagingTemplate.convertAndSend(restaurantTopic, "NEW_ORDER:" + savedOrder.getOrderId());
        
        System.out.println(">>> Đơn tiền mặt: Đã báo tin cho nhà hàng " + savedOrder.getResId());
    } else {
        System.out.println(">>> Đơn Online: Đang chờ khách thanh toán, chưa báo nhà hàng.");
    }

    return savedOrder;
}

   
    // Trong OrderService.java
    @Transactional
    public void markAsPaid(Integer orderId) {
        Order order = orderRepository.findById(orderId)
            .orElseThrow(() -> new RuntimeException("Không tìm thấy đơn hàng"));
        
        order.setPaymentStatus("PAID"); // Cập nhật trạng thái thanh toán
        order.setPaidAt(LocalDateTime.now()); // LƯU GIỜ THANH TOÁN VÀO ĐÂY
        order.setOrderStatus("CONFIRMED"); // Tự động xác nhận đơn luôn cho máu
        orderRepository.save(order);

        messagingTemplate.convertAndSend("/topic/order/" + orderId, "CONFIRMED");//báo cho khách
        messagingTemplate.convertAndSend("/topic/restaurant/" + order.getResId(), "NEW_ORDER:" + orderId);//báo cho nhà hàng
    }
        @Transactional
        public void markAsCompleted(Integer orderId) {
            Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy đơn hàng"));
            
            order.setOrderStatus("COMPLETED"); // Trạng thái hoàn thành (Mục 10 tài liệu)
            order.setCompletedAt(LocalDateTime.now()); // LƯU GIỜ HOÀN THÀNH VÀO ĐÂY
            
            orderRepository.save(order);
        }

        // Hàm lấy lịch sử đơn hàng cho Ngân nè
        public List<Order> getOrdersByCustomerId(Integer customerId) {
        if (customerId == null) {
            throw new RuntimeException("Ngân ơi, ID khách hàng không được để trống!");
        }
        return orderRepository.findByCustomerIdOrderByCreatedAtDesc(customerId);
    }

    // Hàm lấy lịch sử đơn hàng cho Ngân nè
        public List<Order> getOrdersByResId(Integer resId) {
        // Gọi repo để lấy danh sách đơn hàng của quán
        return orderRepository.findByResIdOrderByCreatedAtDesc(resId);
    }
    // Hàm lấy chi tiết một đơn hàng theo ID (Dùng cho trang Order Tracking)
    public Order getOrderById(Integer orderId) {
        return orderRepository.findById(orderId)
                .orElseThrow(() -> new RuntimeException("Ngân ơi, hệ thống không tìm thấy đơn hàng mang mã #" + orderId));
    }

    @Autowired
    private SimpMessagingTemplate messagingTemplate; // Công cụ đẩy tin nhắn của Spring

    @Transactional
    public void updateOrderStatus(Integer orderId, String status, String reason) {
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy đơn hàng"));
        
        order.setOrderStatus(status);

        if ("CANCELLED".equals(status) && reason != null) {
        order.setCancellationReason(reason); // Hoặc lưu vào cột cancellationReason riêng nếu có
        }
        orderRepository.save(order);

        // 1. ĐẨY THÔNG BÁO cho khách hàng (Gửi kèm lý do nếu có)
        messagingTemplate.convertAndSend("/topic/order/" + orderId, status + (reason != null ? ":" + reason : ""));
    
         // 2. Đẩy thông báo cho nhà hàng để cập nhật danh sách
         messagingTemplate.convertAndSend("/topic/restaurant/" + order.getResId(), "UPDATE_LIST");
         }
}