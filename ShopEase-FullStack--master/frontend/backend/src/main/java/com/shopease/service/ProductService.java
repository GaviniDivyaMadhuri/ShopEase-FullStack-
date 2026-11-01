package com.shopease.service;

import com.shopease.dto.ProductRequest;
import com.shopease.dto.ProductResponse;
import com.shopease.exception.ResourceNotFoundException;
import com.shopease.model.Category;
import com.shopease.model.Product;
import com.shopease.repository.CategoryRepository;
import com.shopease.repository.ProductRepository;
import com.shopease.repository.ProductSpecification;

import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.List;

@Service
public class ProductService {

    private final ProductRepository productRepository;
    private final CategoryRepository categoryRepository;

    public ProductService(ProductRepository productRepository,
                          CategoryRepository categoryRepository) {
        this.productRepository = productRepository;
        this.categoryRepository = categoryRepository;
    }

    @Transactional
    public ProductResponse createProduct(ProductRequest request) {

        Category category = findCategoryOrThrow(request.getCategoryId());

        Product product = new Product();

        applyRequestToProduct(product, request, category);

        Product saved = productRepository.save(product);

        return toResponse(saved);
    }

    @Transactional(readOnly = true)
    public List<ProductResponse> getAllProducts() {

        return productRepository.findAll()
                .stream()
                .map(this::toResponse)
                .toList();
    }

    @Transactional(readOnly = true)
    public List<ProductResponse> searchProducts(
            String keyword,
            Long categoryId,
            String brand,
            BigDecimal minPrice,
            BigDecimal maxPrice,
            Double minRating,
            Boolean trending,
            String sortBy) {

        Specification<Product> spec = Specification
                .where(ProductSpecification.keywordSearch(keyword))
                .and(ProductSpecification.hasCategory(categoryId))
                .and(ProductSpecification.hasBrand(brand))
                .and(ProductSpecification.priceBetween(minPrice, maxPrice))
                .and(ProductSpecification.minRating(minRating))
                .and(ProductSpecification.isTrending(trending));

        Sort sort = resolveSort(sortBy);

        return productRepository.findAll(spec, sort)
                .stream()
                .map(this::toResponse)
                .toList();
    }

    @Transactional(readOnly = true)
    public List<ProductResponse> getTrendingProducts() {

        return productRepository.findByTrendingTrue()
                .stream()
                .map(this::toResponse)
                .toList();
    }

    private Sort resolveSort(String sortBy) {

        if (sortBy == null || sortBy.isBlank()) {
            return Sort.unsorted();
        }

        return switch (sortBy) {

            case "price_asc" ->
                    Sort.by(Sort.Direction.ASC, "price");

            case "price_desc" ->
                    Sort.by(Sort.Direction.DESC, "price");

            case "rating" ->
                    Sort.by(Sort.Direction.DESC, "rating");

            case "newest" ->
                    Sort.by(Sort.Direction.DESC, "createdAt");

            default ->
                    Sort.unsorted();
        };
    }

    @Transactional(readOnly = true)
    public ProductResponse getProductById(Long id) {

        Product product = findProductOrThrow(id);

        return toResponse(product);
    }

    @Transactional
    public ProductResponse updateProduct(
            Long id,
            ProductRequest request) {

        Product product = findProductOrThrow(id);

        Category category = findCategoryOrThrow(
                request.getCategoryId()
        );

        applyRequestToProduct(
                product,
                request,
                category
        );

        Product updated = productRepository.save(product);

        return toResponse(updated);
    }

    @Transactional
    public void deleteProduct(Long id) {

        Product product = findProductOrThrow(id);

        productRepository.delete(product);
    }

    // ---------- Helpers ----------

    private void applyRequestToProduct(
            Product product,
            ProductRequest request,
            Category category) {

        product.setProductName(
                request.getProductName()
        );

        product.setDescription(
                request.getDescription()
        );

        product.setCategory(category);

        product.setBrand(
                request.getBrand()
        );

        product.setPrice(
                request.getPrice()
        );

        product.setDiscountPrice(
                request.getDiscountPrice()
        );

        product.setStockQty(
                request.getStockQty()
        );

        product.setImageUrl(
                request.getImageUrl()
        );

        product.setTrending(
                request.isTrending()
        );
    }

    private Product findProductOrThrow(Long id) {

        return productRepository.findById(id)
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Product not found with id: " + id
                        )
                );
    }

    private Category findCategoryOrThrow(
            Long categoryId) {

        return categoryRepository.findById(categoryId)
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Category not found with id: "
                                        + categoryId
                        )
                );
    }

    // ---------- Product → Response ----------

    ProductResponse toResponse(Product product) {

        return new ProductResponse(

                product.getProductId(),

                product.getProductName(),

                product.getDescription(),

                product.getCategory().getCategoryId(),

                product.getCategory().getCategoryName(),

                product.getBrand(),

                product.getPrice(),

                product.getDiscountPrice(),

                product.getStockQty(),

                product.getRating(),

                product.getImageUrl(),

                product.isTrending(),

                product.getCreatedAt()
        );
    }
}