package com.shopease.controller;

import com.shopease.dto.ProductRequest;
import com.shopease.dto.ProductResponse;
import com.shopease.service.ProductService;

import jakarta.validation.Valid;

import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/products")
public class ProductController {

    private final ProductService productService;

    public ProductController(ProductService productService) {
        this.productService = productService;
    }

    @GetMapping
    public List<ProductResponse> getProducts(
            @RequestParam(required = false) String keyword,
            @RequestParam(required = false) Long categoryId,
            @RequestParam(required = false) String brand,
            @RequestParam(required = false) BigDecimal minPrice,
            @RequestParam(required = false) BigDecimal maxPrice,
            @RequestParam(required = false) Double minRating,
            @RequestParam(required = false) Boolean trending,
            @RequestParam(required = false) String sortBy) {

        return productService.searchProducts(
                keyword,
                categoryId,
                brand,
                minPrice,
                maxPrice,
                minRating,
                trending,
                sortBy
        );
    }

    @GetMapping("/trending")
    public List<ProductResponse> getTrendingProducts() {

        return productService.getTrendingProducts();
    }

    @GetMapping("/{id}")
    public ProductResponse getProductById(
            @PathVariable Long id) {

        return productService.getProductById(id);
    }

    @PostMapping
    public ProductResponse createProduct(
            @Valid @RequestBody ProductRequest request) {

        return productService.createProduct(request);
    }

    @PutMapping("/{id}")
    public ProductResponse updateProduct(
            @PathVariable Long id,
            @Valid @RequestBody ProductRequest request) {

        return productService.updateProduct(id, request);
    }

    @DeleteMapping("/{id}")
    public Map<String, String> deleteProduct(
            @PathVariable Long id) {

        productService.deleteProduct(id);

        return Map.of(
                "message",
                "Product deleted successfully."
        );
    }
}