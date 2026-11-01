/* =========================================================
   ShopEase - admin.js
   Shared sidebar + logic for all admin/*.html pages.
   ========================================================= */

function renderAdminSidebar(active) {
  const root = document.getElementById('adminSidebar');
  if (!root) return;
  const links = [
    { key: 'dashboard', label: 'Dashboard', icon: 'bi-speedometer2', href: 'admin-dashboard.html' },
    { key: 'products', label: 'Products', icon: 'bi-box-seam', href: 'admin-products.html' },
    { key: 'categories', label: 'Categories', icon: 'bi-tags', href: 'admin-categories.html' },
    { key: 'users', label: 'Users', icon: 'bi-people', href: 'admin-users.html' },
    { key: 'orders', label: 'Orders', icon: 'bi-receipt', href: 'admin-orders.html' },
    { key: 'payments', label: 'Payments', icon: 'bi-credit-card', href: 'admin-payments.html' },
  ];
  root.innerHTML = `
    <div class="se-admin-sidebar py-3">
      <h6 class="text-white-50 px-3 mb-3 small text-uppercase">Admin Panel</h6>
      ${links.map(l => `<a href="${l.href}" class="${l.key === active ? 'active' : ''}"><i class="bi ${l.icon} me-2"></i>${l.label}</a>`).join('')}
      <hr class="border-secondary mx-3">
      <a href="../index.html"><i class="bi bi-box-arrow-left me-2"></i>Back to Store</a>
    </div>`;
}

async function initAdminPage(activeKey) {
  await initPage('../');
  if (!requireAdmin()) return false;
  renderAdminSidebar(activeKey);
  return true;
}

/* ================= Dashboard ================= */
async function loadAdminDashboard() {
  try {
    const stats = await apiRequest('/admin/dashboard');
    document.getElementById('statUsers').textContent = stats.totalUsers;
    document.getElementById('statProducts').textContent = stats.totalProducts;
    document.getElementById('statCategories').textContent = stats.totalCategories;
    document.getElementById('statOrders').textContent = stats.totalOrders;
    document.getElementById('statRevenue').textContent = formatCurrency(stats.totalRevenue);
    document.getElementById('statPending').textContent = stats.pendingOrders;
  } catch (err) {
    showToast(err.message, 'error');
  }
}

/* ================= Products ================= */
async function loadAdminProducts() {
  const tbody = document.getElementById('adminProductsBody');
  try {
    const products = await apiRequest('/products');
    if (products.length === 0) {
      tbody.innerHTML = '<tr><td colspan="7" class="text-center text-muted-se py-4">No products yet.</td></tr>';
      return;
    }
    tbody.innerHTML = products.map(p => `
      <tr>
        <td><img src="${p.imageUrl}" onerror="this.src='${FALLBACK_IMAGE}'" style="width:44px;height:44px;object-fit:cover;border-radius:6px;"></td>
        <td>${escapeHtml(p.productName)}</td>
        <td>${escapeHtml(p.categoryName)}</td>
        <td>${formatCurrency(p.discountPrice || p.price)}</td>
        <td>${p.stockQty}</td>
        <td>${p.trending ? '<span class="badge text-bg-warning">Yes</span>' : '—'}</td>
        <td>
          <a href="admin-product-form.html?id=${p.productId}" class="btn btn-sm btn-se-outline me-1">Edit</a>
          <button class="btn btn-sm btn-se-ghost-danger" onclick="deleteAdminProduct(${p.productId})">Delete</button>
        </td>
      </tr>`).join('');
  } catch (err) {
    tbody.innerHTML = `<tr><td colspan="7" class="text-danger text-center py-4">${err.message}</td></tr>`;
  }
}

async function deleteAdminProduct(id) {
  if (!confirm('Delete this product? This cannot be undone.')) return;
  try {
    await apiRequest('/products/' + id, { method: 'DELETE' });
    showToast('Product deleted.');
    loadAdminProducts();
  } catch (err) {
    showToast(err.message, 'error');
  }
}

async function loadProductForm() {
  const id = new URLSearchParams(window.location.search).get('id');
  document.getElementById('productFormTitle').textContent = id ? 'Edit Product' : 'Add Product';

  // Populate category dropdown
  try {
    const categories = await apiRequest('/categories');
    document.getElementById('pfCategory').innerHTML = categories.map(c => `<option value="${c.categoryId}">${escapeHtml(c.categoryName)}</option>`).join('');
  } catch (err) { showToast(err.message, 'error'); }

  if (id) {
    try {
      const p = await apiRequest('/products/' + id);
      document.getElementById('productId').value = p.productId;
      document.getElementById('pfName').value = p.productName;
      document.getElementById('pfDescription').value = p.description || '';
      document.getElementById('pfCategory').value = p.categoryId;
      document.getElementById('pfBrand').value = p.brand || '';
      document.getElementById('pfPrice').value = p.price;
      document.getElementById('pfDiscountPrice').value = p.discountPrice || '';
      document.getElementById('pfStock').value = p.stockQty;
      document.getElementById('pfImageUrl').value = p.imageUrl;
      document.getElementById('pfTrending').checked = p.trending;
      document.getElementById('pfImagePreview').src = p.imageUrl;
      document.getElementById('pfImagePreview').classList.remove('d-none');
    } catch (err) { showToast(err.message, 'error'); }
  }
}

function previewProductImage() {
  const url = document.getElementById('pfImageUrl').value.trim();
  const img = document.getElementById('pfImagePreview');
  if (url) { img.src = url; img.classList.remove('d-none'); } else { img.classList.add('d-none'); }
}

async function saveProductForm(e) {
  e.preventDefault();
  const id = document.getElementById('productId').value;
  const payload = {
    productName: document.getElementById('pfName').value.trim(),
    description: document.getElementById('pfDescription').value.trim(),
    categoryId: parseInt(document.getElementById('pfCategory').value, 10),
    brand: document.getElementById('pfBrand').value.trim(),
    price: parseFloat(document.getElementById('pfPrice').value),
    discountPrice: document.getElementById('pfDiscountPrice').value ? parseFloat(document.getElementById('pfDiscountPrice').value) : null,
    stockQty: parseInt(document.getElementById('pfStock').value, 10),
    imageUrl: document.getElementById('pfImageUrl').value.trim(),
    trending: document.getElementById('pfTrending').checked
  };
  try {
    if (id) {
      await apiRequest('/products/' + id, { method: 'PUT', body: payload });
      showToast('Product updated.');
    } else {
      await apiRequest('/products', { method: 'POST', body: payload });
      showToast('Product created.');
    }
    setTimeout(() => { window.location.href = 'admin-products.html'; }, 600);
  } catch (err) {
    showToast(err.message, 'error');
  }
  return false;
}

/* ================= Categories ================= */
let categoryModalInstance = null;

async function loadAdminCategories() {
  const tbody = document.getElementById('adminCategoriesBody');
  try {
    const categories = await apiRequest('/categories');
    if (categories.length === 0) {
      tbody.innerHTML = '<tr><td colspan="4" class="text-center text-muted-se py-4">No categories yet.</td></tr>';
      return;
    }
    tbody.innerHTML = categories.map(c => `
      <tr>
        <td><img src="${c.imageUrl}" onerror="this.src='${FALLBACK_IMAGE}'" style="width:40px;height:40px;object-fit:cover;border-radius:50%;"></td>
        <td>${escapeHtml(c.categoryName)}</td>
        <td>${c.parentCategoryName ? escapeHtml(c.parentCategoryName) : '<span class="text-muted-se">— Top Level —</span>'}</td>
        <td>
          <button class="btn btn-sm btn-se-outline me-1" onclick='openCategoryModal(${JSON.stringify(c)})'>Edit</button>
          <button class="btn btn-sm btn-se-ghost-danger" onclick="deleteAdminCategory(${c.categoryId})">Delete</button>
        </td>
      </tr>`).join('');

    // Populate parent category dropdown in modal (top-level categories only, excluding current edit target handled at open-time)
    document.getElementById('catParentId').innerHTML = '<option value="">— None (Top Level) —</option>' +
      categories.filter(c => !c.parentCategoryId).map(c => `<option value="${c.categoryId}">${escapeHtml(c.categoryName)}</option>`).join('');
  } catch (err) {
    tbody.innerHTML = `<tr><td colspan="4" class="text-danger text-center py-4">${err.message}</td></tr>`;
  }
}

function openCategoryModal(category) {
  document.getElementById('categoryForm').reset();
  document.getElementById('categoryId').value = '';
  document.getElementById('categoryModalTitle').textContent = category ? 'Edit Category' : 'Add Category';
  if (category) {
    document.getElementById('categoryId').value = category.categoryId;
    document.getElementById('catName').value = category.categoryName;
    document.getElementById('catImageUrl').value = category.imageUrl;
    document.getElementById('catParentId').value = category.parentCategoryId || '';
  }
  categoryModalInstance = categoryModalInstance || new bootstrap.Modal(document.getElementById('categoryModal'));
  categoryModalInstance.show();
}

async function saveCategoryForm(e) {
  e.preventDefault();
  const id = document.getElementById('categoryId').value;
  const payload = {
    categoryName: document.getElementById('catName').value.trim(),
    imageUrl: document.getElementById('catImageUrl').value.trim(),
    parentCategoryId: document.getElementById('catParentId').value ? parseInt(document.getElementById('catParentId').value, 10) : null
  };
  try {
    if (id) {
      await apiRequest('/categories/' + id, { method: 'PUT', body: payload });
      showToast('Category updated.');
    } else {
      await apiRequest('/categories', { method: 'POST', body: payload });
      showToast('Category created.');
    }
    bootstrap.Modal.getInstance(document.getElementById('categoryModal')).hide();
    loadAdminCategories();
  } catch (err) {
    showToast(err.message, 'error');
  }
  return false;
}

async function deleteAdminCategory(id) {
  if (!confirm('Delete this category? Products in it will need to be reassigned.')) return;
  try {
    await apiRequest('/categories/' + id, { method: 'DELETE' });
    showToast('Category deleted.');
    loadAdminCategories();
  } catch (err) {
    showToast(err.message, 'error');
  }
}

/* ================= Users ================= */
async function loadAdminUsers() {
  const tbody = document.getElementById('adminUsersBody');
  try {
    const users = await apiRequest('/admin/users');
    tbody.innerHTML = users.map(u => `
      <tr>
        <td>${u.userId}</td>
        <td>${escapeHtml(u.fullName)}</td>
        <td>${escapeHtml(u.email)}</td>
        <td>${escapeHtml(u.phone || '—')}</td>
        <td>${u.roles.map(r => `<span class="badge text-bg-light border me-1">${r.replace('ROLE_', '')}</span>`).join('')}</td>
        <td>${u.enabled ? '<span class="badge text-bg-success">Active</span>' : '<span class="badge text-bg-secondary">Disabled</span>'}</td>
        <td>
          <button class="btn btn-sm btn-se-outline me-1" onclick="toggleAdminUserStatus(${u.userId})">${u.enabled ? 'Disable' : 'Enable'}</button>
          <button class="btn btn-sm btn-se-ghost-danger" onclick="deleteAdminUser(${u.userId})">Delete</button>
        </td>
      </tr>`).join('');
  } catch (err) {
    tbody.innerHTML = `<tr><td colspan="7" class="text-danger text-center py-4">${err.message}</td></tr>`;
  }
}

async function toggleAdminUserStatus(id) {
  try {
    await apiRequest('/admin/users/' + id + '/toggle-status', { method: 'PUT' });
    showToast('User status updated.');
    loadAdminUsers();
  } catch (err) {
    showToast(err.message, 'error');
  }
}

async function deleteAdminUser(id) {
  if (!confirm('Delete this user account? This cannot be undone.')) return;
  try {
    await apiRequest('/admin/users/' + id, { method: 'DELETE' });
    showToast('User deleted.');
    loadAdminUsers();
  } catch (err) {
    showToast(err.message, 'error');
  }
}

/* ================= Orders ================= */
const ADMIN_ORDER_STATUSES = ['PENDING', 'CONFIRMED', 'SHIPPED', 'DELIVERED', 'CANCELLED'];

async function loadAdminOrders() {
  const tbody = document.getElementById('adminOrdersBody');
  try {
    const orders = await apiRequest('/orders');
    if (orders.length === 0) {
      tbody.innerHTML = '<tr><td colspan="6" class="text-center text-muted-se py-4">No orders yet.</td></tr>';
      return;
    }
    tbody.innerHTML = orders.map(o => `
      <tr>
        <td>#${o.orderId}</td>
        <td>${formatDate(o.orderDate)}</td>
        <td>${o.items.length} item(s)</td>
        <td>${formatCurrency(o.totalAmount)}</td>
        <td><span class="se-status se-status-${o.status}">${o.status}</span></td>
        <td>
          <select class="form-select form-select-sm" style="width:150px;display:inline-block;" onchange="updateAdminOrderStatus(${o.orderId}, this.value)">
            ${ADMIN_ORDER_STATUSES.map(s => `<option value="${s}" ${s === o.status ? 'selected' : ''}>${s}</option>`).join('')}
          </select>
          <a href="../order-details.html?id=${o.orderId}" class="btn btn-sm btn-se-outline ms-1">View</a>
        </td>
      </tr>`).join('');
  } catch (err) {
    tbody.innerHTML = `<tr><td colspan="6" class="text-danger text-center py-4">${err.message}</td></tr>`;
  }
}

async function updateAdminOrderStatus(orderId, status) {
  try {
    await apiRequest('/orders/' + orderId + '/status', { method: 'PUT', body: { status } });
    showToast('Order #' + orderId + ' status updated to ' + status + '.');
    loadAdminOrders();
  } catch (err) {
    showToast(err.message, 'error');
  }
}

/* ================= Payments ================= */
async function loadAdminPayments() {
  const tbody = document.getElementById('adminPaymentsBody');
  try {
    const payments = await apiRequest('/admin/payments');
    if (payments.length === 0) {
      tbody.innerHTML = '<tr><td colspan="5" class="text-center text-muted-se py-4">No payments yet.</td></tr>';
      return;
    }
    tbody.innerHTML = payments.map(p => `
      <tr>
        <td>#${p.paymentId}</td>
        <td>#${p.orderId}</td>
        <td>${p.paymentMethod}</td>
        <td>${formatCurrency(p.amount)}</td>
        <td><span class="badge text-bg-${p.paymentStatus === 'SUCCESS' ? 'success' : (p.paymentStatus === 'FAILED' ? 'danger' : 'warning')}">${p.paymentStatus}</span></td>
      </tr>`).join('');
  } catch (err) {
    tbody.innerHTML = `<tr><td colspan="5" class="text-danger text-center py-4">${err.message}</td></tr>`;
  }
}
