package com.shopease.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

/**
 * Request body for POST /api/orders
 * Converts the logged-in user's current cart into an Order.
 */
public class PlaceOrderRequest {

    @NotNull(message = "Shipping address is required")
    private Long addressId;

    @NotBlank(message = "Payment mode is required")
    private String paymentMode;

    // Default constructor
    public PlaceOrderRequest() {
    }

    // Getters

    public Long getAddressId() {
        return addressId;
    }

    public String getPaymentMode() {
        return paymentMode;
    }

    // Setters

    public void setAddressId(Long addressId) {
        this.addressId = addressId;
    }

    public void setPaymentMode(String paymentMode) {
        this.paymentMode = paymentMode;
    }
}