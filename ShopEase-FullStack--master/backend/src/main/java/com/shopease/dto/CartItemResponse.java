package com.shopease.dto;

import java.math.BigDecimal;

/**
 * One line item in the cart response.
 */
public class CartItemResponse {

    private Long cartId;
    private Long productId;
    private String productName;
    private String imageUrl;
    private BigDecimal price;
    private BigDecimal discountPrice;
    private Integer stockQty;
    private Integer quantity;
    private BigDecimal itemTotal;

    // Default constructor
    public CartItemResponse() {
    }

    // All arguments constructor
    public CartItemResponse(
            Long cartId,
            Long productId,
            String productName,
            String imageUrl,
            BigDecimal price,
            BigDecimal discountPrice,
            Integer stockQty,
            Integer quantity,
            BigDecimal itemTotal) {

        this.cartId = cartId;
        this.productId = productId;
        this.productName = productName;
        this.imageUrl = imageUrl;
        this.price = price;
        this.discountPrice = discountPrice;
        this.stockQty = stockQty;
        this.quantity = quantity;
        this.itemTotal = itemTotal;
    }

    // Getters

    public Long getCartId() {
        return cartId;
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

    public BigDecimal getPrice() {
        return price;
    }

    public BigDecimal getDiscountPrice() {
        return discountPrice;
    }

    public Integer getStockQty() {
        return stockQty;
    }

    public Integer getQuantity() {
        return quantity;
    }

    public BigDecimal getItemTotal() {
        return itemTotal;
    }

    // Setters

    public void setCartId(Long cartId) {
        this.cartId = cartId;
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

    public void setPrice(BigDecimal price) {
        this.price = price;
    }

    public void setDiscountPrice(BigDecimal discountPrice) {
        this.discountPrice = discountPrice;
    }

    public void setStockQty(Integer stockQty) {
        this.stockQty = stockQty;
    }

    public void setQuantity(Integer quantity) {
        this.quantity = quantity;
    }

    public void setItemTotal(BigDecimal itemTotal) {
        this.itemTotal = itemTotal;
    }
}