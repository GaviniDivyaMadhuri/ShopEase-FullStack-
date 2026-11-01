package com.shopease.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

/**
 * Request body for POST /api/payments
 *
 * The amount is taken from the order on the server.
 * This request does not accept card number, CVV, or OTP.
 */
public class PaymentRequest {

    @NotNull(message = "Order id is required")
    private Long orderId;

    @NotBlank(message = "Payment method is required")
    private String paymentMethod;

    // Default constructor
    public PaymentRequest() {
    }

    // Getters

    public Long getOrderId() {
        return orderId;
    }

    public String getPaymentMethod() {
        return paymentMethod;
    }

    // Setters

    public void setOrderId(Long orderId) {
        this.orderId = orderId;
    }

    public void setPaymentMethod(String paymentMethod) {
        this.paymentMethod = paymentMethod;
    }
}