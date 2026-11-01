/* =========================================================
   ShopEase - order.js
   ========================================================= */

const ORDER_TRACK_STEPS = ['PENDING', 'CONFIRMED', 'SHIPPED', 'DELIVERED'];

async function loadOrderHistory() {
  const list = document.getElementById('ordersList');
  try {
    const orders = await apiRequest('/orders');
    if (orders.length === 0) {
      list.innerHTML = `<div class="se-empty-state"><i class="bi bi-bag-x"></i>You haven't placed any orders yet.<br><a href="products.html" class="btn btn-se-primary btn-sm mt-3">Start Shopping</a></div>`;
      return;
    }
    list.innerHTML = orders.map(renderOrderSummaryCard).join('');
  } catch (err) {
    list.innerHTML = `<div class="text-danger text-center py-5">${err.message}</div>`;
  }
}

function renderOrderSummaryCard(order) {
  const itemsPreview = order.items.slice(0, 3).map(i => `<img src="${i.imageUrl}" onerror="this.src='${FALLBACK_IMAGE}'" style="width:44px;height:44px;object-fit:cover;border-radius:6px;margin-right:6px;">`).join('');
  return `
  <div class="se-summary-card mb-3">
    <div class="d-flex justify-content-between align-items-start flex-wrap gap-2">
      <div>
        <div class="d-flex align-items-center gap-2 mb-1">
          <strong>Order #${order.orderId}</strong>
          <span class="se-status se-status-${order.status}">${order.status}</span>
        </div>
        <div class="small text-muted-se">Placed on ${formatDate(order.orderDate)} • ${order.paymentMode}</div>
        <div class="mt-2">${itemsPreview}</div>
      </div>
      <div class="text-end">
        <div class="fw-bold mb-2">${formatCurrency(order.totalAmount)}</div>
        <a href="order-details.html?id=${order.orderId}" class="btn btn-se-outline btn-sm">View Details</a>
        ${order.cancellable ? `<button class="btn btn-se-ghost-danger btn-sm ms-1" onclick="cancelOrderFromList(${order.orderId})">Cancel</button>` : ''}
      </div>
    </div>
  </div>`;
}

async function cancelOrderFromList(orderId) {
  if (!confirm('Cancel this order?')) return;
  try {
    await apiRequest('/orders/' + orderId + '/cancel', { method: 'PUT' });
    showToast('Order cancelled.');
    loadOrderHistory();
  } catch (err) {
    showToast(err.message, 'error');
  }
}

async function loadOrderDetail() {
  const id = new URLSearchParams(window.location.search).get('id');
  const root = document.getElementById('orderDetailRoot');
  if (!id) { root.innerHTML = '<p class="text-danger">No order specified.</p>'; return; }

  try {
    const order = await apiRequest('/orders/' + id);
    let paymentInfo = null;
    try {
      const payments = await apiRequest('/payments/order/' + id);
      paymentInfo = payments[payments.length - 1] || null;
    } catch (e) { /* payment lookup is best-effort */ }

    root.innerHTML = `
      <div class="se-summary-card mb-3">
        <div class="d-flex justify-content-between align-items-start flex-wrap gap-2 mb-3">
          <div>
            <h5 class="mb-1">Order #${order.orderId}</h5>
            <div class="small text-muted-se">Placed on ${formatDate(order.orderDate)}</div>
          </div>
          <span class="se-status se-status-${order.status}">${order.status}</span>
        </div>

        ${renderTracker(order.status)}

        ${order.cancellable ? `<button class="btn btn-se-ghost-danger btn-sm mt-3" onclick="cancelOrderFromDetail(${order.orderId})">Cancel Order</button>` : ''}
      </div>

      <div class="row g-3 mb-3">
        <div class="col-md-6">
          <div class="se-summary-card h-100">
            <h6>Shipping Address</h6>
            <p class="small mb-0">${escapeHtml(order.shippingAddress)}</p>
          </div>
        </div>
        <div class="col-md-6">
          <div class="se-summary-card h-100">
            <h6>Payment</h6>
            <p class="small mb-1">Method: ${order.paymentMode}</p>
            <p class="small mb-0">Status: <span class="fw-semibold">${paymentInfo ? paymentInfo.paymentStatus : 'N/A'}</span></p>
          </div>
        </div>
      </div>

      <div class="se-summary-card">
        <h6 class="mb-3">Items</h6>
        ${order.items.map(item => `
          <div class="se-line-item mb-2">
            <img src="${item.imageUrl}" onerror="this.src='${FALLBACK_IMAGE}'" alt="${escapeHtml(item.productName)}">
            <div class="flex-grow-1">
              <div class="fw-semibold">${escapeHtml(item.productName)}</div>
              <div class="small text-muted-se">Qty: ${item.quantity} × ${formatCurrency(item.priceAtPurchase)}</div>
            </div>
            <div class="fw-bold">${formatCurrency(item.itemTotal)}</div>
          </div>`).join('')}
        <div class="se-summary-total mt-3"><span>Total</span><span>${formatCurrency(order.totalAmount)}</span></div>
      </div>`;
  } catch (err) {
    root.innerHTML = `<p class="text-danger">${err.message}</p>`;
  }
}

function renderTracker(status) {
  if (status === 'CANCELLED') {
    return '<div class="alert alert-danger mb-0">This order was cancelled.</div>';
  }
  const currentIndex = ORDER_TRACK_STEPS.indexOf(status);
  return `
    <div class="d-flex justify-content-between">
      ${ORDER_TRACK_STEPS.map((step, idx) => `
        <div class="text-center flex-fill">
          <div class="mx-auto mb-1 rounded-circle d-flex align-items-center justify-content-center"
               style="width:32px;height:32px;background:${idx <= currentIndex ? 'var(--se-primary)' : 'var(--se-border)'};color:#fff;">
            <i class="bi ${idx <= currentIndex ? 'bi-check-lg' : ''}"></i>
          </div>
          <div class="small ${idx <= currentIndex ? 'fw-semibold' : 'text-muted-se'}">${step}</div>
        </div>`).join('')}
    </div>`;
}

async function cancelOrderFromDetail(orderId) {
  if (!confirm('Cancel this order?')) return;
  try {
    await apiRequest('/orders/' + orderId + '/cancel', { method: 'PUT' });
    showToast('Order cancelled.');
    loadOrderDetail();
  } catch (err) {
    showToast(err.message, 'error');
  }
}
