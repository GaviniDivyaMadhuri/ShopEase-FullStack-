/* =========================================================
   ShopEase - cart.js
   ========================================================= */

async function loadCart() {
  const list = document.getElementById('cartItemsList');
  const checkoutBtn = document.getElementById('checkoutBtn');
  const clearBtn = document.getElementById('clearCartBtn');
  try {
    const cart = await apiRequest('/cart');
    if (cart.items.length === 0) {
      list.innerHTML = `<div class="se-empty-state"><i class="bi bi-cart-x"></i>Your cart is empty.<br><a href="products.html" class="btn btn-se-primary btn-sm mt-3">Start Shopping</a></div>`;
      checkoutBtn.disabled = true;
      clearBtn.disabled = true;
    } else {
      list.innerHTML = cart.items.map(renderCartItem).join('');
      checkoutBtn.disabled = false;
      clearBtn.disabled = false;
      list.querySelectorAll('img[data-src]').forEach(img => { img.src = img.getAttribute('data-src'); withImageFallback(img); });
    }
    document.getElementById('summarySubtotal').textContent = formatCurrency(cart.subtotal);
    document.getElementById('summaryDelivery').textContent = cart.deliveryCharge > 0 ? formatCurrency(cart.deliveryCharge) : 'FREE';
    document.getElementById('summaryTotal').textContent = formatCurrency(cart.total);
    refreshNavBadges();
  } catch (err) {
    list.innerHTML = `<div class="text-danger text-center py-5">${err.message}</div>`;
  }
}

function renderCartItem(item) {
  const atMaxStock = item.quantity >= item.stockQty;
  return `
  <div class="se-line-item mb-3" id="cart-item-${item.cartId}">
    <img data-src="${item.imageUrl}" alt="${escapeHtml(item.productName)}">
    <div class="flex-grow-1">
      <div class="fw-semibold">${escapeHtml(item.productName)}</div>
      <div class="small text-muted-se">${formatCurrency(item.discountPrice || item.price)} each</div>
      <div class="se-qty-control mt-2">
        <button onclick="updateCartQty(${item.cartId}, ${item.quantity - 1}, ${item.stockQty})" ${item.quantity <= 1 ? 'disabled' : ''}>−</button>
        <span>${item.quantity}</span>
        <button onclick="updateCartQty(${item.cartId}, ${item.quantity + 1}, ${item.stockQty})" ${atMaxStock ? 'disabled' : ''}>+</button>
      </div>
      ${atMaxStock ? '<div class="small text-danger mt-1">Max stock reached</div>' : ''}
    </div>
    <div class="text-end">
      <div class="fw-bold mb-2">${formatCurrency(item.itemTotal)}</div>
      <button class="btn btn-sm btn-se-ghost-danger" onclick="removeCartItem(${item.cartId})"><i class="bi bi-trash"></i></button>
    </div>
  </div>`;
}

async function updateCartQty(cartId, newQty, stockQty) {
  if (newQty < 1) return;
  if (newQty > stockQty) { showToast('Only ' + stockQty + ' unit(s) available in stock.', 'error'); return; }
  try {
    await apiRequest('/cart/update', { method: 'PUT', body: { cartId, quantity: newQty } });
    loadCart();
  } catch (err) {
    showToast(err.message, 'error');
  }
}

async function removeCartItem(cartId) {
  try {
    await apiRequest('/cart/remove/' + cartId, { method: 'DELETE' });
    showToast('Item removed from cart.');
    loadCart();
  } catch (err) {
    showToast(err.message, 'error');
  }
}

async function clearCartHandler() {
  if (!confirm('Remove all items from your cart?')) return;
  try {
    await apiRequest('/cart/clear', { method: 'DELETE' });
    showToast('Cart cleared.');
    loadCart();
  } catch (err) {
    showToast(err.message, 'error');
  }
}
