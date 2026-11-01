
package com.shopease.service;

import com.shopease.dto.OrderItemResponse;
import com.shopease.dto.OrderResponse;
import com.shopease.dto.OrderStatusUpdateRequest;
import com.shopease.dto.PlaceOrderRequest;
import com.shopease.exception.EmptyCartException;
import com.shopease.exception.OutOfStockException;
import com.shopease.exception.ResourceNotFoundException;
import com.shopease.model.Address;
import com.shopease.model.Cart;
import com.shopease.model.Order;
import com.shopease.model.OrderItem;
import com.shopease.model.Product;
import com.shopease.model.User;
import com.shopease.model.enums.OrderStatus;
import com.shopease.model.enums.PaymentMethod;
import com.shopease.repository.AddressRepository;
import com.shopease.repository.CartRepository;
import com.shopease.repository.OrderRepository;
import com.shopease.repository.ProductRepository;
import com.shopease.security.CurrentUserProvider;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;

@Service
public class OrderService {

    private static final BigDecimal FREE_DELIVERY_THRESHOLD =
            new BigDecimal("500.00");

    private static final BigDecimal DELIVERY_CHARGE =
            new BigDecimal("50.00");

    private final OrderRepository orderRepository;
    private final CartRepository cartRepository;
    private final ProductRepository productRepository;
    private final AddressRepository addressRepository;
    private final CurrentUserProvider currentUserProvider;

    public OrderService(
            OrderRepository orderRepository,
            CartRepository cartRepository,
            ProductRepository productRepository,
            AddressRepository addressRepository,
            CurrentUserProvider currentUserProvider) {

        this.orderRepository = orderRepository;
        this.cartRepository = cartRepository;
        this.productRepository = productRepository;
        this.addressRepository = addressRepository;
        this.currentUserProvider = currentUserProvider;
    }

    @Transactional
    public OrderResponse placeOrder(PlaceOrderRequest request) {

        User user = currentUserProvider.getCurrentUser();

        List<Cart> cartItems =
                cartRepository.findByUser_UserId(user.getUserId());

        if (cartItems.isEmpty()) {
            throw new EmptyCartException(
                    "Your cart is empty. Add products before placing an order."
            );
        }

        Address address =
                addressRepository
                        .findByAddressIdAndUser_UserId(
                                request.getAddressId(),
                                user.getUserId()
                        )
                        .orElseThrow(() ->
                                new ResourceNotFoundException(
                                        "Address not found."
                                )
                        );

        PaymentMethod paymentMethod =
                parsePaymentMethod(request.getPaymentMode());

        // Check stock before placing order
        for (Cart cartItem : cartItems) {

            Product product = cartItem.getProduct();

            if (product.getStockQty() < cartItem.getQuantity()) {

                throw new OutOfStockException(
                        "Only "
                                + product.getStockQty()
                                + " unit(s) of \""
                                + product.getProductName()
                                + "\" available in stock."
                );
            }
        }

        // Create order
        Order order = new Order();

        order.setUser(user);
        order.setPaymentMode(paymentMethod);
        order.setStatus(OrderStatus.PENDING);
        order.setShippingAddress(formatAddress(address));

        BigDecimal subtotal = BigDecimal.ZERO;

        List<OrderItem> orderItems = new ArrayList<>();

        for (Cart cartItem : cartItems) {

            Product product = cartItem.getProduct();

            BigDecimal effectivePrice;

            if (product.getDiscountPrice() != null) {
                effectivePrice = product.getDiscountPrice();
            } else {
                effectivePrice = product.getPrice();
            }

            OrderItem orderItem = new OrderItem();

            orderItem.setOrder(order);
            orderItem.setProduct(product);
            orderItem.setQuantity(cartItem.getQuantity());
            orderItem.setPriceAtPurchase(effectivePrice);

            orderItems.add(orderItem);

            BigDecimal itemTotal =
                    effectivePrice.multiply(
                            BigDecimal.valueOf(
                                    cartItem.getQuantity()
                            )
                    );

            subtotal = subtotal.add(itemTotal);

            // Reduce stock
            product.setStockQty(
                    product.getStockQty()
                            - cartItem.getQuantity()
            );

            productRepository.save(product);
        }

        BigDecimal deliveryCharge;

        if (subtotal.compareTo(FREE_DELIVERY_THRESHOLD) >= 0) {
            deliveryCharge = BigDecimal.ZERO;
        } else {
            deliveryCharge = DELIVERY_CHARGE;
        }

        BigDecimal total = subtotal.add(deliveryCharge);

        order.setTotalAmount(total);
        order.setOrderItems(orderItems);

        Order savedOrder =
                orderRepository.save(order);

        // Clear cart
        cartRepository.deleteByUser_UserId(
                user.getUserId()
        );

        return toResponse(savedOrder);
    }

    // Get order history
    @Transactional(readOnly = true)
    public List<OrderResponse> getOrderHistory() {

        User user = currentUserProvider.getCurrentUser();

        List<Order> orders;

        if (currentUserProvider.isAdmin(user)) {

            orders =
                    orderRepository
                            .findAllByOrderByOrderDateDesc();

        } else {

            orders =
                    orderRepository
                            .findByUser_UserIdOrderByOrderDateDesc(
                                    user.getUserId()
                            );
        }

        List<OrderResponse> responses =
                new ArrayList<>();

        for (Order order : orders) {
            responses.add(toResponse(order));
        }

        return responses;
    }

    // Get single order
    @Transactional(readOnly = true)
    public OrderResponse getOrderById(Long orderId) {

        User user = currentUserProvider.getCurrentUser();

        Order order;

        if (currentUserProvider.isAdmin(user)) {

            order =
                    orderRepository.findById(orderId)
                            .orElseThrow(() ->
                                    new ResourceNotFoundException(
                                            "Order not found."
                                    )
                            );

        } else {

            order =
                    orderRepository
                            .findByOrderIdAndUser_UserId(
                                    orderId,
                                    user.getUserId()
                            )
                            .orElseThrow(() ->
                                    new ResourceNotFoundException(
                                            "Order not found."
                                    )
                            );
        }

        return toResponse(order);
    }

    // Cancel order
    @Transactional
    public OrderResponse cancelOrder(Long orderId) {

        User user = currentUserProvider.getCurrentUser();

        Order order =
                orderRepository
                        .findByOrderIdAndUser_UserId(
                                orderId,
                                user.getUserId()
                        )
                        .orElseThrow(() ->
                                new ResourceNotFoundException(
                                        "Order not found."
                                )
                        );

        if (order.getStatus() != OrderStatus.PENDING
                && order.getStatus() != OrderStatus.CONFIRMED) {

            throw new IllegalArgumentException(
                    "This order can no longer be cancelled (current status: "
                            + order.getStatus()
                            + ")."
            );
        }

        // Restore stock
        for (OrderItem item : order.getOrderItems()) {

            Product product = item.getProduct();

            product.setStockQty(
                    product.getStockQty()
                            + item.getQuantity()
            );

            productRepository.save(product);
        }

        order.setStatus(OrderStatus.CANCELLED);

        Order updated =
                orderRepository.save(order);

        return toResponse(updated);
    }

    // ADMIN only
    @Transactional
    public OrderResponse updateOrderStatus(
            Long orderId,
            OrderStatusUpdateRequest request) {

        Order order =
                orderRepository.findById(orderId)
                        .orElseThrow(() ->
                                new ResourceNotFoundException(
                                        "Order not found."
                                )
                        );

        OrderStatus newStatus;

        try {

            newStatus =
                    OrderStatus.valueOf(
                            request.getStatus().toUpperCase()
                    );

        } catch (IllegalArgumentException ex) {

            throw new IllegalArgumentException(
                    "Invalid order status: "
                            + request.getStatus()
            );
        }

        order.setStatus(newStatus);

        Order updated =
                orderRepository.save(order);

        return toResponse(updated);
    }

    // Parse payment method
    private PaymentMethod parsePaymentMethod(String raw) {

        try {

            return PaymentMethod.valueOf(
                    raw.toUpperCase()
            );

        } catch (IllegalArgumentException ex) {

            throw new IllegalArgumentException(
                    "Invalid payment mode. Use COD, CARD, or UPI."
            );
        }
    }

    // Format shipping address
    private String formatAddress(Address address) {

        return address.getFullName()
                + ", "
                + address.getAddress()
                + ", "
                + address.getCity()
                + ", "
                + address.getState()
                + " - "
                + address.getPincode()
                + ", Phone: "
                + address.getPhoneNumber();
    }

    // Convert Order to OrderResponse
    private OrderResponse toResponse(Order order) {

        List<OrderItemResponse> items =
                new ArrayList<>();

        for (OrderItem item : order.getOrderItems()) {

            BigDecimal itemTotal =
                    item.getPriceAtPurchase()
                            .multiply(
                                    BigDecimal.valueOf(
                                            item.getQuantity()
                                    )
                            );

            OrderItemResponse response =
                    new OrderItemResponse(
                            item.getOrderItemId(),
                            item.getProduct().getProductId(),
                            item.getProduct().getProductName(),
                            item.getProduct().getImageUrl(),
                            item.getQuantity(),
                            item.getPriceAtPurchase(),
                            itemTotal
                    );

            items.add(response);
        }

        boolean cancellable =
                order.getStatus() == OrderStatus.PENDING
                        || order.getStatus() == OrderStatus.CONFIRMED;

        return new OrderResponse(
                order.getOrderId(),
                order.getTotalAmount(),
                order.getShippingAddress(),
                order.getPaymentMode().name(),
                order.getStatus().name(),
                order.getOrderDate(),
                cancellable,
                items
        );
    }
}

