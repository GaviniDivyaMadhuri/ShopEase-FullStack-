package com.shopease;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

/**
 * ShopEase - Main Application Entry Point
 *
 * This is the class that starts the entire Spring Boot backend.
 * Run this class (or use `mvn spring-boot:run`) to start the server.
 */
@SpringBootApplication
public class ShopEaseApplication {

    public static void main(String[] args) {
        SpringApplication.run(ShopEaseApplication.class, args);
        System.out.println("========================================");
        System.out.println(" ShopEase Backend is running!");
        System.out.println(" Test it at: http://localhost:8080/api/health");
        System.out.println("========================================");
    }

}
