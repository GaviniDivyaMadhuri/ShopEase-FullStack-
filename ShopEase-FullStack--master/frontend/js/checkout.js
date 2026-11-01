/* =========================================================
   ShopEase - checkout.js
   ========================================================= */

let SELECTED_ADDRESS_ID = null;

async function loadCheckout() {
  try {
    const cart = await apiRequest('/cart');
    if (cart.items.length === 0) {
      showToast('Your cart is empty.', 'error');
      setTimeout(() => { window.location.href = 'cart.html'; }, 1000);
      return;
    }
    renderCheckoutItems(cart);
    await loadCheckoutAddresses();
  } catch (err) {
    showToast(err.message, 'error');
  }
}

function renderCheckoutItems(cart) {
  const list = document.getElementById('checkoutItemsList');
  list.innerHTML = cart.items.map(item => `
    <div class="se-line-item mb-2">
      <img data-src="${item.imageUrl}" alt="${escapeHtml(item.productName)}">
      <div class="flex-grow-1">
        <div class="fw-semibold">${escapeHtml(item.productName)}</div>
        <div class="small text-muted-se">Qty: ${item.quantity}</div>
      </div>
      <div class="fw-bold">${formatCurrency(item.itemTotal)}</div>
    </div>`).join('');
  list.querySelectorAll('img[data-src]').forEach(img => { img.src = img.getAttribute('data-src'); withImageFallback(img); });

  document.getElementById('coSubtotal').textContent = formatCurrency(cart.subtotal);
  document.getElementById('coDelivery').textContent = cart.deliveryCharge > 0 ? formatCurrency(cart.deliveryCharge) : 'FREE';
  document.getElementById('coTotal').textContent = formatCurrency(cart.total);
}

async function loadCheckoutAddresses() {
  const list = document.getElementById('checkoutAddressList');
  try {
    const addresses = await apiRequest('/addresses');
    if (addresses.length === 0) {
      list.innerHTML = '<p class="text-muted-se small mb-0">No saved addresses. Add one below to continue.</p>';
      document.getElementById('placeOrderBtn').disabled = true;
      return;
    }
    const defaultAddr = addresses.find(a => a.defaultAddress) || addresses[0];
    SELECTED_ADDRESS_ID = defaultAddr.addressId;
    list.innerHTML = addresses.map(a => `
      <div class="form-check border rounded p-2 mb-2">
        <input class="form-check-input" type="radio" name="checkoutAddress" id="addr-${a.addressId}"
               value="${a.addressId}" ${a.addressId === SELECTED_ADDRESS_ID ? 'checked' : ''}
               onchange="SELECTED_ADDRESS_ID = ${a.addressId}">
        <label class="form-check-label w-100" for="addr-${a.addressId}">
          <strong>${escapeHtml(a.fullName)}</strong> ${a.defaultAddress ? '<span class="badge text-bg-success">Default</span>' : ''}<br>
          <span class="small text-muted-se">${escapeHtml(a.address)}, ${escapeHtml(a.city)}, ${escapeHtml(a.state)} - ${escapeHtml(a.pincode)} | ${escapeHtml(a.phoneNumber)}</span>
        </label>
      </div>`).join('');
    document.getElementById('placeOrderBtn').disabled = false;
  } catch (err) {
    list.innerHTML = `<p class="text-danger small">${err.message}</p>`;
  }
}

function openCheckoutAddressForm() {
  document.getElementById('checkoutAddressForm').classList.remove('d-none');
}

async function saveCheckoutAddress(e) {
  e.preventDefault();
  const payload = {
    fullName: document.getElementById('coFullName').value.trim(),
    phoneNumber: document.getElementById('coPhone').value.trim(),
    address: document.getElementById('coAddress').value.trim(),
    city: document.getElementById('coCity').value.trim(),
    state: document.getElementById('coState').value.trim(),
    pincode: document.getElementById('coPincode').value.trim(),
    defaultAddress: false
  };
  try {
    await apiRequest('/addresses', { method: 'POST', body: payload });
    showToast('Address added.');
    document.getElementById('checkoutAddressForm').classList.add('d-none');
    document.getElementById('checkoutAddressForm').reset();
    loadCheckoutAddresses();
  } catch (err) {
    showToast(err.message, 'error');
  }
  return false;
}

async function placeOrder() {
  if (!SELECTED_ADDRESS_ID) {
    showToast('Please select or add a shipping address.', 'error');
    return;
  }
  const paymentMode = document.querySelector('input[name="paymentMode"]:checked').value;
  const btn = document.getElementById('placeOrderBtn');
  btn.disabled = true;
  btn.textContent = 'Placing order...';

  try {
    const order = await apiRequest('/orders', {
      method: 'POST',
      body: { addressId: SELECTED_ADDRESS_ID, paymentMode }
    });

    // Simulate the payment for this order (demo only)
    await apiRequest('/payments', {
      method: 'POST',
      body: { orderId: order.orderId, paymentMethod: paymentMode }
    });

    refreshNavBadges();
    window.location.href = 'order-success.html?orderId=' + order.orderId;
  } catch (err) {
    showToast(err.message, 'error');
    btn.disabled = false;
    btn.textContent = 'Place Order';
  }
}
