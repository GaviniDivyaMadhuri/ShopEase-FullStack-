package com.shopease.dto;

/**
 * Response body returned by all Category endpoints.
 */
public class CategoryResponse {

    private Long categoryId;
    private String categoryName;
    private String imageUrl;
    private Long parentCategoryId;
    private String parentCategoryName;

    // Default constructor
    public CategoryResponse() {
    }

    // All arguments constructor
    public CategoryResponse(
            Long categoryId,
            String categoryName,
            String imageUrl,
            Long parentCategoryId,
            String parentCategoryName) {

        this.categoryId = categoryId;
        this.categoryName = categoryName;
        this.imageUrl = imageUrl;
        this.parentCategoryId = parentCategoryId;
        this.parentCategoryName = parentCategoryName;
    }

    // Getters

    public Long getCategoryId() {
        return categoryId;
    }

    public String getCategoryName() {
        return categoryName;
    }

    public String getImageUrl() {
        return imageUrl;
    }

    public Long getParentCategoryId() {
        return parentCategoryId;
    }

    public String getParentCategoryName() {
        return parentCategoryName;
    }

    // Setters

    public void setCategoryId(Long categoryId) {
        this.categoryId = categoryId;
    }

    public void setCategoryName(String categoryName) {
        this.categoryName = categoryName;
    }

    public void setImageUrl(String imageUrl) {
        this.imageUrl = imageUrl;
    }

    public void setParentCategoryId(Long parentCategoryId) {
        this.parentCategoryId = parentCategoryId;
    }

    public void setParentCategoryName(String parentCategoryName) {
        this.parentCategoryName = parentCategoryName;
    }
}