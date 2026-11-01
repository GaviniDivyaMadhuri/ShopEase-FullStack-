package com.shopease.config;

import com.shopease.model.Category;
import com.shopease.model.Product;
import com.shopease.repository.CategoryRepository;
import com.shopease.repository.ProductRepository;

import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import java.math.BigDecimal;

@Component
public class DataSeeder implements CommandLineRunner {

    private final CategoryRepository categoryRepository;
    private final ProductRepository productRepository;

    public DataSeeder(CategoryRepository categoryRepository,
                      ProductRepository productRepository) {

        this.categoryRepository = categoryRepository;
        this.productRepository = productRepository;
    }

    @Override
    public void run(String... args) {

        // ==========================================
        // CATEGORY DATA
        // ==========================================

        Category electronics = new Category();
        electronics.setCategoryName("Electronics");
        electronics.setImageUrl(
                "https://images.unsplash.com/photo-1498049794561-7780e7231661"
        );
        electronics.setParentCategory(null);

        Category fashion = new Category();
        fashion.setCategoryName("Fashion");
        fashion.setImageUrl(
                "https://images.unsplash.com/photo-1445205170230-053b83016050"
        );
        fashion.setParentCategory(null);

        Category homeKitchen = new Category();
        homeKitchen.setCategoryName("Home & Kitchen");
        homeKitchen.setImageUrl(
                "https://images.unsplash.com/photo-1556911220-bff31c812dba"
        );
        homeKitchen.setParentCategory(null);

        Category books = new Category();
        books.setCategoryName("Books");
        books.setImageUrl(
                "https://images.unsplash.com/photo-1544947950-fa07a98d237f"
        );
        books.setParentCategory(null);


        // ==========================================
        // SAVE CATEGORIES
        // ==========================================

        if (categoryRepository.count() == 0) {

            electronics = categoryRepository.save(electronics);
            fashion = categoryRepository.save(fashion);
            homeKitchen = categoryRepository.save(homeKitchen);
            books = categoryRepository.save(books);

        } else {

            for (Category category : categoryRepository.findAll()) {

                if ("Electronics".equals(category.getCategoryName())) {
                    electronics = category;
                }

                if ("Fashion".equals(category.getCategoryName())) {
                    fashion = category;
                }

                if ("Home & Kitchen".equals(category.getCategoryName())) {
                    homeKitchen = category;
                }

                if ("Books".equals(category.getCategoryName())) {
                    books = category;
                }
            }
        }


        // ==========================================
        // PRODUCT DATA
        // ==========================================

        if (productRepository.count() == 0) {


            // ------------------------------------------
            // 1. HEADPHONES
            // ------------------------------------------

            Product headphones = new Product();

            headphones.setProductName(
                    "Wireless Bluetooth Headphones"
            );

            headphones.setDescription(
                    "High quality wireless Bluetooth headphones"
            );

            headphones.setCategory(electronics);

            headphones.setBrand("Boat");

            headphones.setPrice(
                    new BigDecimal("1999.00")
            );

            headphones.setDiscountPrice(
                    new BigDecimal("1499.00")
            );

            headphones.setStockQty(50);

            headphones.setRating(4.5);

            headphones.setImageUrl(
                    "https://images.unsplash.com/photo-1505740420928-5e560c06d30e"
            );

            headphones.setTrending(true);

            productRepository.save(headphones);


            // ------------------------------------------
            // 2. SMARTPHONE
            // ------------------------------------------

            Product phone = new Product();

            phone.setProductName(
                    "Smartphone X12 128GB"
            );

            phone.setDescription(
                    "Powerful smartphone with 128GB storage"
            );

            phone.setCategory(electronics);

            phone.setBrand("Samsung");

            phone.setPrice(
                    new BigDecimal("24999.00")
            );

            phone.setDiscountPrice(
                    new BigDecimal("21999.00")
            );

            phone.setStockQty(30);

            phone.setRating(4.4);

            phone.setImageUrl(
                    "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9"
            );

            phone.setTrending(true);

            productRepository.save(phone);


            // ------------------------------------------
            // 3. MEN CASUAL SHIRT
            // ------------------------------------------

            Product shirt = new Product();

            shirt.setProductName(
                    "Men Casual Shirt"
            );

            shirt.setDescription(
                    "Comfortable casual shirt for men"
            );

            shirt.setCategory(fashion);

            shirt.setBrand("Roadster");

            shirt.setPrice(
                    new BigDecimal("1499.00")
            );

            shirt.setDiscountPrice(
                    new BigDecimal("999.00")
            );

            shirt.setStockQty(40);

            shirt.setRating(4.2);

            shirt.setImageUrl(
                    "https://images.unsplash.com/photo-1603252110481-7ba873bf42ab"
            );

            shirt.setTrending(false);

            productRepository.save(shirt);


            // ------------------------------------------
            // 4. COOKWARE
            // ------------------------------------------

            Product cookware = new Product();

            cookware.setProductName(
                    "Non-Stick Cookware Set"
            );

            cookware.setDescription(
                    "Premium non-stick cookware set"
            );

            cookware.setCategory(homeKitchen);

            cookware.setBrand("Prestige");

            cookware.setPrice(
                    new BigDecimal("2999.00")
            );

            cookware.setDiscountPrice(
                    new BigDecimal("2299.00")
            );

            cookware.setStockQty(25);

            cookware.setRating(4.6);

            cookware.setImageUrl(
                    "https://images.unsplash.com/photo-1556911220-e15b29be8c8f"
            );

            cookware.setTrending(true);

            productRepository.save(cookware);


            // ------------------------------------------
            // 5. BOOK
            // ------------------------------------------

            Product book = new Product();

            book.setProductName(
                    "Bestseller Novel - The Journey"
            );

            book.setDescription(
                    "A bestselling inspirational novel"
            );

            book.setCategory(books);

            book.setBrand("Penguin");

            book.setPrice(
                    new BigDecimal("499.00")
            );

            book.setDiscountPrice(
                    new BigDecimal("349.00")
            );

            book.setStockQty(60);

            book.setRating(4.7);

            book.setImageUrl(
                    "https://images.unsplash.com/photo-1544947950-fa07a98d237f"
            );

            book.setTrending(true);

            productRepository.save(book);


            // ------------------------------------------
            // 6. SMARTWATCH
            // ------------------------------------------

            Product smartwatch = new Product();

            smartwatch.setProductName(
                    "Smartwatch Fit 3"
            );

            smartwatch.setDescription(
                    "Smart fitness watch with health tracking"
            );

            smartwatch.setCategory(electronics);

            smartwatch.setBrand("Noise");

            smartwatch.setPrice(
                    new BigDecimal("3999.00")
            );

            smartwatch.setDiscountPrice(
                    new BigDecimal("2999.00")
            );

            smartwatch.setStockQty(35);

            smartwatch.setRating(4.3);

            smartwatch.setImageUrl(
                    "https://images.unsplash.com/photo-1523275335684-37898b6baf30"
            );

            smartwatch.setTrending(true);

            productRepository.save(smartwatch);


            // ------------------------------------------
            // 7. WOMEN ETHNIC KURTI
            // ------------------------------------------

            Product kurti = new Product();

            kurti.setProductName(
                    "Women Ethnic Kurti"
            );

            kurti.setDescription(
                    "Beautiful ethnic kurti for women"
            );

            kurti.setCategory(fashion);

            kurti.setBrand("Biba");

            kurti.setPrice(
                    new BigDecimal("1799.00")
            );

            kurti.setDiscountPrice(
                    new BigDecimal("1299.00")
            );

            kurti.setStockQty(45);

            kurti.setRating(4.4);

            kurti.setImageUrl(
                    "https://images.unsplash.com/photo-1583391733956-6c78276477e2"
            );

            kurti.setTrending(false);

            productRepository.save(kurti);


            // ------------------------------------------
            // 8. LED TABLE LAMP
            // ------------------------------------------

            Product lamp = new Product();

            lamp.setProductName(
                    "LED Table Lamp"
            );

            lamp.setDescription(
                    "Modern LED table lamp for home and office"
            );

            lamp.setCategory(homeKitchen);

            lamp.setBrand("Philips");

            lamp.setPrice(
                    new BigDecimal("999.00")
            );

            lamp.setDiscountPrice(
                    new BigDecimal("749.00")
            );

            lamp.setStockQty(50);

            lamp.setRating(4.1);

            lamp.setImageUrl(
                    "https://images.unsplash.com/photo-1507473885765-e6ed057f782c"
            );

            lamp.setTrending(false);

            productRepository.save(lamp);
        }


        // ==========================================
        // FINISHED
        // ==========================================

        System.out.println("========================================");
        System.out.println(" ShopEase Data Seeder Completed!");
        System.out.println(" Categories: 4");
        System.out.println(" Products: 8");
        System.out.println("========================================");
    }
}