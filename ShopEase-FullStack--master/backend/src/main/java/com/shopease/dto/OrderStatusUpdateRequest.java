package com.shopease.dto;

import jakarta.validation.constraints.NotBlank;

/**
 * Request body for PUT /api/orders/{id}/status (ADMIN only)
 */
public class OrderStatusUpdateRequest {

    @NotBlank(message = "Status is required")
    private String status;

    // Default constructor
    public OrderStatusUpdateRequest() {
    }

    // Getter
    public String getStatus() {
        return status;
    }

    // Setter
    public void setStatus(String status) {
        this.status = status;
    }
}