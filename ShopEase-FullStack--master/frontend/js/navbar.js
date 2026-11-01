function renderNavbar(basePath = '') {

    const root =
        document.getElementById('navbar-root');

    if (!root) return;


    root.innerHTML = `
    <nav class="navbar navbar-expand-lg se-navbar py-2">

        <div class="container">

            <a class="navbar-brand brand-font"
               href="${basePath}index.html">

                Shop<span>Ease</span>

            </a>


            <button
                class="navbar-toggler"
                type="button"
                data-bs-toggle="collapse"
                data-bs-target="#seNavCollapse">

                <span class="navbar-toggler-icon"></span>

            </button>


            <div
                class="collapse navbar-collapse"
                id="seNavCollapse">

                <ul class="navbar-nav me-auto mb-2 mb-lg-0">

                    <li class="nav-item">
                        <a class="nav-link"
                           href="${basePath}index.html">
                            Home
                        </a>
                    </li>

                    <li class="nav-item">
                        <a class="nav-link"
                           href="${basePath}categories.html">
                            Categories
                        </a>
                    </li>

                    <li class="nav-item">
                        <a class="nav-link"
                           href="${basePath}products.html">
                            Products
                        </a>
                    </li>

                    <li class="nav-item">
                        <a class="nav-link"
                           href="${basePath}my-orders.html">
                            Orders
                        </a>
                    </li>

                    <li class="nav-item">
                        <a class="nav-link"
                           href="#"
                           onclick="scrollToContact(event)">
                            Contact
                        </a>
                    </li>

                </ul>


                <form
                    class="d-flex se-search-form me-3 mb-2 mb-lg-0"
                    style="max-width:280px;"
                    onsubmit="return navbarSearch(event, '${basePath}')">

                    <input
                        type="search"
                        class="form-control form-control-sm"
                        placeholder="Search products..."
                        id="navbarSearchInput">

                    <button
                        class="btn btn-se-primary btn-sm"
                        type="submit">

                        <i class="bi bi-search"></i>

                    </button>

                </form>


                <div class="d-flex align-items-center gap-3">

                    <button
                        class="theme-toggle-btn"
                        onclick="toggleTheme()"
                        title="Toggle dark/light theme">

                        <i
                            class="bi bi-moon-stars"
                            id="theme-icon">
                        </i>

                    </button>


                    <a
                        class="se-icon-link"
                        href="${basePath}wishlist.html"
                        title="Wishlist">

                        <i class="bi bi-heart"></i>

                        <span
                            class="se-badge-count d-none"
                            id="wishlistBadge">
                            0
                        </span>

                    </a>


                    <a
                        class="se-icon-link"
                        href="${basePath}cart.html"
                        title="Cart">

                        <i class="bi bi-cart3"></i>

                        <span
                            class="se-badge-count d-none"
                            id="cartBadge">
                            0
                        </span>

                    </a>


                    <div
                        id="navAuthArea"
                        class="d-flex align-items-center gap-2">
                    </div>

                </div>

            </div>

        </div>

    </nav>
    `;


    const savedTheme =
        localStorage.getItem('shopease-theme')
        || 'light';


    const icon =
        document.getElementById('theme-icon');


    if (icon) {

        icon.className =
            savedTheme === 'light'
                ? 'bi bi-moon-stars'
                : 'bi bi-sun';

    }


    renderAuthArea(basePath);

    refreshNavBadges();
}


/* =========================================================
   AUTH AREA
   ========================================================= */

function renderAuthArea(basePath = '') {

    const area =
        document.getElementById('navAuthArea');

    if (!area) return;


    console.log(
        'NAVBAR CURRENT_USER:',
        CURRENT_USER
    );


    if (CURRENT_USER) {

        const adminLink =
            isAdmin()
                ? `
                    <a
                        class="dropdown-item"
                        href="${basePath}admin/admin-dashboard.html">

                        Admin Dashboard

                    </a>
                  `
                : '';


        const firstName =
            CURRENT_USER.fullName
                ? CURRENT_USER.fullName.split(' ')[0]
                : 'Account';


        area.innerHTML = `

            <div class="dropdown">

                <button
                    class="btn btn-se-outline btn-sm dropdown-toggle"
                    type="button"
                    data-bs-toggle="dropdown">

                    <i class="bi bi-person-circle me-1"></i>

                    ${escapeHtml(firstName)}

                </button>


                <ul class="dropdown-menu dropdown-menu-end">

                    <li>

                        <a
                            class="dropdown-item"
                            href="${basePath}profile.html">

                            <i class="bi bi-person me-2"></i>
                            My Profile

                        </a>

                    </li>


                    <li>

                        <a
                            class="dropdown-item"
                            href="${basePath}my-orders.html">

                            <i class="bi bi-box-seam me-2"></i>
                            My Orders

                        </a>

                    </li>


                    ${adminLink}


                    <li>
                        <hr class="dropdown-divider">
                    </li>


                    <li>

                        <a
                            class="dropdown-item text-danger"
                            href="#"
                            onclick="handleLogout(event, '${basePath}')">

                            <i class="bi bi-box-arrow-right me-2"></i>
                            Logout

                        </a>

                    </li>

                </ul>

            </div>

        `;

    } else {

        area.innerHTML = `

            <a
                href="${basePath}login.html"
                class="btn btn-se-outline btn-sm">

                Login

            </a>


            <a
                href="${basePath}signup.html"
                class="btn btn-se-primary btn-sm">

                Sign Up

            </a>

        `;

    }
}


/* =========================================================
   LOGOUT
   ========================================================= */

async function handleLogout(
    e,
    basePath = ''
) {

    e.preventDefault();


    try {

        await apiRequest(
            '/auth/logout',
            {
                method: 'POST'
            }
        );

    } catch (err) {

        console.error(
            'Logout error:',
            err
        );

    }


    CURRENT_USER = null;


    renderAuthArea(basePath);


    showToast(
        'Logged out successfully.'
    );


    setTimeout(
        () => {

            window.location.href =
                basePath + 'index.html';

        },
        500
    );
}


/* =========================================================
   NAV BADGES
   ========================================================= */

async function refreshNavBadges() {

    const cartBadge =
        document.getElementById(
            'cartBadge'
        );


    const wishlistBadge =
        document.getElementById(
            'wishlistBadge'
        );


    if (!CURRENT_USER) {

        if (cartBadge) {
            cartBadge.classList.add('d-none');
        }

        if (wishlistBadge) {
            wishlistBadge.classList.add('d-none');
        }

        return;
    }


    try {

        const cart =
            await apiRequest('/cart');


        if (cartBadge) {

            const totalItems =
                Number(cart.totalItems || 0);


            cartBadge.textContent =
                totalItems;


            cartBadge.classList.toggle(
                'd-none',
                totalItems === 0
            );

        }

    } catch (err) {

        console.error(
            'Cart badge error:',
            err
        );

    }


    try {

        const wishlist =
            await apiRequest('/wishlist');


        if (wishlistBadge) {

            const count =
                Array.isArray(wishlist)
                    ? wishlist.length
                    : 0;


            wishlistBadge.textContent =
                count;


            wishlistBadge.classList.toggle(
                'd-none',
                count === 0
            );

        }

    } catch (err) {

        console.error(
            'Wishlist badge error:',
            err
        );

    }
}


/* =========================================================
   NAVBAR SEARCH
   ========================================================= */

function navbarSearch(
    e,
    basePath = ''
) {

    e.preventDefault();


    const input =
        document.getElementById(
            'navbarSearchInput'
        );


    const query =
        input
            ? input.value.trim()
            : '';


    window.location.href =
        basePath +
        'products.html' +
        (
            query
                ? '?keyword=' +
                  encodeURIComponent(query)
                : ''
        );


    return false;
}


/* =========================================================
   CONTACT
   ========================================================= */

function scrollToContact(e) {

    e.preventDefault();


    const el =
        document.getElementById(
            'contact'
        );


    if (el) {

        el.scrollIntoView({
            behavior: 'smooth'
        });

    } else {

        window.location.href =
            'index.html#contact';

    }
}


/* =========================================================
   INIT PAGE
   ========================================================= */

async function initPage(
    basePath = ''
) {

    await loadCurrentUser();


    console.log(
        'INIT PAGE USER:',
        CURRENT_USER
    );


    renderNavbar(basePath);

    renderFooter(basePath);
}


/* =========================================================
   FOOTER
   ========================================================= */

function renderFooter(
    basePath = ''
) {

    const root =
        document.getElementById(
            'footer-root'
        );


    if (!root) return;


    root.innerHTML = `

        <footer
            class="se-footer"
            id="contact">

            <div class="container">

                <div class="row g-4">

                    <div class="col-md-4">

                        <h6
                            class="brand-font"
                            style="color:#fff;font-size:1.3rem;">

                            Shop
                            <span
                                style="color:var(--se-accent)">
                                Ease
                            </span>

                        </h6>


                        <p class="small">

                            Everyday products, honestly priced,
                            delivered to your door. Browse thousands
                            of items across Electronics, Fashion,
                            Home & Kitchen, Mobiles, and Books.

                        </p>

                    </div>


                    <div class="col-6 col-md-2">

                        <h6>Shop</h6>

                        <a
                            href="${basePath}categories.html"
                            class="d-block small mb-2">
                            Categories
                        </a>

                        <a
                            href="${basePath}products.html"
                            class="d-block small mb-2">
                            All Products
                        </a>

                        <a
                            href="${basePath}products.html?trending=true"
                            class="d-block small mb-2">
                            Trending Deals
                        </a>

                    </div>


                    <div class="col-6 col-md-2">

                        <h6>Account</h6>

                        <a
                            href="${basePath}profile.html"
                            class="d-block small mb-2">
                            My Profile
                        </a>

                        <a
                            href="${basePath}my-orders.html"
                            class="d-block small mb-2">
                            My Orders
                        </a>

                        <a
                            href="${basePath}wishlist.html"
                            class="d-block small mb-2">
                            Wishlist
                        </a>

                    </div>


                    <div class="col-md-4">

                        <h6>Contact Us</h6>

                        <p class="small mb-1">
                            <i class="bi bi-envelope me-2"></i>
                            support@shopease.example
                        </p>

                        <p class="small mb-1">
                            <i class="bi bi-telephone me-2"></i>
                            +91 98765 43210
                        </p>

                        <p class="small">
                            <i class="bi bi-geo-alt me-2"></i>
                            Bengaluru, India
                        </p>

                    </div>

                </div>


                <hr>


                <p class="small text-center mb-0">

                    © ${new Date().getFullYear()}
                    ShopEase.
                    Built as a learning project -
                    not a real store.

                </p>

            </div>

        </footer>

    `;
}