package com.shopease.controller;

import com.shopease.dto.WishlistItemRequest;
import com.shopease.dto.WishlistItemResponse;
import com.shopease.service.WishlistService;

import jakarta.validation.Valid;

import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/wishlist")
public class WishlistController {

    private final WishlistService wishlistService;

    public WishlistController(WishlistService wishlistService) {
        this.wishlistService = wishlistService;
    }

    @GetMapping
    public List<WishlistItemResponse> getWishlist() {
        return wishlistService.getWishlist();
    }

    @PostMapping("/add")
    public List<WishlistItemResponse> addToWishlist(
            @Valid @RequestBody WishlistItemRequest request) {

        return wishlistService.addToWishlist(request);
    }

    @DeleteMapping("/remove/{id}")
    public List<WishlistItemResponse> removeFromWishlist(
            @PathVariable Long id) {

        return wishlistService.removeFromWishlist(id);
    }

    @PostMapping("/move-to-cart/{id}")
    public List<WishlistItemResponse> moveToCart(
            @PathVariable Long id) {

        return wishlistService.moveToCart(id);
    }
}