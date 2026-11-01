# ShopEase - Full Stack E-Commerce Application

A complete e-commerce web application built with **HTML + CSS + JavaScript + Bootstrap** (frontend) and **Spring Boot + Spring Security + Hibernate/JPA + MySQL** (backend).

## Project Structure

```
ShopEase/
├── frontend/                  Plain HTML/CSS/JS + Bootstrap 5
│   ├── *.html                 All customer-facing pages (home, products, cart, checkout, orders, etc.)
│   ├── admin/                 Admin panel pages (dashboard, product/category/user/order/payment management)
│   ├── css/                   style.css (design system) + responsive.css
│   └── js/                    config.js, navbar.js, auth.js, product.js, cart.js, wishlist.js,
│                               checkout.js, order.js, profile.js, admin.js
│
├── backend/                   Spring Boot project (Maven)
│   ├── pom.xml
│   └── src/main/java/com/shopease/
│       ├── controller/        REST endpoints
│       ├── service/           Business logic
│       ├── repository/        Spring Data JPA repositories
│       ├── model/              JPA entities (+ model/enums)
│       ├── dto/                 Request/response DTOs
│       ├── security/           Spring Security config, CustomUserDetailsService, CurrentUserProvider
│       ├── config/              CORS config, startup DataSeeder
│       └── exception/           Custom exceptions + GlobalExceptionHandler
│   └── src/main/resources/application.properties
│
└── database/
    └── schema.sql              Full schema + sample data (reference - Hibernate auto-creates tables)
```

## How to Run

### 1. Database
Install MySQL and make sure it's running. The backend will auto-create the `shopease_db` database and all tables on first run (via `spring.jpa.hibernate.ddl-auto=update`) - you don't need to run `schema.sql` manually unless you want to.

### 2. Backend
```bash
cd ShopEase/backend
# Edit src/main/resources/application.properties if your MySQL username/password differ from root/root
mvn spring-boot:run
```
Wait for: `ShopEase Backend is running!` in the console. It also seeds:
- Roles (`ROLE_USER`, `ROLE_ADMIN`)
- A default admin account: **admin@shopease.com / Admin@123**
- 5 categories and 9 sample products with real online images

Test it: `http://localhost:8080/api/health`

### 3. Frontend
Open the `ShopEase/frontend` folder in VS Code and run it with the **Live Server** extension (or any static file server) on port **5500** - this matches the CORS configuration in the backend (`app.cors.allowed-origins` in `application.properties`). Do **not** open the HTML files directly via `file://`.

Then visit `index.html` in your browser (via Live Server, e.g. `http://127.0.0.1:5500/index.html`).

## Default Logins

| Role  | Email                  | Password   |
|-------|------------------------|------------|
| Admin | admin@shopease.com     | Admin@123  |
| User  | *(sign up your own)*   | —          |

## Key Design Points

- **Session-based auth** with Spring Security + BCrypt - no JWT, no OAuth2.
- **Online image URL flow**: every product's `imageUrl` is stored once in MySQL and returned by every relevant backend endpoint; the frontend always renders that same URL everywhere the product appears (home, listings, cart, wishlist, checkout, orders, admin).
- **Demo/simulated payments only** - no real gateway, no card/CVV/OTP ever stored.
- Full CRUD across Users, Products, Categories, Cart, Wishlist, Orders, Payments, Reviews, and Addresses, with role-based access (USER vs ADMIN) enforced by Spring Security.

## Notes / Known Limitations (by design, for a learning project)

- "Forgot password" is a UI-only demo (no email is actually sent).
- Payments are simulated - CARD/UPI are marked SUCCESS instantly, COD is PENDING until delivery.
- No pagination on product/order lists (fine at demo data scale; would be a natural next enhancement).
