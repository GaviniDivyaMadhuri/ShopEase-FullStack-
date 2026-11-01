package com.shopease.controller;

import com.shopease.dto.OrderResponse;
import com.shopease.dto.OrderStatusUpdateRequest;
import com.shopease.dto.PlaceOrderRequest;
import com.shopease.service.OrderService;

import jakarta.validation.Valid;

import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/orders")
public class OrderController {

    private final OrderService orderService;

    public OrderController(OrderService orderService) {
        this.orderService = orderService;
    }

    @PostMapping
    public OrderResponse placeOrder(
            @Valid @RequestBody PlaceOrderRequest request) {

        return orderService.placeOrder(request);
    }

    @GetMapping
    public List<OrderResponse> getOrderHistory() {

        return orderService.getOrderHistory();
    }

    @GetMapping("/{id}")
    public OrderResponse getOrderById(
            @PathVariable Long id) {

        return orderService.getOrderById(id);
    }

    @PutMapping("/{id}/cancel")
    public OrderResponse cancelOrder(
            @PathVariable Long id) {

        return orderService.cancelOrder(id);
    }

    @PutMapping("/{id}/status")
    public OrderResponse updateOrderStatus(
            @PathVariable Long id,
            @Valid @RequestBody OrderStatusUpdateRequest request) {

        return orderService.updateOrderStatus(id, request);
    }
}