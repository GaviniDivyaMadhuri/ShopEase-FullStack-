
package com.shopease.service;

import com.shopease.dto.CartItemRequest;
import com.shopease.dto.CartItemResponse;
import com.shopease.dto.CartSummaryResponse;
import com.shopease.dto.CartUpdateRequest;
import com.shopease.exception.OutOfStockException;
import com.shopease.exception.ResourceNotFoundException;
import com.shopease.model.Cart;
import com.shopease.model.Product;
import com.shopease.model.User;
import com.shopease.repository.CartRepository;
import com.shopease.repository.ProductRepository;
import com.shopease.security.CurrentUserProvider;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;

@Service
public class CartService
{
	

    private static final BigDecimal FREE_DELIVERY_THRESHOLD =
            new BigDecimal("500.00");

    private static final BigDecimal DELIVERY_CHARGE =
            new BigDecimal("50.00");

    private final CartRepository cartRepository;
    private final ProductRepository productRepository;
    private final CurrentUserProvider currentUserProvider;

    public CartService(
            CartRepository cartRepository,
            ProductRepository productRepository,
            CurrentUserProvider currentUserProvider) {

        this.cartRepository = cartRepository;
        this.productRepository = productRepository;
        this.currentUserProvider = currentUserProvider;
    }

    // Add product to cart
    @Transactional
    public CartSummaryResponse addToCart(CartItemRequest request) {

        User user = currentUserProvider.getCurrentUser();

        Product product = productRepository
                .findById(request.getProductId())
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Product not found with id: "
                                        + request.getProductId()
                        ));

        Cart cart = cartRepository
                .findByUser_UserIdAndProduct_ProductId(
                        user.getUserId(),
                        product.getProductId()
                )
                .orElse(null);

        int newQuantity =
                (cart != null ? cart.getQuantity() : 0)
                        + request.getQuantity();

        if (product.getStockQty() < newQuantity) {

            throw new OutOfStockException(
                    "Only "
                            + product.getStockQty()
                            + " unit(s) of \""
                            + product.getProductName()
                            + "\" available in stock."
            );
        }

        if (cart == null) {

            cart = new Cart();

            cart.setUser(user);
            cart.setProduct(product);
            cart.setQuantity(request.getQuantity());

        } else {

            cart.setQuantity(newQuantity);
        }

        cartRepository.save(cart);

        return getCart();
    }

    // Get current user's cart
    @Transactional(readOnly = true)
    public CartSummaryResponse getCart() {

        User user = currentUserProvider.getCurrentUser();

        List<Cart> cartItems =
                cartRepository.findByUser_UserId(
                        user.getUserId()
                );

        return buildSummary(cartItems);
    }

    // Update cart quantity
    @Transactional
    public CartSummaryResponse updateQuantity(
            CartUpdateRequest request) {

        User user = currentUserProvider.getCurrentUser();

        Cart cart = cartRepository
                .findByCartIdAndUser_UserId(
                        request.getCartId(),
                        user.getUserId()
                )
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Cart item not found."
                        ));

        if (request.getQuantity() < 1) {

            throw new IllegalArgumentException(
                    "Quantity must be at least 1."
            );
        }

        if (cart.getProduct().getStockQty()
                < request.getQuantity()) {

            throw new OutOfStockException(
                    "Only "
                            + cart.getProduct().getStockQty()
                            + " unit(s) of \""
                            + cart.getProduct().getProductName()
                            + "\" available in stock."
            );
        }

        cart.setQuantity(request.getQuantity());

        cartRepository.save(cart);

        return getCart();
    }

    // Remove one item from cart
    @Transactional
    public CartSummaryResponse removeItem(Long cartId) {

        User user = currentUserProvider.getCurrentUser();

        Cart cart = cartRepository
                .findByCartIdAndUser_UserId(
                        cartId,
                        user.getUserId()
                )
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Cart item not found."
                        ));

        cartRepository.delete(cart);

        return getCart();
    }

    // Clear entire cart
    @Transactional
    public void clearCart() {

        User user = currentUserProvider.getCurrentUser();

        cartRepository.deleteByUser_UserId(
                user.getUserId()
        );
    }

    // Build cart summary
    private CartSummaryResponse buildSummary(List<Cart> cartItems) {

        List<CartItemResponse> itemResponses = new ArrayList<>();

        for (Cart cart : cartItems) {
            itemResponses.add(toItemResponse(cart));
        }

        BigDecimal subtotal = BigDecimal.ZERO;

        for (CartItemResponse item : itemResponses) {
            if (item.getItemTotal() != null) {
                subtotal = subtotal.add(item.getItemTotal());
            }
        }

        BigDecimal deliveryCharge;

        if (subtotal.compareTo(BigDecimal.ZERO) == 0) {
            deliveryCharge = BigDecimal.ZERO;

        } else if (subtotal.compareTo(FREE_DELIVERY_THRESHOLD) >= 0) {
            deliveryCharge = BigDecimal.ZERO;

        } else {
            deliveryCharge = DELIVERY_CHARGE;
        }

        BigDecimal total = subtotal.add(deliveryCharge);

        int totalItems = 0;

        for (CartItemResponse item : itemResponses) {
            totalItems += item.getQuantity();
        }

        return new CartSummaryResponse(
                itemResponses,
                totalItems,
                subtotal,
                deliveryCharge,
                total
        );
    }

    private CartItemResponse toItemResponse(Cart cart) {

        Product product = cart.getProduct();

        BigDecimal effectivePrice;

        if (product.getDiscountPrice() != null) {
            effectivePrice = product.getDiscountPrice();
        } else {
            effectivePrice = product.getPrice();
        }

        BigDecimal itemTotal = effectivePrice.multiply(
                BigDecimal.valueOf(cart.getQuantity())
        );

        return new CartItemResponse(
                cart.getCartId(),
                product.getProductId(),
                product.getProductName(),
                product.getImageUrl(),
                product.getPrice(),
                product.getDiscountPrice(),
                product.getStockQty(),
                cart.getQuantity(),
                itemTotal
        );
    }
}