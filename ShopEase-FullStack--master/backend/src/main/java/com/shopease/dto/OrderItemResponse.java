package com.shopease.dto;

import java.math.BigDecimal;

/**
 * One line item within an order response.
 */
public class OrderItemResponse {

    private Long orderItemId;
    private Long productId;
    private String productName;
    private String imageUrl;
    private Integer quantity;
    private BigDecimal priceAtPurchase;
    private BigDecimal itemTotal;

    // Default constructor
    public OrderItemResponse() {
    }

    // Parameterized constructor
    public OrderItemResponse(
            Long orderItemId,
            Long productId,
            String productName,
            String imageUrl,
            Integer quantity,
            BigDecimal priceAtPurchase,
            BigDecimal itemTotal) {

        this.orderItemId = orderItemId;
        this.productId = productId;
        this.productName = productName;
        this.imageUrl = imageUrl;
        this.quantity = quantity;
        this.priceAtPurchase = priceAtPurchase;
        this.itemTotal = itemTotal;
    }

    // Getters

    public Long getOrderItemId() {
        return orderItemId;
    }

    public Long getProductId() {
        return productId;
    }

    public String getProductName() {
        return productName;
    }

    public String getImageUrl() {
        return imageUrl;
    }

    public Integer getQuantity() {
        return quantity;
    }

    public BigDecimal getPriceAtPurchase() {
        return priceAtPurchase;
    }

    public BigDecimal getItemTotal() {
        return itemTotal;
    }

    // Setters

    public void setOrderItemId(Long orderItemId) {
        this.orderItemId = orderItemId;
    }

    public void setProductId(Long productId) {
        this.productId = productId;
    }

    public void setProductName(String productName) {
        this.productName = productName;
    }

    public void setImageUrl(String imageUrl) {
        this.imageUrl = imageUrl;
    }

    public void setQuantity(Integer quantity) {
        this.quantity = quantity;
    }

    public void setPriceAtPurchase(BigDecimal priceAtPurchase) {
        this.priceAtPurchase = priceAtPurchase;
    }

    public void setItemTotal(BigDecimal itemTotal) {
        this.itemTotal = itemTotal;
    }
}