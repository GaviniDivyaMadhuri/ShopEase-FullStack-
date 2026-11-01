package com.shopease.repository;

import com.shopease.model.Wishlist;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface WishlistRepository extends JpaRepository<Wishlist, Long> {

    List<Wishlist> findByUser_UserId(Long userId);

    boolean existsByUser_UserIdAndProduct_ProductId(Long userId, Long productId);

    Optional<Wishlist> findByWishlistIdAndUser_UserId(Long wishlistId, Long userId);
}
