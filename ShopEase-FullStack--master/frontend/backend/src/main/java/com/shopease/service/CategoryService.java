package com.shopease.service;

import com.shopease.dto.CategoryRequest;
import com.shopease.dto.CategoryResponse;
import com.shopease.exception.ResourceNotFoundException;
import com.shopease.model.Category;
import com.shopease.repository.CategoryRepository;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;

@Service
public class CategoryService {

    private final CategoryRepository categoryRepository;

    // Constructor
    public CategoryService(CategoryRepository categoryRepository) {
        this.categoryRepository = categoryRepository;
    }

    @Transactional
    public CategoryResponse createCategory(CategoryRequest request) {

        if (categoryRepository.existsByCategoryNameIgnoreCase(
                request.getCategoryName())) {

            throw new IllegalArgumentException(
                    "A category with this name already exists."
            );
        }

        Category category = new Category();

        category.setCategoryName(request.getCategoryName());
        category.setImageUrl(request.getImageUrl());
        category.setParentCategory(
                resolveParent(request.getParentCategoryId())
        );

        Category saved = categoryRepository.save(category);

        return toResponse(saved);
    }

    public List<CategoryResponse> getAllCategories() {

        List<Category> categories =
                categoryRepository.findAll();

        List<CategoryResponse> responses =
                new ArrayList<>();

        for (Category category : categories) {

            responses.add(
                    toResponse(category)
            );
        }

        return responses;
    }

    public CategoryResponse getCategoryById(Long id) {

        Category category =
                findCategoryOrThrow(id);

        return toResponse(category);
    }

    @Transactional
    public CategoryResponse updateCategory(
            Long id,
            CategoryRequest request) {

        Category category =
                findCategoryOrThrow(id);

        // Check duplicate category name
        if (!category.getCategoryName()
                .equalsIgnoreCase(request.getCategoryName())
                && categoryRepository.existsByCategoryNameIgnoreCase(
                        request.getCategoryName())) {

            throw new IllegalArgumentException(
                    "A category with this name already exists."
            );
        }

        category.setCategoryName(
                request.getCategoryName()
        );

        category.setImageUrl(
                request.getImageUrl()
        );

        category.setParentCategory(
                resolveParent(
                        request.getParentCategoryId()
                )
        );

        Category updated =
                categoryRepository.save(category);

        return toResponse(updated);
    }

    @Transactional
    public void deleteCategory(Long id) {

        Category category =
                findCategoryOrThrow(id);

        categoryRepository.delete(category);
    }

    // ---------- helpers ----------

    private Category findCategoryOrThrow(Long id) {

        return categoryRepository.findById(id)
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Category not found with id: " + id
                        )
                );
    }

    private Category resolveParent(
            Long parentCategoryId) {

        if (parentCategoryId == null) {
            return null;
        }

        return categoryRepository
                .findById(parentCategoryId)
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Parent category not found with id: "
                                + parentCategoryId
                        )
                );
    }

    private CategoryResponse toResponse(
            Category category) {

        Long parentId = null;
        String parentName = null;

        if (category.getParentCategory() != null) {

            parentId = category
                    .getParentCategory()
                    .getCategoryId();

            parentName = category
                    .getParentCategory()
                    .getCategoryName();
        }

        return new CategoryResponse(
                category.getCategoryId(),
                category.getCategoryName(),
                category.getImageUrl(),
                parentId,
                parentName
        );
    }
}