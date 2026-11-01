package com.shopease.repository;

import com.shopease.model.Product;
import org.springframework.data.jpa.domain.Specification;

import java.math.BigDecimal;

public interface ProductSpecification {

    static Specification<Product> keywordSearch(String keyword) {

        return (root, query, cb) -> {

            if (keyword == null || keyword.isBlank()) {
                return cb.conjunction();
            }

            String likePattern = "%" + keyword.toLowerCase() + "%";

            return cb.or(
                    cb.like(
                            cb.lower(root.get("productName")),
                            likePattern
                    ),

                    cb.like(
                            cb.lower(root.get("brand")),
                            likePattern
                    ),

                    cb.like(
                            cb.lower(
                                    root.get("category")
                                        .get("categoryName")
                            ),
                            likePattern
                    )
            );
        };
    }

    static Specification<Product> hasCategory(Long categoryId) {

        return (root, query, cb) -> {

            if (categoryId == null) {
                return cb.conjunction();
            }

            return cb.equal(
                    root.get("category").get("categoryId"),
                    categoryId
            );
        };
    }

    static Specification<Product> hasBrand(String brand) {

        return (root, query, cb) -> {

            if (brand == null || brand.isBlank()) {
                return cb.conjunction();
            }

            return cb.equal(
                    cb.lower(root.get("brand")),
                    brand.toLowerCase()
            );
        };
    }

    static Specification<Product> priceBetween(
            BigDecimal minPrice,
            BigDecimal maxPrice) {

        return (root, query, cb) -> {

            if (minPrice == null && maxPrice == null) {
                return cb.conjunction();
            }

            if (minPrice != null && maxPrice != null) {

                return cb.between(
                        root.get("price"),
                        minPrice,
                        maxPrice
                );
            }

            if (minPrice != null) {

                return cb.greaterThanOrEqualTo(
                        root.get("price"),
                        minPrice
                );
            }

            return cb.lessThanOrEqualTo(
                    root.get("price"),
                    maxPrice
            );
        };
    }

    static Specification<Product> minRating(Double minRating) {

        return (root, query, cb) -> {

            if (minRating == null) {
                return cb.conjunction();
            }

            return cb.greaterThanOrEqualTo(
                    root.get("rating"),
                    minRating
            );
        };
    }

    static Specification<Product> isTrending(Boolean trending) {

        return (root, query, cb) -> {

            if (trending == null || !trending) {
                return cb.conjunction();
            }

            return cb.isTrue(root.get("trending"));
        };
    }
}