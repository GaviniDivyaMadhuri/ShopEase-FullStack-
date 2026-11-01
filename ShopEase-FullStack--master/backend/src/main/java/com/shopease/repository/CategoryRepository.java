package com.shopease.repository;

import com.shopease.model.Category;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface CategoryRepository extends JpaRepository<Category, Long> {

    Optional<Category> findByCategoryNameIgnoreCase(String categoryName);

    boolean existsByCategoryNameIgnoreCase(String categoryName);

    List<Category> findByParentCategoryIsNull(); // top-level categories only

    List<Category> findByParentCategory_CategoryId(Long parentCategoryId); // subcategories of a given parent
}
