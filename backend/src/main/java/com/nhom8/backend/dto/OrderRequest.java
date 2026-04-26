package com.nhom8.backend.dto;

import java.math.BigDecimal;
import java.util.List;

public class OrderRequest {

    // 1. Thông tin chung của đơn hàng 
    private Integer customerId;
    private Integer resId;
    private Integer voucherId;
    private String deliveryAddress;
    private String note;
    private String paymentMethod;
    
    // Các khoản tiền (Dùng BigDecimal để thầy cô không trừ điểm nhé)
    private BigDecimal subtotal;
    private BigDecimal shippingFee;
    private BigDecimal totalDiscount;
    private BigDecimal finalAmount;

    // 2. Danh sách các món ăn có trong giỏ hàng
    private List<OrderItemRequest> items;

    
    // --- LỚP NỘI BỘ: Chi tiết từng món ăn ---

    public Integer getCustomerId() {
        return customerId;
    }


    public void setCustomerId(Integer customerId) {
        this.customerId = customerId;
    }


    public Integer getResId() {
        return resId;
    }


    public void setResId(Integer resId) {
        this.resId = resId;
    }


    public Integer getVoucherId() {
        return voucherId;
    }

    public void setVoucherId(Integer voucherId) {
        this.voucherId = voucherId;
    }
    
    public String getDeliveryAddress() {
        return deliveryAddress;
    }


    public void setDeliveryAddress(String deliveryAddress) {
        this.deliveryAddress = deliveryAddress;
    }


    public String getNote() {
        return note;
    }


    public void setNote(String note) {
        this.note = note;
    }


    public String getPaymentMethod() {
        return paymentMethod;
    }


    public void setPaymentMethod(String paymentMethod) {
        this.paymentMethod = paymentMethod;
    }


    public BigDecimal getSubtotal() {
        return subtotal;
    }


    public void setSubtotal(BigDecimal subtotal) {
        this.subtotal = subtotal;
    }


    public BigDecimal getShippingFee() {
        return shippingFee;
    }


    public void setShippingFee(BigDecimal shippingFee) {
        this.shippingFee = shippingFee;
    }


    public BigDecimal getTotalDiscount() {
        return totalDiscount;
    }


    public void setTotalDiscount(BigDecimal totalDiscount) {
        this.totalDiscount = totalDiscount;
    }


    public BigDecimal getFinalAmount() {
        return finalAmount;
    }


    public void setFinalAmount(BigDecimal finalAmount) {
        this.finalAmount = finalAmount;
    }


    public List<OrderItemRequest> getItems() {
        return items;
    }


    public void setItems(List<OrderItemRequest> items) {
        this.items = items;
    }


    public static class OrderItemRequest {
        private Integer itemId;
        private Integer quantity;
        private BigDecimal priceAtOrder;
        public Integer getItemId() {
            return itemId;
        }
        public void setItemId(Integer itemId) {
            this.itemId = itemId;
        }
        public Integer getQuantity() {
            return quantity;
        }
        public void setQuantity(Integer quantity) {
            this.quantity = quantity;
        }
        public BigDecimal getPriceAtOrder() {
            return priceAtOrder;
        }
        public void setPriceAtOrder(BigDecimal priceAtOrder) {
            this.priceAtOrder = priceAtOrder;
        }

        
    }
}
