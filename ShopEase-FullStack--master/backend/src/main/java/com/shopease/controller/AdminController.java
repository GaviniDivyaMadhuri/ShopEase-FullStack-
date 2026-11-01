package com.shopease.controller;

import com.shopease.dto.AdminDashboardStatsResponse;
import com.shopease.dto.AdminUserResponse;
import com.shopease.dto.PaymentResponse;
import com.shopease.service.AdminService;
import com.shopease.service.PaymentService;

import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/admin")
public class AdminController {

    private final AdminService adminService;
    private final PaymentService paymentService;

    public AdminController(AdminService adminService,
                           PaymentService paymentService) {
        this.adminService = adminService;
        this.paymentService = paymentService;
    }

    @GetMapping("/dashboard")
    public AdminDashboardStatsResponse getDashboardStats() {
        return adminService.getDashboardStats();
    }

    @GetMapping("/users")
    public List<AdminUserResponse> getAllUsers() {
        return adminService.getAllUsers();
    }

    @PutMapping("/users/{id}/toggle-status")
    public AdminUserResponse toggleUserStatus(@PathVariable Long id) {
        return adminService.toggleUserStatus(id);
    }

    @DeleteMapping("/users/{id}")
    public Map<String, String> deleteUser(@PathVariable Long id) {
        adminService.deleteUser(id);
        return Map.of("message", "User deleted successfully.");
    }

    @GetMapping("/payments")
    public List<PaymentResponse> getAllPayments() {
        return paymentService.getAllPayments();
    }
}