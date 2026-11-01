package com.shopease.controller;

import com.shopease.dto.ReviewCreateRequest;
import com.shopease.dto.ReviewResponse;
import com.shopease.dto.ReviewUpdateRequest;
import com.shopease.service.ReviewService;

import jakarta.validation.Valid;

import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/reviews")
public class ReviewController {

    private final ReviewService reviewService;

    public ReviewController(ReviewService reviewService) {
        this.reviewService = reviewService;
    }

    @GetMapping("/product/{productId}")
    public List<ReviewResponse> getReviewsForProduct(
            @PathVariable Long productId) {

        return reviewService.getReviewsForProduct(productId);
    }

    @PostMapping
    public ReviewResponse submitReview(
            @Valid @RequestBody ReviewCreateRequest request) {

        return reviewService.submitReview(request);
    }

    @PutMapping("/{id}")
    public ReviewResponse updateReview(
            @PathVariable Long id,
            @Valid @RequestBody ReviewUpdateRequest request) {

        return reviewService.updateReview(id, request);
    }

    @DeleteMapping("/{id}")
    public Map<String, String> deleteReview(
            @PathVariable Long id) {

        reviewService.deleteReview(id);

        return Map.of(
                "message",
                "Review deleted successfully."
        );
    }
}