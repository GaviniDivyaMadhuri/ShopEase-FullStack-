
package com.shopease.service;

import com.shopease.dto.CartItemRequest;
import com.shopease.dto.WishlistItemRequest;
import com.shopease.dto.WishlistItemResponse;
import com.shopease.exception.ResourceNotFoundException;
import com.shopease.model.Product;
import com.shopease.model.User;
import com.shopease.model.Wishlist;
import com.shopease.repository.ProductRepository;
import com.shopease.repository.WishlistRepository;
import com.shopease.security.CurrentUserProvider;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class WishlistService {

    private final WishlistRepository wishlistRepository;
    private final ProductRepository productRepository;
    private final CurrentUserProvider currentUserProvider;
    private final CartService cartService;

    public WishlistService(
            WishlistRepository wishlistRepository,
            ProductRepository productRepository,
            CurrentUserProvider currentUserProvider,
            CartService cartService) {

        this.wishlistRepository = wishlistRepository;
        this.productRepository = productRepository;
        this.currentUserProvider = currentUserProvider;
        this.cartService = cartService;
    }

    // Add product to wishlist
    @Transactional
    public List<WishlistItemResponse> addToWishlist(
            WishlistItemRequest request) {

        User user = currentUserProvider.getCurrentUser();

        Product product = productRepository
                .findById(request.getProductId())
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Product not found with id: "
                                        + request.getProductId()
                        ));

        if (wishlistRepository
                .existsByUser_UserIdAndProduct_ProductId(
                        user.getUserId(),
                        product.getProductId())) {

            throw new IllegalArgumentException(
                    "This product is already in your wishlist."
            );
        }

        Wishlist wishlist = new Wishlist();

        wishlist.setUser(user);
        wishlist.setProduct(product);

        wishlistRepository.save(wishlist);

        return getWishlist();
    }

    // Get wishlist
    @Transactional(readOnly = true)
    public List<WishlistItemResponse> getWishlist() {

        User user = currentUserProvider.getCurrentUser();

        return wishlistRepository
                .findByUser_UserId(user.getUserId())
                .stream()
                .map(this::toResponse)
                .toList();
    }

    // Remove product from wishlist
    @Transactional
    public List<WishlistItemResponse> removeFromWishlist(
            Long wishlistId) {

        User user = currentUserProvider.getCurrentUser();

        Wishlist wishlist = wishlistRepository
                .findByWishlistIdAndUser_UserId(
                        wishlistId,
                        user.getUserId()
                )
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Wishlist item not found."
                        )
                );

        wishlistRepository.delete(wishlist);

        return getWishlist();
    }

    // Move wishlist item to cart
    @Transactional
    public List<WishlistItemResponse> moveToCart(
            Long wishlistId) {

        User user = currentUserProvider.getCurrentUser();

        Wishlist wishlist = wishlistRepository
                .findByWishlistIdAndUser_UserId(
                        wishlistId,
                        user.getUserId()
                )
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Wishlist item not found."
                        )
                );

        CartItemRequest cartRequest =
                new CartItemRequest();

        cartRequest.setProductId(
                wishlist.getProduct().getProductId()
        );

        cartRequest.setQuantity(1);

        // Add product to cart
        cartService.addToCart(cartRequest);

        // Remove from wishlist
        wishlistRepository.delete(wishlist);

        return getWishlist();
    }

    // Convert Wishlist entity to response
    private WishlistItemResponse toResponse(
            Wishlist wishlist) {

        Product product = wishlist.getProduct();

        return new WishlistItemResponse(
                wishlist.getWishlistId(),
                product.getProductId(),
                product.getProductName(),
                product.getImageUrl(),
                product.getPrice(),
                product.getDiscountPrice(),
                product.getStockQty(),
                product.getRating(),
                wishlist.getAddedAt()
        );
    }
}

