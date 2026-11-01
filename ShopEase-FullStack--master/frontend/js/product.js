/* =========================================================
   ShopEase - product.js
   =========================================================
   Includes:

   1. Image helper
   2. Related image fallback
   3. Wishlist
   4. Product cards
   5. Home categories
   6. Featured products
   7. Trending products
   8. Categories page
   9. Product listing
   10. Search / Filter / Sort
   11. Product detail
   12. Reviews
   ========================================================= */


let WISHLIST_IDS = new Set();
let CURRENT_PRODUCT = null;


/* =========================================================
   IMAGE HELPER
   ========================================================= */

/*
 * Category based fallback images.
 *
 * If a product image is broken or missing,
 * category related image will be shown.
 */

const CATEGORY_FALLBACK_IMAGES = {

    1:
        'https://images.unsplash.com/photo-1498049794561-7780e7231661?auto=format&fit=crop&w=600&q=80',

    2:
        'https://images.unsplash.com/photo-1445205170230-053b83016050?auto=format&fit=crop&w=600&q=80',

    3:
        'https://images.unsplash.com/photo-1556911220-e15b29be8c8f?auto=format&fit=crop&w=600&q=80',

    4:
        'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=600&q=80',

    5:
        'https://images.unsplash.com/photo-1543002588-bfa74002ed7e?auto=format&fit=crop&w=600&q=80',

    8:
        'https://images.unsplash.com/photo-1596462502278-27bfdc403348?auto=format&fit=crop&w=600&q=80',

    9:
        'https://images.unsplash.com/photo-1461896836934-ffe607ba8211?auto=format&fit=crop&w=600&q=80',

    10:
        'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?auto=format&fit=crop&w=600&q=80',

    14:
        'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=600&q=80',

    15:
        'https://images.unsplash.com/photo-1524805444758-089113d48a6d?auto=format&fit=crop&w=600&q=80',

    16:
        'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&w=600&q=80',

    17:
        'https://images.unsplash.com/photo-1594736797933-d0b22e9a5c8a?auto=format&fit=crop&w=600&q=80',

    18:
        'https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=600&q=80',

    19:
        'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&w=600&q=80',

    20:
        'https://images.unsplash.com/photo-1626806787461-102c1bfaaea1?auto=format&fit=crop&w=600&q=80',

    21:
        'https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=600&q=80',

    22:
        'https://images.unsplash.com/photo-1556228720-195a672e8a03?auto=format&fit=crop&w=600&q=80',

    23:
        'https://images.unsplash.com/photo-1589924691995-400dc9ecc119?auto=format&fit=crop&w=600&q=80',

    24:
        'https://images.unsplash.com/photo-1456735190827-d1262f71b8a3?auto=format&fit=crop&w=600&q=80',

    25:
        'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=600&q=80'
};


/* =========================================================
   PRODUCT SPECIFIC FALLBACK IMAGES
   ========================================================= */

const PRODUCT_FALLBACK_IMAGES = {

    'non stick frying pan':
        'https://images.unsplash.com/photo-1556911220-e15b29be8c8f?auto=format&fit=crop&w=600&q=80',

    'electric kettle':
        'https://images.unsplash.com/photo-1594212699903-ec8a3eca50f5?auto=format&fit=crop&w=600&q=80',

    'coffee mug set':
        'https://images.unsplash.com/photo-1514228742587-6b1558fcca3d?auto=format&fit=crop&w=600&q=80',

    'kitchen knife set':
        'https://images.unsplash.com/photo-1593618998160-e34014e67546?auto=format&fit=crop&w=600&q=80',

    'dining table':
        'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&w=600&q=80',

    'glass storage jars':
        'https://images.unsplash.com/photo-1583947215259-38e31be8751f?auto=format&fit=crop&w=600&q=80'
};


/* =========================================================
   GET PRODUCT IMAGE
   ========================================================= */

function getProductImage(imageUrl) {

    if (
        imageUrl &&
        typeof imageUrl === 'string'
    ) {

        const url =
            imageUrl.trim();

        if (
            url.startsWith('http://') ||
            url.startsWith('https://')
        ) {

            return url;

        }

    }

    return FALLBACK_IMAGE;
}


/* =========================================================
   GET RELATED PRODUCT IMAGE
   ========================================================= */

function getRelatedProductImage(product) {

    if (!product) {

        return FALLBACK_IMAGE;

    }


    /*
     * Product specific image first.
     */

    const productName =
        (product.productName || '')
            .trim()
            .toLowerCase();


    if (
        PRODUCT_FALLBACK_IMAGES[productName]
    ) {

        return PRODUCT_FALLBACK_IMAGES[
            productName
        ];

    }


    /*
     * Category image second.
     */

    const categoryId =
        Number(
            product.categoryId
        );


    if (
        CATEGORY_FALLBACK_IMAGES[categoryId]
    ) {

        return CATEGORY_FALLBACK_IMAGES[
            categoryId
        ];

    }


    /*
     * Final fallback.
     */

    return FALLBACK_IMAGE;
}


/* =========================================================
   GET CATEGORY IMAGE
   ========================================================= */

function getCategoryImage(category) {

    if (!category) {

        return FALLBACK_IMAGE;

    }


    if (
        category.imageUrl &&
        typeof category.imageUrl === 'string'
    ) {

        const url =
            category.imageUrl.trim();


        if (
            url.startsWith('http://') ||
            url.startsWith('https://')
        ) {

            return url;

        }

    }


    /*
     * Use category ID fallback.
     */

    const categoryId =
        Number(
            category.categoryId
        );


    if (
        CATEGORY_FALLBACK_IMAGES[categoryId]
    ) {

        return CATEGORY_FALLBACK_IMAGES[
            categoryId
        ];

    }


    return FALLBACK_IMAGE;
}


/* =========================================================
   REFRESH WISHLIST IDS
   ========================================================= */

async function refreshWishlistIds() {

    WISHLIST_IDS =
        new Set();


    if (!isLoggedIn()) {

        return;

    }


    try {

        const wishlist =
            await apiRequest(
                '/wishlist'
            );


        if (
            Array.isArray(wishlist)
        ) {

            wishlist.forEach(
                item => {

                    if (
                        item.productId !==
                            undefined &&
                        item.productId !==
                            null
                    ) {

                        WISHLIST_IDS.add(
                            Number(
                                item.productId
                            )
                        );

                    }

                }
            );

        }

    } catch (error) {

        console.error(
            'Wishlist loading error:',
            error
        );

    }
}


/* =========================================================
   PRODUCT CARD
   ========================================================= */

function renderProductCard(product) {

    const hasDiscount =
        product.discountPrice !== null &&
        product.discountPrice !== undefined &&
        Number(product.discountPrice) <
            Number(product.price);


    const displayPrice =
        hasDiscount
            ? product.discountPrice
            : product.price;


    const discountPercentage =
        hasDiscount
            ? Math.round(
                (
                    1 -
                    Number(
                        product.discountPrice
                    ) /
                    Number(
                        product.price
                    )
                ) * 100
            )
            : 0;


    const isWishlisted =
        WISHLIST_IDS.has(
            Number(
                product.productId
            )
        );


    const outOfStock =
        Number(
            product.stockQty
        ) <= 0;


    /*
     * Original DB image.
     */

    const imageUrl =
        getProductImage(
            product.imageUrl
        );


    /*
     * Related fallback image.
     */

    const relatedImageUrl =
        getRelatedProductImage(
            product
        );


    return `

        <div class="col-6 col-md-4 col-lg-3">

            <div class="se-product-card">

                ${
                    product.trending
                        ? `
                            <span class="se-trending-badge">
                                Trending
                            </span>
                        `
                        : ''
                }


                <!-- WISHLIST -->

                <button
                    type="button"
                    class="se-wishlist-btn ${
                        isWishlisted
                            ? 'active'
                            : ''
                    }"
                    onclick="
                        quickToggleWishlist(
                            event,
                            ${product.productId},
                            this
                        )
                    "
                    title="Wishlist">

                    <i class="bi ${
                        isWishlisted
                            ? 'bi-heart-fill'
                            : 'bi-heart'
                    }"></i>

                </button>


                <!-- PRODUCT IMAGE -->

                <a
                    href="product-detail.html?id=${
                        product.productId
                    }"
                    class="se-product-img-wrap">

                    <img
                        src="${imageUrl}"
                        alt="${escapeHtml(
                            product.productName
                        )}"
                        loading="lazy"
                        onerror="
                            this.onerror=null;
                            this.src='${relatedImageUrl}';
                        ">

                </a>


                <!-- PRODUCT BODY -->

                <div class="se-product-body">


                    <!-- BRAND -->

                    ${
                        product.brand
                            ? `
                                <div class="se-product-brand">

                                    ${escapeHtml(
                                        product.brand
                                    )}

                                </div>
                              `
                            : ''
                    }


                    <!-- PRODUCT NAME -->

                    <a
                        href="product-detail.html?id=${
                            product.productId
                        }"
                        class="se-product-title text-decoration-none">

                        ${escapeHtml(
                            product.productName
                        )}

                    </a>


                    <!-- RATING -->

                    <div
                        class="d-flex align-items-center gap-2 mt-1">

                        <span class="se-rating-badge">

                            <i
                                class="bi bi-star-fill"
                                style="font-size:0.65rem;">
                            </i>

                            ${Number(
                                product.rating || 0
                            ).toFixed(1)}

                        </span>


                        ${
                            outOfStock
                                ? `
                                    <span
                                        class="small text-danger">

                                        Out of stock

                                    </span>
                                  `
                                : ''
                        }

                    </div>


                    <!-- PRICE -->

                    <div class="se-price-row">

                        <span
                            class="se-price-current">

                            ${formatCurrency(
                                displayPrice
                            )}

                        </span>


                        ${
                            hasDiscount
                                ? `

                                    <span
                                        class="
                                            se-price-original
                                        ">

                                        ${formatCurrency(
                                            product.price
                                        )}

                                    </span>


                                    <span
                                        class="
                                            se-price-discount
                                        ">

                                        ${discountPercentage}% off

                                    </span>

                                  `
                                : ''
                        }

                    </div>


                    <!-- ADD TO CART -->

                    <button
                        type="button"
                        class="
                            btn
                            btn-se-primary
                            btn-sm
                            mt-2
                            w-100
                        "
                        ${
                            outOfStock
                                ? 'disabled'
                                : ''
                        }
                        onclick="
                            quickAddToCart(
                                event,
                                ${product.productId},
                                this
                            )
                        ">

                        <i
                            class="
                                bi
                                bi-cart-plus
                                me-1
                            ">
                        </i>

                        Add to Cart

                    </button>


                </div>

            </div>

        </div>

    `;
}


/* =========================================================
   HYDRATE PRODUCT IMAGES
   ========================================================= */

function hydrateProductImages(container) {

    if (!container) {

        return;

    }


    const images =
        container.querySelectorAll(
            'img[data-src]'
        );


    images.forEach(
        img => {

            const url =
                img.getAttribute(
                    'data-src'
                );


            if (
                url &&
                (
                    url.startsWith(
                        'http://'
                    ) ||
                    url.startsWith(
                        'https://'
                    )
                )
            ) {

                img.src =
                    url;

            } else {

                img.src =
                    FALLBACK_IMAGE;

            }


            img.onerror =
                function () {

                    this.onerror =
                        null;

                    this.src =
                        FALLBACK_IMAGE;

                };

        }
    );
}


/* =========================================================
   QUICK ADD TO CART
   ========================================================= */

async function quickAddToCart(
    event,
    productId,
    button
) {

    event.preventDefault();


    if (
        !requireLogin(
            window.location.pathname
        )
    ) {

        return;

    }


    try {

        button.disabled =
            true;


        await apiRequest(
            '/cart/add',
            {
                method: 'POST',

                body: {
                    productId:
                        productId,

                    quantity:
                        1
                }
            }
        );


        showToast(
            'Added to cart.'
        );


        refreshNavBadges();


    } catch (error) {

        showToast(
            error.message,
            'error'
        );


    } finally {

        button.disabled =
            false;

    }
}


/* =========================================================
   QUICK WISHLIST TOGGLE
   ========================================================= */

async function quickToggleWishlist(
    event,
    productId,
    button
) {

    event.preventDefault();


    if (
        !requireLogin(
            window.location.pathname
        )
    ) {

        return;

    }


    const icon =
        button.querySelector(
            'i'
        );


    try {

        if (
            WISHLIST_IDS.has(
                Number(productId)
            )
        ) {

            const wishlist =
                await apiRequest(
                    '/wishlist'
                );


            const item =
                wishlist.find(
                    w =>
                        Number(
                            w.productId
                        ) ===
                        Number(
                            productId
                        )
                );


            if (item) {

                await apiRequest(
                    '/wishlist/remove/' +
                    item.wishlistId,
                    {
                        method: 'DELETE'
                    }
                );

            }


            WISHLIST_IDS.delete(
                Number(productId)
            );


            button.classList.remove(
                'active'
            );


            if (icon) {

                icon.className =
                    'bi bi-heart';

            }


            showToast(
                'Removed from wishlist.'
            );


        } else {

            await apiRequest(
                '/wishlist/add',
                {
                    method: 'POST',

                    body: {
                        productId:
                            productId
                    }
                }
            );


            WISHLIST_IDS.add(
                Number(productId)
            );


            button.classList.add(
                'active'
            );


            if (icon) {

                icon.className =
                    'bi bi-heart-fill';

            }


            showToast(
                'Added to wishlist.'
            );

        }


        refreshNavBadges();


    } catch (error) {

        showToast(
            error.message,
            'error'
        );

    }
}


/* =========================================================
   HOME PAGE
   LOAD CATEGORIES
   ========================================================= */

async function loadHomeCategories() {

    const row =
        document.getElementById(
            'homeCategoriesRow'
        );


    if (!row) {

        return;

    }


    try {

        const categories =
            await apiRequest(
                '/categories'
            );


        const topLevel =
            categories
                .filter(
                    category =>
                        !category.parentCategoryId
                )
                .slice(0, 6);


        if (
            topLevel.length === 0
        ) {

            row.innerHTML = `

                <div
                    class="
                        col-12
                        text-center
                        text-muted-se
                    ">

                    No categories yet.

                </div>

            `;

            return;

        }


        row.innerHTML =
            topLevel
                .map(
                    category => {

                        const image =
                            getCategoryImage(
                                category
                            );


                        return `

                            <div
                                class="
                                    col-6
                                    col-md-4
                                    col-lg-2
                                ">

                                <a
                                    href="
                                        products.html?categoryId=${
                                            category.categoryId
                                        }
                                    "
                                    class="
                                        se-category-tile
                                    ">

                                    <img
                                        src="${image}"
                                        alt="${
                                            escapeHtml(
                                                category.categoryName
                                            )
                                        }"
                                        loading="lazy"
                                        onerror="
                                            this.onerror=null;
                                            this.src='${FALLBACK_IMAGE}';
                                        ">


                                    <div
                                        class="
                                            fw-semibold
                                            small
                                        ">

                                        ${
                                            escapeHtml(
                                                category.categoryName
                                            )
                                        }

                                    </div>

                                </a>

                            </div>

                        `;

                    }
                )
                .join('');


    } catch (error) {

        console.error(
            'Home category loading error:',
            error
        );


        row.innerHTML = `

            <div
                class="
                    col-12
                    text-center
                    text-danger
                ">

                Could not load categories.

            </div>

        `;

    }
}


/* =========================================================
   FEATURED PRODUCTS
   ========================================================= */

async function loadFeaturedProducts() {

    const row =
        document.getElementById(
            'featuredProductsRow'
        );


    if (!row) {

        return;

    }


    await refreshWishlistIds();


    try {

        const products =
            await apiRequest(
                '/products?sortBy=newest'
            );


        renderProductGrid(
            row,
            products.slice(
                0,
                20
            )
        );


    } catch (error) {

        console.error(
            'Featured products error:',
            error
        );


        row.innerHTML = `

            <div
                class="
                    col-12
                    text-center
                    text-danger
                ">

                Could not load products.

            </div>

        `;

    }
}


/* =========================================================
   TRENDING PRODUCTS
   ========================================================= */

async function loadTrendingProducts() {

    const row =
        document.getElementById(
            'trendingProductsRow'
        );


    if (!row) {

        return;

    }


    await refreshWishlistIds();


    try {

        const products =
            await apiRequest(
                '/products/trending'
            );


        renderProductGrid(
            row,
            products.slice(
                0,
                20
            )
        );


    } catch (error) {

        console.error(
            'Trending products error:',
            error
        );


        row.innerHTML = `

            <div
                class="
                    col-12
                    text-center
                    text-danger
                ">

                Could not load products.

            </div>

        `;

    }
}


/* =========================================================
   PRODUCT GRID
   ========================================================= */

function renderProductGrid(
    container,
    products
) {

    if (!container) {

        return;

    }


    if (
        !products ||
        products.length === 0
    ) {

        container.innerHTML = `

            <div
                class="
                    se-empty-state
                    col-12
                ">

                <i class="bi bi-box-seam"></i>

                No products found.

            </div>

        `;

        return;

    }


    container.innerHTML =
        products
            .map(
                product =>
                    renderProductCard(
                        product
                    )
            )
            .join('');
}


/* =========================================================
   FIND CATEGORY ID THAT HAS PRODUCTS
   ========================================================= */

async function findWorkingCategoryId(
    categoryGroup
) {

    if (
        !categoryGroup ||
        categoryGroup.length === 0
    ) {

        return null;

    }


    for (
        const category
        of categoryGroup
    ) {

        try {

            const products =
                await apiRequest(
                    '/products?categoryId=' +
                    category.categoryId
                );


            if (
                Array.isArray(products) &&
                products.length > 0
            ) {

                return category.categoryId;

            }

        } catch (error) {

            console.log(
                'Category ID check failed:',
                category.categoryId,
                error
            );

        }

    }


    return categoryGroup[0].categoryId;
}


/* =========================================================
   LOAD ALL CATEGORIES PAGE
   ========================================================= */

async function loadAllCategoriesPage() {

    const container =
        document.getElementById(
            'allCategoriesGrid'
        );


    if (!container) {

        return;

    }


    container.innerHTML = `

        <div
            class="
                col-12
                text-center
                text-muted-se
                py-5
            ">

            Loading categories...

        </div>

    `;


    try {

        const categories =
            await apiRequest(
                '/categories'
            );


        console.log(
            'All categories from backend:',
            categories
        );


        if (
            !Array.isArray(categories) ||
            categories.length === 0
        ) {

            container.innerHTML = `

                <div
                    class="
                        col-12
                        text-center
                        py-5
                        text-muted-se
                    ">

                    No categories available.

                </div>

            `;

            return;

        }


        /* =================================================
           GROUP CATEGORIES BY NAME
           ================================================= */

        const categoryGroups =
            new Map();


        categories.forEach(
            category => {

                if (
                    !category ||
                    !category.categoryName ||
                    !category.categoryId
                ) {

                    return;

                }


                const key =
                    category.categoryName
                        .trim()
                        .toLowerCase();


                if (
                    !categoryGroups.has(
                        key
                    )
                ) {

                    categoryGroups.set(
                        key,
                        []
                    );

                }


                categoryGroups
                    .get(key)
                    .push(
                        category
                    );

            }
        );


        console.log(
            'Category groups:',
            categoryGroups
        );


        /* =================================================
           UNIQUE CATEGORIES
           ================================================= */

        const uniqueCategories =
            [];


        for (
            const [
                categoryName,
                group
            ]
            of categoryGroups
        ) {

            const workingCategoryId =
                await findWorkingCategoryId(
                    group
                );


            let selectedCategory =
                group.find(
                    category =>
                        Number(
                            category.categoryId
                        ) ===
                        Number(
                            workingCategoryId
                        )
                );


            if (!selectedCategory) {

                selectedCategory =
                    group[0];

            }


            uniqueCategories.push(
                selectedCategory
            );

        }


        if (
            uniqueCategories.length === 0
        ) {

            container.innerHTML = `

                <div
                    class="
                        col-12
                        text-center
                        py-5
                        text-muted-se
                    ">

                    No unique categories available.

                </div>

            `;

            return;

        }


        /* =================================================
           CATEGORY CARDS
           ================================================= */

        container.innerHTML =
            uniqueCategories
                .map(
                    category => {

                        const image =
                            getCategoryImage(
                                category
                            );


                        return `

                            <div
                                class="
                                    col-6
                                    col-md-4
                                    col-lg-3
                                    mb-4
                                ">

                                <a
                                    href="
                                        products.html?categoryId=${
                                            category.categoryId
                                        }
                                    "
                                    class="
                                        text-decoration-none
                                    ">

                                    <div
                                        class="
                                            se-product-card
                                            p-3
                                            h-100
                                        ">

                                        <div
                                            class="text-center">

                                            <img
                                                src="${image}"
                                                alt="${
                                                    escapeHtml(
                                                        category.categoryName
                                                    )
                                                }"
                                                loading="lazy"
                                                onerror="
                                                    this.onerror=null;
                                                    this.src='${FALLBACK_IMAGE}';
                                                "
                                                style="
                                                    width:140px;
                                                    height:140px;
                                                    object-fit:cover;
                                                    border-radius:12px;
                                                    margin-bottom:15px;
                                                ">


                                            <h5
                                                class="
                                                    mb-0
                                                    text-dark
                                                ">

                                                ${
                                                    escapeHtml(
                                                        category.categoryName
                                                    )
                                                }

                                            </h5>

                                        </div>

                                    </div>

                                </a>

                            </div>

                        `;

                    }
                )
                .join('');


    } catch (error) {

        console.error(
            'Category loading error:',
            error
        );


        container.innerHTML = `

            <div
                class="
                    col-12
                    text-center
                    py-5
                ">

                <div
                    class="text-danger">

                    Could not load categories.

                </div>


                <div
                    class="
                        small
                        text-muted-se
                        mt-2
                    ">

                    ${
                        escapeHtml(
                            error.message || ''
                        )
                    }

                </div>

            </div>

        `;

    }
}


/* =========================================================
   PRODUCTS PAGE
   ========================================================= */

async function loadProductsPage() {

    await refreshWishlistIds();


    const params =
        new URLSearchParams(
            window.location.search
        );


    /* -----------------------------------------
       KEYWORD
       ----------------------------------------- */

    const keyword =
        params.get(
            'keyword'
        );


    const keywordInput =
        document.getElementById(
            'filterKeyword'
        );


    if (
        keyword &&
        keywordInput
    ) {

        keywordInput.value =
            keyword;

    }


    /* -----------------------------------------
       CATEGORY
       ----------------------------------------- */

    const categoryId =
        params.get(
            'categoryId'
        );


    /* -----------------------------------------
       BRAND
       ----------------------------------------- */

    const brand =
        params.get(
            'brand'
        );


    const brandInput =
        document.getElementById(
            'filterBrand'
        );


    if (
        brand &&
        brandInput
    ) {

        brandInput.value =
            brand;

    }


    /* -----------------------------------------
       MIN PRICE
       ----------------------------------------- */

    const minPrice =
        params.get(
            'minPrice'
        );


    const minPriceInput =
        document.getElementById(
            'filterMinPrice'
        );


    if (
        minPrice &&
        minPriceInput
    ) {

        minPriceInput.value =
            minPrice;

    }


    /* -----------------------------------------
       MAX PRICE
       ----------------------------------------- */

    const maxPrice =
        params.get(
            'maxPrice'
        );


    const maxPriceInput =
        document.getElementById(
            'filterMaxPrice'
        );


    if (
        maxPrice &&
        maxPriceInput
    ) {

        maxPriceInput.value =
            maxPrice;

    }


    /* -----------------------------------------
       RATING
       ----------------------------------------- */

    const minRating =
        params.get(
            'minRating'
        );


    const ratingInput =
        document.getElementById(
            'filterMinRating'
        );


    if (
        minRating &&
        ratingInput
    ) {

        ratingInput.value =
            minRating;

    }


    /* -----------------------------------------
       SORT
       ----------------------------------------- */

    const sortBy =
        params.get(
            'sortBy'
        );


    const sortInput =
        document.getElementById(
            'filterSortBy'
        );


    if (
        sortBy &&
        sortInput
    ) {

        sortInput.value =
            sortBy;

    }


    /* -----------------------------------------
       LOAD CATEGORY DROPDOWN
       ----------------------------------------- */

    try {

        const categories =
            await apiRequest(
                '/categories'
            );


        const select =
            document.getElementById(
                'filterCategory'
            );


        if (select) {

            const categoryGroups =
                new Map();


            categories.forEach(
                category => {

                    if (
                        !category ||
                        !category.categoryName ||
                        !category.categoryId
                    ) {

                        return;

                    }


                    const name =
                        category.categoryName
                            .trim()
                            .toLowerCase();


                    if (
                        !categoryGroups.has(
                            name
                        )
                    ) {

                        categoryGroups.set(
                            name,
                            []
                        );

                    }


                    categoryGroups
                        .get(name)
                        .push(
                            category
                        );

                }
            );


            const uniqueCategories =
                [];


            for (
                const [
                    name,
                    group
                ]
                of categoryGroups
            ) {

                let selected =
                    null;


                if (categoryId) {

                    selected =
                        group.find(
                            category =>
                                Number(
                                    category.categoryId
                                ) ===
                                Number(
                                    categoryId
                                )
                        );

                }


                if (!selected) {

                    selected =
                        group[0];

                }


                uniqueCategories.push(
                    selected
                );

            }


            select.innerHTML =
                '<option value="">All Categories</option>' +

                uniqueCategories
                    .map(
                        category => `

                            <option
                                value="${
                                    category.categoryId
                                }">

                                ${
                                    escapeHtml(
                                        category.categoryName
                                    )
                                }

                            </option>

                        `
                    )
                    .join('');


            if (categoryId) {

                select.value =
                    categoryId;

            }

        }


    } catch (error) {

        console.error(
            'Category dropdown error:',
            error
        );

    }


    await runProductSearch();
}


/* =========================================================
   BUILD PRODUCT QUERY
   ========================================================= */

function buildProductQuery() {

    const query =
        new URLSearchParams();


    const keywordInput =
        document.getElementById(
            'filterKeyword'
        );


    const categoryInput =
        document.getElementById(
            'filterCategory'
        );


    const brandInput =
        document.getElementById(
            'filterBrand'
        );


    const minPriceInput =
        document.getElementById(
            'filterMinPrice'
        );


    const maxPriceInput =
        document.getElementById(
            'filterMaxPrice'
        );


    const ratingInput =
        document.getElementById(
            'filterMinRating'
        );


    const sortInput =
        document.getElementById(
            'filterSortBy'
        );


    const keyword =
        keywordInput
            ? keywordInput.value.trim()
            : '';


    const categoryId =
        categoryInput
            ? categoryInput.value
            : '';


    const brand =
        brandInput
            ? brandInput.value.trim()
            : '';


    const minPrice =
        minPriceInput
            ? minPriceInput.value
            : '';


    const maxPrice =
        maxPriceInput
            ? maxPriceInput.value
            : '';


    const minRating =
        ratingInput
            ? ratingInput.value
            : '';


    const sortBy =
        sortInput
            ? sortInput.value
            : '';


    const params =
        new URLSearchParams(
            window.location.search
        );


    const trending =
        params.get(
            'trending'
        );


    if (keyword) {

        query.set(
            'keyword',
            keyword
        );

    }


    if (categoryId) {

        query.set(
            'categoryId',
            categoryId
        );

    }


    if (brand) {

        query.set(
            'brand',
            brand
        );

    }


    if (minPrice) {

        query.set(
            'minPrice',
            minPrice
        );

    }


    if (maxPrice) {

        query.set(
            'maxPrice',
            maxPrice
        );

    }


    if (minRating) {

        query.set(
            'minRating',
            minRating
        );

    }


    if (sortBy) {

        query.set(
            'sortBy',
            sortBy
        );

    }


    if (trending) {

        query.set(
            'trending',
            trending
        );

    }


    return query;
}


/* =========================================================
   RUN PRODUCT SEARCH
   ========================================================= */

async function runProductSearch() {

    const grid =
        document.getElementById(
            'productsGrid'
        );


    const countLabel =
        document.getElementById(
            'resultsCount'
        );


    if (!grid) {

        return;

    }


    grid.innerHTML = `

        <div
            class="
                col-12
                text-center
                text-muted-se
                py-5
            ">

            Loading products...

        </div>

    `;


    try {

        const query =
            buildProductQuery();


        const queryString =
            query.toString();


        const url =
            queryString
                ? '/products?' +
                  queryString
                : '/products';


        console.log(
            'Product API URL:',
            url
        );


        const products =
            await apiRequest(
                url
            );


        console.log(
            'Products returned:',
            products
        );


        if (countLabel) {

            countLabel.textContent =
                products.length +
                (
                    products.length === 1
                        ? ' product found'
                        : ' products found'
                );

        }


        renderProductGrid(
            grid,
            products
        );


    } catch (error) {

        console.error(
            'Product search error:',
            error
        );


        grid.innerHTML = `

            <div
                class="
                    col-12
                    text-danger
                    text-center
                    py-5
                ">

                ${
                    escapeHtml(
                        error.message
                    )
                }

            </div>

        `;


        if (countLabel) {

            countLabel.textContent =
                '';

        }

    }
}


/* =========================================================
   APPLY FILTERS
   ========================================================= */

function applyFilters(event) {

    if (event) {

        event.preventDefault();

    }


    runProductSearch();


    return false;
}


/* =========================================================
   RESET FILTERS
   ========================================================= */

function resetFilters() {

    const form =
        document.getElementById(
            'filtersForm'
        );


    if (form) {

        form.reset();

    }


    window.history.replaceState(
        {},
        '',
        'products.html'
    );


    runProductSearch();
}


/* =========================================================
   PRODUCT DETAIL
   ========================================================= */

async function loadProductDetail() {

    await refreshWishlistIds();


    const params =
        new URLSearchParams(
            window.location.search
        );


    const id =
        params.get(
            'id'
        );


    const container =
        document.getElementById(
            'productDetailRoot'
        );


    if (!container) {

        return;

    }


    if (!id) {

        container.innerHTML = `

            <p class="text-danger">

                No product specified.

            </p>

        `;

        return;

    }


    try {

        const product =
            await apiRequest(
                '/products/' +
                id
            );


        CURRENT_PRODUCT =
            product;


        document.title =
            product.productName +
            ' - ShopEase';


        const hasDiscount =
            product.discountPrice !== null &&
            product.discountPrice !== undefined &&
            Number(
                product.discountPrice
            ) <
            Number(
                product.price
            );


        const displayPrice =
            hasDiscount
                ? product.discountPrice
                : product.price;


        const discountPercentage =
            hasDiscount
                ? Math.round(
                    (
                        1 -
                        Number(
                            product.discountPrice
                        ) /
                        Number(
                            product.price
                        )
                    ) * 100
                )
                : 0;


        const isWishlisted =
            WISHLIST_IDS.has(
                Number(
                    product.productId
                )
            );


        const outOfStock =
            Number(
                product.stockQty
            ) <= 0;


        const imageUrl =
            getProductImage(
                product.imageUrl
            );


        const relatedImageUrl =
            getRelatedProductImage(
                product
            );


        container.innerHTML = `

            <div class="col-md-5">

                <div
                    class="se-product-img-wrap"
                    style="
                        border-radius:12px;
                    ">

                    <img
                        src="${imageUrl}"
                        alt="${escapeHtml(
                            product.productName
                        )}"
                        style="
                            width:100%;
                        "
                        loading="lazy"
                        onerror="
                            this.onerror=null;
                            this.src='${relatedImageUrl}';
                        ">

                </div>

            </div>


            <div class="col-md-7">


                <!-- CATEGORY -->

                <nav
                    class="
                        small
                        text-muted-se
                        mb-2
                    ">

                    <a
                        href="
                            products.html?categoryId=${
                                product.categoryId
                            }
                        ">

                        ${
                            escapeHtml(
                                product.categoryName || ''
                            )
                        }

                    </a>

                </nav>


                <!-- PRODUCT NAME -->

                <h2>

                    ${
                        escapeHtml(
                            product.productName
                        )
                    }

                </h2>


                <!-- BRAND -->

                ${
                    product.brand
                        ? `

                            <p
                                class="
                                    text-muted-se
                                ">

                                ${
                                    escapeHtml(
                                        product.brand
                                    )
                                }

                            </p>

                          `
                        : ''
                }


                <!-- RATING -->

                <span
                    class="
                        se-rating-badge
                        mb-2
                        d-inline-flex
                    ">

                    <i
                        class="bi bi-star-fill"
                        style="
                            font-size:0.65rem;
                        ">
                    </i>

                    ${Number(
                        product.rating || 0
                    ).toFixed(1)}

                </span>


                <!-- PRICE -->

                <div
                    class="
                        se-price-row
                        my-3
                    ">

                    <span
                        class="
                            se-price-current
                            fs-3
                        ">

                        ${
                            formatCurrency(
                                displayPrice
                            )
                        }

                    </span>


                    ${
                        hasDiscount
                            ? `

                                <span
                                    class="
                                        se-price-original
                                        fs-6
                                    ">

                                    ${
                                        formatCurrency(
                                            product.price
                                        )
                                    }

                                </span>


                                <span
                                    class="
                                        se-price-discount
                                    ">

                                    ${
                                        discountPercentage
                                    }% off

                                </span>

                              `
                            : ''
                    }

                </div>


                <!-- DESCRIPTION -->

                <p>

                    ${
                        escapeHtml(
                            product.description || ''
                        )
                    }

                </p>


                <!-- STOCK -->

                <p
                    class="${
                        outOfStock
                            ? 'text-danger'
                            : 'text-success'
                    } fw-semibold">

                    ${
                        outOfStock
                            ? 'Out of stock'
                            : product.stockQty +
                              ' units in stock'
                    }

                </p>


                <!-- ACTIONS -->

                <div
                    class="
                        d-flex
                        align-items-center
                        gap-3
                        my-3
                    ">


                    <!-- QUANTITY -->

                    <div
                        class="
                            se-qty-control
                        ">

                        <button
                            type="button"
                            onclick="
                                changeDetailQty(
                                    -1
                                )
                            ">

                            −

                        </button>


                        <span
                            id="detailQty">

                            1

                        </span>


                        <button
                            type="button"
                            onclick="
                                changeDetailQty(
                                    1
                                )
                            ">

                            +

                        </button>

                    </div>


                    <!-- ADD CART -->

                    <button
                        type="button"
                        class="
                            btn
                            btn-se-primary
                        "
                        ${
                            outOfStock
                                ? 'disabled'
                                : ''
                        }
                        onclick="
                            addDetailToCart()
                        ">

                        <i
                            class="
                                bi
                                bi-cart-plus
                                me-1
                            ">
                        </i>

                        Add to Cart

                    </button>


                    <!-- WISHLIST -->

                    <button
                        type="button"
                        class="
                            btn
                            btn-se-outline
                        "
                        onclick="
                            toggleDetailWishlist(
                                this
                            )
                        ">

                        <i
                            class="bi ${
                                isWishlisted
                                    ? 'bi-heart-fill text-danger'
                                    : 'bi-heart'
                            }">
                        </i>

                    </button>


                </div>


            </div>

        `;


        await loadReviews(
            product.productId
        );


    } catch (error) {

        console.error(
            'Product detail error:',
            error
        );


        container.innerHTML = `

            <p class="text-danger">

                ${
                    escapeHtml(
                        error.message
                    )
                }

            </p>

        `;

    }
}


/* =========================================================
   DETAIL QUANTITY
   ========================================================= */

function changeDetailQty(
    delta
) {

    const element =
        document.getElementById(
            'detailQty'
        );


    if (!element) {

        return;

    }


    let quantity =
        parseInt(
            element.textContent,
            10
        ) + delta;


    if (quantity < 1) {

        quantity = 1;

    }


    if (
        CURRENT_PRODUCT &&
        quantity >
        Number(
            CURRENT_PRODUCT.stockQty
        )
    ) {

        quantity =
            Number(
                CURRENT_PRODUCT.stockQty
            );

    }


    element.textContent =
        quantity;
}


/* =========================================================
   DETAIL ADD TO CART
   ========================================================= */

async function addDetailToCart() {

    if (
        !requireLogin(
            window.location.pathname +
            window.location.search
        )
    ) {

        return;

    }


    if (!CURRENT_PRODUCT) {

        showToast(
            'Product information is not available.',
            'error'
        );

        return;

    }


    const quantityElement =
        document.getElementById(
            'detailQty'
        );


    const quantity =
        quantityElement
            ? parseInt(
                quantityElement.textContent,
                10
            )
            : 1;


    try {

        await apiRequest(
            '/cart/add',
            {
                method: 'POST',

                body: {

                    productId:
                        CURRENT_PRODUCT.productId,

                    quantity:
                        quantity

                }

            }
        );


        showToast(
            'Added to cart.'
        );


        refreshNavBadges();


    } catch (error) {

        showToast(
            error.message,
            'error'
        );

    }
}


/* =========================================================
   DETAIL WISHLIST
   ========================================================= */

async function toggleDetailWishlist(
    button
) {

    if (
        !requireLogin(
            window.location.pathname +
            window.location.search
        )
    ) {

        return;

    }


    if (!CURRENT_PRODUCT) {

        return;

    }


    const productId =
        Number(
            CURRENT_PRODUCT.productId
        );


    const icon =
        button.querySelector(
            'i'
        );


    try {

        if (
            WISHLIST_IDS.has(
                productId
            )
        ) {

            const wishlist =
                await apiRequest(
                    '/wishlist'
                );


            const item =
                wishlist.find(
                    w =>
                        Number(
                            w.productId
                        ) ===
                        productId
                );


            if (item) {

                await apiRequest(
                    '/wishlist/remove/' +
                    item.wishlistId,
                    {
                        method: 'DELETE'
                    }
                );

            }


            WISHLIST_IDS.delete(
                productId
            );


            if (icon) {

                icon.className =
                    'bi bi-heart';

            }


            showToast(
                'Removed from wishlist.'
            );


        } else {

            await apiRequest(
                '/wishlist/add',
                {
                    method: 'POST',

                    body: {

                        productId:
                            productId

                    }

                }
            );


            WISHLIST_IDS.add(
                productId
            );


            if (icon) {

                icon.className =
                    'bi bi-heart-fill text-danger';

            }


            showToast(
                'Added to wishlist.'
            );

        }


        refreshNavBadges();


    } catch (error) {

        showToast(
            error.message,
            'error'
        );

    }
}


/* =========================================================
   LOAD REVIEWS
   ========================================================= */

async function loadReviews(
    productId
) {

    const list =
        document.getElementById(
            'reviewsList'
        );


    if (!list) {

        return;

    }


    try {

        const reviews =
            await apiRequest(
                '/reviews/product/' +
                productId
            );


        if (
            !reviews ||
            reviews.length === 0
        ) {

            list.innerHTML = `

                <p
                    class="text-muted-se">

                    No reviews yet.
                    Be the first to review
                    this product!

                </p>

            `;

        } else {

            list.innerHTML =
                reviews
                    .map(
                        renderReview
                    )
                    .join('');

        }


    } catch (error) {

        console.error(
            'Reviews loading error:',
            error
        );


        list.innerHTML = `

            <p class="text-danger">

                ${
                    escapeHtml(
                        error.message
                    )
                }

            </p>

        `;

    }


    const formWrap =
        document.getElementById(
            'reviewFormWrap'
        );


    if (formWrap) {

        formWrap.classList.toggle(
            'd-none',
            !isLoggedIn()
        );

    }
}


/* =========================================================
   RENDER REVIEW
   ========================================================= */

function renderReview(
    review
) {

    const isMine =
        isLoggedIn() &&
        Number(
            CURRENT_USER.userId
        ) ===
        Number(
            review.userId
        );


    const rating =
        Number(
            review.rating || 0
        );


    const filledStars =
        '<i class="bi bi-star-fill text-warning"></i>'
            .repeat(
                rating
            );


    const emptyStars =
        '<i class="bi bi-star text-warning"></i>'
            .repeat(
                Math.max(
                    0,
                    5 - rating
                )
            );


    return `

        <div
            class="
                se-line-item
                mb-2
            "
            style="
                align-items:flex-start;
            "
            id="review-${review.reviewId}">

            <div
                class="flex-grow-1">


                <!-- USER + DATE -->

                <div
                    class="
                        d-flex
                        justify-content-between
                    ">

                    <strong>

                        ${
                            escapeHtml(
                                review.userName || ''
                            )
                        }

                    </strong>


                    <span
                        class="
                            small
                            text-muted-se
                        ">

                        ${
                            formatDate(
                                review.createdAt
                            )
                        }

                    </span>

                </div>


                <!-- STARS -->

                <div class="mb-1">

                    ${filledStars}

                    ${emptyStars}

                </div>


                <!-- COMMENT -->

                <p
                    class="mb-1"
                    id="
                        review-comment-${review.reviewId}
                    ">

                    ${
                        escapeHtml(
                            review.comment || ''
                        )
                    }

                </p>


                ${
                    isMine
                        ? `

                            <div
                                class="
                                    d-flex
                                    gap-2
                                ">

                                <button
                                    type="button"
                                    class="
                                        btn
                                        btn-sm
                                        btn-se-outline
                                    "
                                    onclick="
                                        startEditReview(
                                            ${review.reviewId},
                                            ${rating}
                                        )
                                    ">

                                    Edit

                                </button>


                                <button
                                    type="button"
                                    class="
                                        btn
                                        btn-sm
                                        btn-se-ghost-danger
                                    "
                                    onclick="
                                        deleteReview(
                                            ${review.reviewId},
                                            ${CURRENT_PRODUCT.productId}
                                        )
                                    ">

                                    Delete

                                </button>

                            </div>

                          `
                        : ''
                }

            </div>

        </div>

    `;

}


/* =========================================================
   SUBMIT REVIEW
   ========================================================= */

async function submitReviewForm(
    event
) {

    event.preventDefault();


    if (!CURRENT_PRODUCT) {

        return false;

    }


    const ratingElement =
        document.getElementById(
            'reviewRatingInput'
        );


    const commentElement =
        document.getElementById(
            'reviewCommentInput'
        );


    const rating =
        ratingElement
            ? parseInt(
                ratingElement.value,
                10
            )
            : 5;


    const comment =
        commentElement
            ? commentElement.value.trim()
            : '';


    try {

        await apiRequest(
            '/reviews',
            {
                method: 'POST',

                body: {

                    productId:
                        CURRENT_PRODUCT.productId,

                    rating:
                        rating,

                    comment:
                        comment

                }

            }
        );


        showToast(
            'Review submitted.'
        );


        if (commentElement) {

            commentElement.value =
                '';

        }


        await loadReviews(
            CURRENT_PRODUCT.productId
        );


        await loadProductDetail();


    } catch (error) {

        showToast(
            error.message,
            'error'
        );

    }


    return false;
}


/* =========================================================
   START EDIT REVIEW
   ========================================================= */

function startEditReview(
    reviewId,
    currentRating
) {

    const commentElement =
        document.getElementById(
            'review-comment-' +
            reviewId
        );


    if (!commentElement) {

        return;

    }


    const parent =
        commentElement.parentElement;


    const currentComment =
        commentElement.textContent.trim();


    const oldButtons =
        parent.querySelector(
            '.d-flex.gap-2'
        );


    if (oldButtons) {

        oldButtons.remove();

    }


    const editBox =
        document.createElement(
            'div'
        );


    editBox.innerHTML = `

        <select
            class="
                form-select
                form-select-sm
                mb-2
            "
            style="
                width:120px;
            "
            id="
                editRating-${reviewId}
            ">

            ${
                [5, 4, 3, 2, 1]
                    .map(
                        number => `

                            <option
                                value="${number}"
                                ${
                                    number ===
                                    Number(
                                        currentRating
                                    )
                                        ? 'selected'
                                        : ''
                                }>

                                ${number}

                                Star${
                                    number > 1
                                        ? 's'
                                        : ''
                                }

                            </option>

                        `
                    )
                    .join('')
            }

        </select>


        <textarea
            class="
                form-control
                form-control-sm
                mb-2
            "
            id="
                editComment-${reviewId}
            ">${escapeHtml(
                currentComment
            )}</textarea>


        <button
            type="button"
            class="
                btn
                btn-sm
                btn-se-primary
            "
            onclick="
                saveEditReview(
                    ${reviewId}
                )
            ">

            Save

        </button>


        <button
            type="button"
            class="
                btn
                btn-sm
                btn-outline-secondary
            "
            onclick="
                loadReviews(
                    CURRENT_PRODUCT.productId
                )
            ">

            Cancel

        </button>

    `;


    parent.appendChild(
        editBox
    );
}


/* =========================================================
   SAVE EDIT REVIEW
   ========================================================= */

async function saveEditReview(
    reviewId
) {

    const ratingElement =
        document.getElementById(
            'editRating-' +
            reviewId
        );


    const commentElement =
        document.getElementById(
            'editComment-' +
            reviewId
        );


    const rating =
        ratingElement
            ? parseInt(
                ratingElement.value,
                10
            )
            : 5;


    const comment =
        commentElement
            ? commentElement.value.trim()
            : '';


    try {

        await apiRequest(
            '/reviews/' +
            reviewId,
            {
                method: 'PUT',

                body: {

                    rating:
                        rating,

                    comment:
                        comment

                }

            }
        );


        showToast(
            'Review updated.'
        );


        await loadReviews(
            CURRENT_PRODUCT.productId
        );


        await loadProductDetail();


    } catch (error) {

        showToast(
            error.message,
            'error'
        );

    }
}


/* =========================================================
   DELETE REVIEW
   ========================================================= */

async function deleteReview(
    reviewId,
    productId
) {

    if (
        !confirm(
            'Delete this review?'
        )
    ) {

        return;

    }


    try {

        await apiRequest(
            '/reviews/' +
            reviewId,
            {
                method: 'DELETE'
            }
        );


        showToast(
            'Review deleted.'
        );


        await loadReviews(
            productId
        );


        await loadProductDetail();


    } catch (error) {

        showToast(
            error.message,
            'error'
        );

    }
}