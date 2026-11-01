package com.shopease.controller;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.time.LocalDateTime;
import java.util.LinkedHashMap;
import java.util.Map;

/**
 * Simple health check endpoint.
 * Used in Phase 1 to confirm the Spring Boot server has started successfully.
 * This endpoint is public (no login required) — see SecurityConfig in later phases.
 */
@RestController
@RequestMapping("/api")
public class HealthController {

    @GetMapping("/health")
    public Map<String, Object> health() {
        Map<String, Object> response = new LinkedHashMap<>();
        response.put("status", "UP");
        response.put("application", "ShopEase Backend");
        response.put("timestamp", LocalDateTime.now());
        return response;
    }

}
