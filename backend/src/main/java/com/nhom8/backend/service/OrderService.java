package com.nhom8.backend.service;

import com.nhom8.backend.dto.OrderRequest;
import com.nhom8.backend.model.MenuItem;
import com.nhom8.backend.model.Order;
import com.nhom8.backend.model.OrderItem;
import com.nhom8.backend.repository.MenuItemRepository;
import com.nhom8.backend.repository.OrderItemRepository;
import com.nhom8.backend.repository.OrderRepository;
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
                        MenuItemRepository menuItemRepository) {
        this.orderRepository = orderRepository;
        this.orderItemRepository = orderItemRepository;
        this.menuItemRepository = menuItemRepository;
    }
    @Transactional
    public Order createOrder(OrderRequest request) {
        // 1. Tạo thực thể Order từ DTO gửi lên
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
        
        // Mặc định ban đầu
        order.setOrderStatus("PENDING");
        order.setPaymentStatus("UNPAID");

        // 2. Lưu đơn hàng tổng để lấy được order_id tự sinh
        Order savedOrder = orderRepository.save(order);

        // 3. Lưu chi tiết từng món ăn vào bảng order_item
        List<OrderItem> orderItems = request.getItems().stream().map(itemRequest -> {
            OrderItem orderItem = new OrderItem();
            orderItem.setOrderId(savedOrder.getOrderId()); // Dùng ID vừa sinh ra ở trên
            orderItem.setItemId(itemRequest.getItemId());
            orderItem.setQuantity(itemRequest.getQuantity());
            orderItem.setPriceAtOrder(itemRequest.getPriceAtOrder());
        // ✅ PHẦN QUAN TRỌNG: Lấy tên món từ Database và gán vào OrderItem
            String itemNameFromDB = menuItemRepository.findById(itemRequest.getItemId())
                    .map(MenuItem::getItemName) // Ngân check xem getter là getItemName hay getName nhé
                    .orElse("Món ăn không xác định");
            orderItem.setItemName(itemNameFromDB);


            return orderItem;
        }).collect(Collectors.toList());

        orderItemRepository.saveAll(orderItems);

        return savedOrder;
    }

   
    // Trong OrderService.java
    @Transactional
    public void markAsPaid(Integer orderId) {
        Order order = orderRepository.findById(orderId)
            .orElseThrow(() -> new RuntimeException("Không tìm thấy đơn hàng"));
        
        order.setPaymentStatus("PAID"); // Cập nhật trạng thái thanh toán
        order.setPaidAt(LocalDateTime.now()); // ✅ LƯU GIỜ THANH TOÁN VÀO ĐÂY
        order.setOrderStatus("CONFIRMED"); // Tự động xác nhận đơn luôn cho máu
        orderRepository.save(order);
    }
        @Transactional
        public void markAsCompleted(Integer orderId) {
            Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy đơn hàng"));
            
            order.setOrderStatus("COMPLETED"); // Trạng thái hoàn thành (Mục 10 tài liệu)
            order.setCompletedAt(LocalDateTime.now()); // ✅ LƯU GIỜ HOÀN THÀNH VÀO ĐÂY
            
            orderRepository.save(order);
        }

        // Hàm lấy lịch sử đơn hàng cho Ngân nè
        public List<Order> getOrdersByCustomerId(Integer customerId) {
        if (customerId == null) {
            throw new RuntimeException("Ngân ơi, ID khách hàng không được để trống!");
        }
        return orderRepository.findByCustomerIdOrderByCreatedAtDesc(customerId);
    }
}