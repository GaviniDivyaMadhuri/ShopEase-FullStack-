package com.shopease.service;

import com.shopease.dto.ReviewCreateRequest;
import com.shopease.dto.ReviewResponse;
import com.shopease.dto.ReviewUpdateRequest;
import com.shopease.exception.ResourceNotFoundException;
import com.shopease.model.Product;
import com.shopease.model.Review;
import com.shopease.model.User;
import com.shopease.repository.ProductRepository;
import com.shopease.repository.ReviewRepository;
import com.shopease.security.CurrentUserProvider;

import org.springframework.security.access.AccessDeniedException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class ReviewService {

    private final ReviewRepository reviewRepository;
    private final ProductRepository productRepository;
    private final CurrentUserProvider currentUserProvider;

    // Manual constructor
    public ReviewService(ReviewRepository reviewRepository,
                         ProductRepository productRepository,
                         CurrentUserProvider currentUserProvider) {
        this.reviewRepository = reviewRepository;
        this.productRepository = productRepository;
        this.currentUserProvider = currentUserProvider;
    }

    @Transactional
    public ReviewResponse submitReview(ReviewCreateRequest request) {

        User user = currentUserProvider.getCurrentUser();

        Product product = productRepository.findById(request.getProductId())
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Product not found with id: "
                                        + request.getProductId()));

        if (reviewRepository.existsByProduct_ProductIdAndUser_UserId(
                product.getProductId(),
                user.getUserId())) {

            throw new IllegalArgumentException(
                    "You have already reviewed this product. "
                            + "Please edit your existing review instead.");
        }

        Review review = new Review();

        review.setProduct(product);
        review.setUser(user);
        review.setRating(request.getRating());
        review.setComment(request.getComment());

        Review saved = reviewRepository.save(review);

        recalculateProductRating(product.getProductId());

        return toResponse(saved);
    }

    public List<ReviewResponse> getReviewsForProduct(Long productId) {

        if (!productRepository.existsById(productId)) {
            throw new ResourceNotFoundException(
                    "Product not found with id: " + productId);
        }

        return reviewRepository
                .findByProduct_ProductIdOrderByCreatedAtDesc(productId)
                .stream()
                .map(this::toResponse)
                .toList();
    }

    @Transactional
    public ReviewResponse updateReview(
            Long reviewId,
            ReviewUpdateRequest request) {

        User user = currentUserProvider.getCurrentUser();

        Review review = reviewRepository.findById(reviewId)
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Review not found."));

        if (!review.getUser().getUserId().equals(user.getUserId())
                && !currentUserProvider.isAdmin(user)) {

            throw new AccessDeniedException(
                    "You can only edit your own review.");
        }

        review.setRating(request.getRating());
        review.setComment(request.getComment());

        Review updated = reviewRepository.save(review);

        recalculateProductRating(
                review.getProduct().getProductId());

        return toResponse(updated);
    }

    @Transactional
    public void deleteReview(Long reviewId) {

        User user = currentUserProvider.getCurrentUser();

        Review review = reviewRepository.findById(reviewId)
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Review not found."));

        if (!review.getUser().getUserId().equals(user.getUserId())
                && !currentUserProvider.isAdmin(user)) {

            throw new AccessDeniedException(
                    "You can only delete your own review.");
        }

        Long productId = review.getProduct().getProductId();

        reviewRepository.delete(review);

        recalculateProductRating(productId);
    }

    // ---------- Helpers ----------

    private void recalculateProductRating(Long productId) {

        Product product = productRepository.findById(productId)
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Product not found."));

        List<Review> reviews = reviewRepository
                .findByProduct_ProductIdOrderByCreatedAtDesc(productId);

        double average = reviews.stream()
                .mapToInt(Review::getRating)
                .average()
                .orElse(0.0);

        // Round to one decimal place
        double rounded = Math.round(average * 10.0) / 10.0;

        product.setRating(rounded);

        productRepository.save(product);
    }

    private ReviewResponse toResponse(Review review) {

        return new ReviewResponse(
                review.getReviewId(),
                review.getProduct().getProductId(),
                review.getUser().getUserId(),
                review.getUser().getFullName(),
                review.getRating(),
                review.getComment(),
                review.getCreatedAt()
        );
    }
}