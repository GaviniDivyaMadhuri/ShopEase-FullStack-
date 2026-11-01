-- =========================================================
-- ShopEase - Complete Database Schema
-- =========================================================
-- NOTE: You do NOT need to run this manually to use the app.
-- Spring Boot (spring.jpa.hibernate.ddl-auto=update) creates every table
-- automatically the first time the backend starts, and DataSeeder.java
-- seeds roles, a default admin account, and sample categories/products
-- automatically as well.
--
-- This file is provided as a REFERENCE / DOCUMENTATION deliverable,
-- showing the full schema, relationships, and constraints, and can be
-- run manually on a fresh MySQL instance if you prefer to inspect or
-- pre-create the schema by hand.
-- =========================================================

CREATE DATABASE IF NOT EXISTS shopease_db;
USE shopease_db;

-- ---------------------------------------------------------
-- Users & Roles
-- ---------------------------------------------------------
CREATE TABLE IF NOT EXISTS roles (
    role_id     BIGINT AUTO_INCREMENT PRIMARY KEY,
    role_name   VARCHAR(20) NOT NULL UNIQUE
);

CREATE TABLE IF NOT EXISTS users (
    user_id     BIGINT AUTO_INCREMENT PRIMARY KEY,
    full_name   VARCHAR(100) NOT NULL,
    email       VARCHAR(150) NOT NULL UNIQUE,
    password    VARCHAR(255) NOT NULL,
    phone       VARCHAR(20),
    enabled     BOOLEAN NOT NULL DEFAULT TRUE,
    created_at  DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS user_roles (
    user_id     BIGINT NOT NULL,
    role_id     BIGINT NOT NULL,
    PRIMARY KEY (user_id, role_id),
    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE,
    FOREIGN KEY (role_id) REFERENCES roles(role_id) ON DELETE CASCADE
);

-- ---------------------------------------------------------
-- Categories (self-referencing for subcategories)
-- ---------------------------------------------------------
CREATE TABLE IF NOT EXISTS categories (
    category_id         BIGINT AUTO_INCREMENT PRIMARY KEY,
    category_name        VARCHAR(100) NOT NULL UNIQUE,
    image_url             VARCHAR(500) NOT NULL,
    parent_category_id    BIGINT,
    FOREIGN KEY (parent_category_id) REFERENCES categories(category_id) ON DELETE SET NULL
);

-- ---------------------------------------------------------
-- Products
-- ---------------------------------------------------------
CREATE TABLE IF NOT EXISTS products (
    product_id      BIGINT AUTO_INCREMENT PRIMARY KEY,
    product_name     VARCHAR(200) NOT NULL,
    description      VARCHAR(2000),
    category_id      BIGINT NOT NULL,
    brand            VARCHAR(100),
    price            DECIMAL(10,2) NOT NULL,
    discount_price   DECIMAL(10,2),
    stock_qty        INT NOT NULL DEFAULT 0,
    rating           DOUBLE NOT NULL DEFAULT 0.0,
    image_url        VARCHAR(500) NOT NULL,     -- online image URL, single source of truth app-wide
    trending         BOOLEAN NOT NULL DEFAULT FALSE,
    created_at       DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (category_id) REFERENCES categories(category_id),
    CHECK (price > 0),
    CHECK (stock_qty >= 0)
);

-- ---------------------------------------------------------
-- Cart
-- ---------------------------------------------------------
CREATE TABLE IF NOT EXISTS cart (
    cart_id      BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_id      BIGINT NOT NULL,
    product_id   BIGINT NOT NULL,
    quantity     INT NOT NULL,
    added_at     DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    UNIQUE KEY uq_cart_user_product (user_id, product_id),
    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE,
    FOREIGN KEY (product_id) REFERENCES products(product_id) ON DELETE CASCADE,
    CHECK (quantity > 0)
);

-- ---------------------------------------------------------
-- Wishlist
-- ---------------------------------------------------------
CREATE TABLE IF NOT EXISTS wishlist (
    wishlist_id  BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_id      BIGINT NOT NULL,
    product_id   BIGINT NOT NULL,
    added_at     DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    UNIQUE KEY uq_wishlist_user_product (user_id, product_id),
    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE,
    FOREIGN KEY (product_id) REFERENCES products(product_id) ON DELETE CASCADE
);

-- ---------------------------------------------------------
-- Addresses
-- ---------------------------------------------------------
CREATE TABLE IF NOT EXISTS addresses (
    address_id      BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_id         BIGINT NOT NULL,
    full_name       VARCHAR(100) NOT NULL,
    phone_number    VARCHAR(20) NOT NULL,
    address_line    VARCHAR(300) NOT NULL,
    city            VARCHAR(100) NOT NULL,
    state           VARCHAR(100) NOT NULL,
    pincode         VARCHAR(10) NOT NULL,
    is_default      BOOLEAN NOT NULL DEFAULT FALSE,
    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE
);

-- ---------------------------------------------------------
-- Orders & Order Items
-- ---------------------------------------------------------
CREATE TABLE IF NOT EXISTS orders (
    order_id          BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_id           BIGINT NOT NULL,
    total_amount      DECIMAL(10,2) NOT NULL,
    shipping_address  VARCHAR(500) NOT NULL,     -- text snapshot at time of order
    payment_mode      VARCHAR(20) NOT NULL,       -- COD, CARD, UPI
    status            VARCHAR(20) NOT NULL DEFAULT 'PENDING',
                      -- PENDING, CONFIRMED, SHIPPED, DELIVERED, CANCELLED
    order_date        DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(user_id)
);

CREATE TABLE IF NOT EXISTS order_items (
    order_item_id      BIGINT AUTO_INCREMENT PRIMARY KEY,
    order_id           BIGINT NOT NULL,
    product_id         BIGINT NOT NULL,
    quantity           INT NOT NULL,
    price_at_purchase  DECIMAL(10,2) NOT NULL,    -- price snapshot at time of order
    FOREIGN KEY (order_id) REFERENCES orders(order_id) ON DELETE CASCADE,
    FOREIGN KEY (product_id) REFERENCES products(product_id)
);

-- ---------------------------------------------------------
-- Payments (demo/simulated only - never store card/CVV/OTP)
-- ---------------------------------------------------------
CREATE TABLE IF NOT EXISTS payments (
    payment_id      BIGINT AUTO_INCREMENT PRIMARY KEY,
    order_id        BIGINT NOT NULL,
    payment_method  VARCHAR(20) NOT NULL,   -- COD, CARD, UPI
    amount          DECIMAL(10,2) NOT NULL,
    payment_status  VARCHAR(20) NOT NULL,   -- PENDING, SUCCESS, FAILED
    payment_date    DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (order_id) REFERENCES orders(order_id)
);

-- ---------------------------------------------------------
-- Reviews
-- ---------------------------------------------------------
CREATE TABLE IF NOT EXISTS reviews (
    review_id    BIGINT AUTO_INCREMENT PRIMARY KEY,
    product_id   BIGINT NOT NULL,
    user_id      BIGINT NOT NULL,
    rating       INT NOT NULL,
    comment      VARCHAR(1000),
    created_at   DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    UNIQUE KEY uq_review_user_product (user_id, product_id),
    FOREIGN KEY (product_id) REFERENCES products(product_id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE,
    CHECK (rating BETWEEN 1 AND 5)
);

-- =========================================================
-- Sample / Dummy Data
-- (This is what DataSeeder.java also creates automatically at runtime -
--  included here for completeness as a standalone SQL reference.)
-- =========================================================

INSERT INTO roles (role_name) VALUES ('ROLE_USER'), ('ROLE_ADMIN');

-- Password below is BCrypt-hashed "Admin@123" (never store plain text passwords)
INSERT INTO users (full_name, email, password, phone, enabled) VALUES
('ShopEase Admin', 'admin@shopease.com', '$2b$12$N1I6AFG4rV/ThxI4vIc6wea3/czZD9oBOa97gN3w/b3spVFvm30cS', '9999999999', TRUE);

INSERT INTO user_roles (user_id, role_id)
SELECT u.user_id, r.role_id FROM users u, roles r
WHERE u.email = 'admin@shopease.com' AND r.role_name IN ('ROLE_USER', 'ROLE_ADMIN');

INSERT INTO categories (category_name, image_url, parent_category_id) VALUES
('Electronics', 'https://images.unsplash.com/photo-1498049794561-7780e7231661?w=500', NULL),
('Fashion', 'https://images.unsplash.com/photo-1445205170230-053b83016050?w=500', NULL),
('Home & Kitchen', 'https://images.unsplash.com/photo-1556911220-e15b29be8c8f?w=500', NULL),
('Mobiles', 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=500', NULL),
('Books', 'https://images.unsplash.com/photo-1512820790803-83ca734da794?w=500', NULL);

INSERT INTO products (product_name, description, category_id, brand, price, discount_price, stock_qty, image_url, trending) VALUES
('Wireless Bluetooth Headphones', 'Over-ear headphones with noise cancellation and 30-hour battery life.',
 (SELECT category_id FROM categories WHERE category_name='Electronics'), 'SoundCore', 2999.00, 1999.00, 50,
 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500', TRUE),

('Smartwatch Series 5', 'Fitness tracking smartwatch with heart-rate monitor and AMOLED display.',
 (SELECT category_id FROM categories WHERE category_name='Electronics'), 'TechFit', 4999.00, 3499.00, 30,
 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500', TRUE),

('Galaxy Smartphone X200', '6.5-inch AMOLED display, 128GB storage, triple camera setup.',
 (SELECT category_id FROM categories WHERE category_name='Mobiles'), 'Galanova', 18999.00, 16499.00, 25,
 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=500', TRUE),

('Men''s Casual Cotton Shirt', 'Breathable slim-fit cotton shirt, available in multiple colors.',
 (SELECT category_id FROM categories WHERE category_name='Fashion'), 'UrbanThread', 1299.00, 799.00, 100,
 'https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?w=500', FALSE),

('Women''s Running Shoes', 'Lightweight, cushioned running shoes for everyday training.',
 (SELECT category_id FROM categories WHERE category_name='Fashion'), 'StrideFlex', 2499.00, 1799.00, 60,
 'https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?w=500', TRUE),

('Non-Stick Cookware Set (5 Pcs)', 'Durable non-stick cookware set, induction-compatible.',
 (SELECT category_id FROM categories WHERE category_name='Home & Kitchen'), 'HomeChef', 3499.00, 2799.00, 40,
 'https://images.unsplash.com/photo-1584990347449-a5d9f800a783?w=500', FALSE),

('Automatic Espresso Coffee Maker', 'One-touch espresso machine with milk frother.',
 (SELECT category_id FROM categories WHERE category_name='Home & Kitchen'), 'BrewMate', 7999.00, 6499.00, 20,
 'https://images.unsplash.com/photo-1517668808822-9ebb02f2a0e6?w=500', TRUE),

('The Silent Ocean - Novel', 'A gripping fiction novel about resilience and the sea.',
 (SELECT category_id FROM categories WHERE category_name='Books'), 'PenCraft Publications', 499.00, 349.00, 200,
 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=500', FALSE),

('Atomic Habits (Self-Help)', 'A practical guide to building good habits and breaking bad ones.',
 (SELECT category_id FROM categories WHERE category_name='Books'), 'PenCraft Publications', 599.00, 399.00, 150,
 'https://images.unsplash.com/photo-1512820790803-83ca734da794?w=500', TRUE);
