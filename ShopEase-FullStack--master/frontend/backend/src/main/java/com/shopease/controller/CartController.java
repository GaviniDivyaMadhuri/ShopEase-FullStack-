package com.shopease.controller;

import com.shopease.dto.CartItemRequest;
import com.shopease.dto.CartSummaryResponse;
import com.shopease.dto.CartUpdateRequest;
import com.shopease.service.CartService;

import jakarta.validation.Valid;

import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/cart")
public class CartController {

    private final CartService cartService;

    public CartController(CartService cartService) {
        this.cartService = cartService;
    }

    @GetMapping
    public CartSummaryResponse getCart() {
        return cartService.getCart();
    }

    @PostMapping("/add")
    public CartSummaryResponse addToCart(
            @Valid @RequestBody CartItemRequest request) {

        return cartService.addToCart(request);
    }

    @PutMapping("/update")
    public CartSummaryResponse updateCart(
            @Valid @RequestBody CartUpdateRequest request) {

        return cartService.updateQuantity(request);
    }

    @DeleteMapping("/remove/{id}")
    public CartSummaryResponse removeItem(
            @PathVariable Long id) {

        return cartService.removeItem(id);
    }

    @DeleteMapping("/clear")
    public Map<String, String> clearCart() {

        cartService.clearCart();

        return Map.of(
                "message",
                "Cart cleared successfully."
        );
    }
}