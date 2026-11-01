package com.shopease.dto;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

/**
 * Response body returned by all Order endpoints.
 */
public class OrderResponse {

    private Long orderId;
    private BigDecimal totalAmount;
    private String shippingAddress;
    private String paymentMode;
    private String status;
    private LocalDateTime orderDate;
    private boolean cancellable;
    private List<OrderItemResponse> items;

    // Default constructor
    public OrderResponse() {
    }

    // Parameterized constructor
    public OrderResponse(
            Long orderId,
            BigDecimal totalAmount,
            String shippingAddress,
            String paymentMode,
            String status,
            LocalDateTime orderDate,
            boolean cancellable,
            List<OrderItemResponse> items) {

        this.orderId = orderId;
        this.totalAmount = totalAmount;
        this.shippingAddress = shippingAddress;
        this.paymentMode = paymentMode;
        this.status = status;
        this.orderDate = orderDate;
        this.cancellable = cancellable;
        this.items = items;
    }

    // Getters

    public Long getOrderId() {
        return orderId;
    }

    public BigDecimal getTotalAmount() {
        return totalAmount;
    }

    public String getShippingAddress() {
        return shippingAddress;
    }

    public String getPaymentMode() {
        return paymentMode;
    }

    public String getStatus() {
        return status;
    }

    public LocalDateTime getOrderDate() {
        return orderDate;
    }

    public boolean isCancellable() {
        return cancellable;
    }

    public List<OrderItemResponse> getItems() {
        return items;
    }

    // Setters

    public void setOrderId(Long orderId) {
        this.orderId = orderId;
    }

    public void setTotalAmount(BigDecimal totalAmount) {
        this.totalAmount = totalAmount;
    }

    public void setShippingAddress(String shippingAddress) {
        this.shippingAddress = shippingAddress;
    }

    public void setPaymentMode(String paymentMode) {
        this.paymentMode = paymentMode;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public void setOrderDate(LocalDateTime orderDate) {
        this.orderDate = orderDate;
    }

    public void setCancellable(boolean cancellable) {
        this.cancellable = cancellable;
    }

    public void setItems(List<OrderItemResponse> items) {
        this.items = items;
    }
}