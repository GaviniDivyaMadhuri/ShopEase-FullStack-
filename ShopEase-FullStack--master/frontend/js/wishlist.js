/* =========================================================
   ShopEase - wishlist.js
   ========================================================= */

async function loadWishlist() {
  const grid = document.getElementById('wishlistGrid');
  try {
    const items = await apiRequest('/wishlist');
    if (items.length === 0) {
      grid.innerHTML = `<div class="se-empty-state col-12"><i class="bi bi-heart"></i>Your wishlist is empty.<br><a href="products.html" class="btn btn-se-primary btn-sm mt-3">Browse Products</a></div>`;
      return;
    }
    grid.innerHTML = items.map(renderWishlistCard).join('');
    grid.querySelectorAll('img[data-src]').forEach(img => { img.src = img.getAttribute('data-src'); withImageFallback(img); });
  } catch (err) {
    grid.innerHTML = `<div class="text-danger text-center py-5">${err.message}</div>`;
  }
}

function renderWishlistCard(item) {
  const hasDiscount = item.discountPrice !== null && item.discountPrice !== undefined && Number(item.discountPrice) < Number(item.price);
  const displayPrice = hasDiscount ? item.discountPrice : item.price;
  const outOfStock = item.stockQty <= 0;
  return `
  <div class="col-6 col-md-4 col-lg-3">
    <div class="se-product-card">
      <a href="product-detail.html?id=${item.productId}" class="se-product-img-wrap">
        <img data-src="${item.imageUrl}" alt="${escapeHtml(item.productName)}">
      </a>
      <div class="se-product-body">
        <a href="product-detail.html?id=${item.productId}" class="se-product-title text-decoration-none">${escapeHtml(item.productName)}</a>
        <div class="se-price-row"><span class="se-price-current">${formatCurrency(displayPrice)}</span></div>
        ${outOfStock ? '<div class="small text-danger mb-2">Out of stock</div>' : ''}
        <button class="btn btn-se-primary btn-sm mt-2 w-100" ${outOfStock ? 'disabled' : ''} onclick="moveWishlistItemToCart(${item.wishlistId})">
          <i class="bi bi-cart-plus me-1"></i>Move to Cart
        </button>
        <button class="btn btn-se-ghost-danger btn-sm mt-2 w-100" onclick="removeWishlistItem(${item.wishlistId})">
          <i class="bi bi-trash me-1"></i>Remove
        </button>
      </div>
    </div>
  </div>`;
}

async function moveWishlistItemToCart(wishlistId) {
  try {
    await apiRequest('/wishlist/move-to-cart/' + wishlistId, { method: 'POST' });
    showToast('Moved to cart.');
    loadWishlist();
    refreshNavBadges();
  } catch (err) {
    showToast(err.message, 'error');
  }
}

async function removeWishlistItem(wishlistId) {
  try {
    await apiRequest('/wishlist/remove/' + wishlistId, { method: 'DELETE' });
    showToast('Removed from wishlist.');
    loadWishlist();
    refreshNavBadges();
  } catch (err) {
    showToast(err.message, 'error');
  }
}
