package com.shopease.dto;

import java.math.BigDecimal;
import java.util.List;

/**
 * Response body for GET /api/cart
 */
public class CartSummaryResponse {

    private List<CartItemResponse> items;
    private int totalItems;
    private BigDecimal subtotal;
    private BigDecimal deliveryCharge;
    private BigDecimal total;

    // Default constructor
    public CartSummaryResponse() {
    }

    // All arguments constructor
    public CartSummaryResponse(
            List<CartItemResponse> items,
            int totalItems,
            BigDecimal subtotal,
            BigDecimal deliveryCharge,
            BigDecimal total) {

        this.items = items;
        this.totalItems = totalItems;
        this.subtotal = subtotal;
        this.deliveryCharge = deliveryCharge;
        this.total = total;
    }

    // Getters

    public List<CartItemResponse> getItems() {
        return items;
    }

    public int getTotalItems() {
        return totalItems;
    }

    public BigDecimal getSubtotal() {
        return subtotal;
    }

    public BigDecimal getDeliveryCharge() {
        return deliveryCharge;
    }

    public BigDecimal getTotal() {
        return total;
    }

    // Setters

    public void setItems(List<CartItemResponse> items) {
        this.items = items;
    }

    public void setTotalItems(int totalItems) {
        this.totalItems = totalItems;
    }

    public void setSubtotal(BigDecimal subtotal) {
        this.subtotal = subtotal;
    }

    public void setDeliveryCharge(BigDecimal deliveryCharge) {
        this.deliveryCharge = deliveryCharge;
    }

    public void setTotal(BigDecimal total) {
        this.total = total;
    }
}