package com.shopease.service;

import com.shopease.dto.AdminDashboardStatsResponse;
import com.shopease.dto.AdminUserResponse;
import com.shopease.exception.ResourceNotFoundException;
import com.shopease.model.Order;
import com.shopease.model.Role;
import com.shopease.model.User;
import com.shopease.model.enums.OrderStatus;
import com.shopease.repository.CategoryRepository;
import com.shopease.repository.OrderRepository;
import com.shopease.repository.ProductRepository;
import com.shopease.repository.UserRepository;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;

@Service
public class AdminService {

    private final UserRepository userRepository;
    private final ProductRepository productRepository;
    private final CategoryRepository categoryRepository;
    private final OrderRepository orderRepository;

    // Constructor
    public AdminService(UserRepository userRepository,
                        ProductRepository productRepository,
                        CategoryRepository categoryRepository,
                        OrderRepository orderRepository) {

        this.userRepository = userRepository;
        this.productRepository = productRepository;
        this.categoryRepository = categoryRepository;
        this.orderRepository = orderRepository;
    }

    public AdminDashboardStatsResponse getDashboardStats() {

        List<Order> allOrders = orderRepository.findAll();

        BigDecimal totalRevenue = BigDecimal.ZERO;

        for (Order order : allOrders) {

            if (order.getStatus() != OrderStatus.CANCELLED) {

                if (order.getTotalAmount() != null) {
                    totalRevenue = totalRevenue.add(
                            order.getTotalAmount()
                    );
                }
            }
        }

        long pendingOrders = 0;

        for (Order order : allOrders) {

            if (order.getStatus() == OrderStatus.PENDING) {
                pendingOrders++;
            }
        }

        return new AdminDashboardStatsResponse(
                userRepository.count(),
                productRepository.count(),
                categoryRepository.count(),
                orderRepository.count(),
                totalRevenue,
                pendingOrders
        );
    }

    public List<AdminUserResponse> getAllUsers() {

        List<User> users = userRepository.findAll();

        List<AdminUserResponse> responses = new ArrayList<>();

        for (User user : users) {
            responses.add(toResponse(user));
        }

        return responses;
    }

    @Transactional
    public AdminUserResponse toggleUserStatus(Long userId) {

        User user = userRepository.findById(userId)
                .orElseThrow(() ->
                        new ResourceNotFoundException("User not found."));

        user.setEnabled(!user.isEnabled());

        User updated = userRepository.save(user);

        return toResponse(updated);
    }

    @Transactional
    public void deleteUser(Long userId) {

        User user = userRepository.findById(userId)
                .orElseThrow(() ->
                        new ResourceNotFoundException("User not found."));

        userRepository.delete(user);
    }

    // ---------- helper ----------

    private AdminUserResponse toResponse(User user) {

        List<String> roleNames = new ArrayList<>();

        for (Role role : user.getRoles()) {

            roleNames.add(
                    role.getRoleName().name()
            );
        }

        return new AdminUserResponse(
                user.getUserId(),
                user.getFullName(),
                user.getEmail(),
                user.getPhone(),
                roleNames,
                user.isEnabled(),
                user.getCreatedAt()
        );
    }
}