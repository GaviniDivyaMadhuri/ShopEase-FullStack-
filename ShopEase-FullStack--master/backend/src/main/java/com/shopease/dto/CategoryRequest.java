package com.shopease.dto;

import jakarta.validation.constraints.NotBlank;

/**
 * Request body for POST /api/categories and PUT /api/categories/{id}
 */
public class CategoryRequest {

    @NotBlank(message = "Category name is required")
    private String categoryName;

    @NotBlank(message = "Category image URL is required")
    private String imageUrl;

    // Optional - null for a top-level category
    private Long parentCategoryId;

    // Default constructor
    public CategoryRequest() {
    }

    // Getters

    public String getCategoryName() {
        return categoryName;
    }

    public String getImageUrl() {
        return imageUrl;
    }

    public Long getParentCategoryId() {
        return parentCategoryId;
    }

    // Setters

    public void setCategoryName(String categoryName) {
        this.categoryName = categoryName;
    }

    public void setImageUrl(String imageUrl) {
        this.imageUrl = imageUrl;
    }

    public void setParentCategoryId(Long parentCategoryId) {
        this.parentCategoryId = parentCategoryId;
    }
}