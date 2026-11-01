package com.shopease.dto;

import jakarta.validation.constraints.NotNull;

public class WishlistItemRequest {

    @NotNull(message = "Product id is required")
    private Long productId;

    public WishlistItemRequest() {
    }

    public Long getProductId() {
        return productId;
    }

    public void setProductId(Long productId) {
        this.productId = productId;
    }
}