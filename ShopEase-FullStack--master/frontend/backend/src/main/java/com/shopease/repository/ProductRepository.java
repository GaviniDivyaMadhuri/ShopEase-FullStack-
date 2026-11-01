package com.shopease.repository;

import com.shopease.model.Product;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;

import java.util.List;

public interface ProductRepository extends JpaRepository<Product, Long>, JpaSpecificationExecutor<Product> {

    List<Product> findByCategory_CategoryId(Long categoryId);

    List<Product> findByTrendingTrue();

    List<Product> findByProductNameContainingIgnoreCase(String keyword);

    List<Product> findByBrandContainingIgnoreCase(String brand);
}
