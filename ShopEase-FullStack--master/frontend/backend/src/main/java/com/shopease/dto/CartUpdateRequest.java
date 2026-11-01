package com.shopease.dto;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;

/**
 * Request body for PUT /api/cart/update
 * Used for setting an exact quantity.
 */
public class CartUpdateRequest {

    @NotNull(message = "Cart item id is required")
    private Long cartId;

    @NotNull(message = "Quantity is required")
    @Min(value = 1, message = "Quantity must be greater than zero")
    private Integer quantity;

    // Default constructor
    public CartUpdateRequest() {
    }

    // Getters
    public Long getCartId() {
        return cartId;
    }

    public Integer getQuantity() {
        return quantity;
    }

    // Setters
    public void setCartId(Long cartId) {
        this.cartId = cartId;
    }

    public void setQuantity(Integer quantity) {
        this.quantity = quantity;
    }
}