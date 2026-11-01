package com.shopease.repository;

import com.shopease.model.Review;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface ReviewRepository extends JpaRepository<Review, Long> {

    List<Review> findByProduct_ProductIdOrderByCreatedAtDesc(Long productId);

    boolean existsByProduct_ProductIdAndUser_UserId(Long productId, Long userId);

    Optional<Review> findByReviewIdAndUser_UserId(Long reviewId, Long userId);
}
