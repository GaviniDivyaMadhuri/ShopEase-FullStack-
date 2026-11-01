/* =========================================================
   ShopEase - profile.js
   ========================================================= */

let addressModalInstance = null;


/* =========================================================
   LOAD PROFILE
   ========================================================= */

async function loadProfile() {

  try {

    /*
     * Backend endpoint:
     * GET /api/auth/me
     */

    const profile = await apiRequest('/auth/me');

    CURRENT_USER = profile;

    const nameInput =
      document.getElementById('profileFullName');

    const emailInput =
      document.getElementById('profileEmail');

    const phoneInput =
      document.getElementById('profilePhone');


    if (nameInput) {
      nameInput.value =
        profile.fullName || '';
    }

    if (emailInput) {
      emailInput.value =
        profile.email || '';
    }

    /*
     * Current AuthResponse does not contain phone.
     * So keep it empty until backend adds phone.
     */

    if (phoneInput) {
      phoneInput.value =
        profile.phone || '';
    }


  } catch (err) {

    console.error('Profile loading error:', err);

    showToast(
      err.message || 'Could not load profile.',
      'error'
    );

  }
}


/* =========================================================
   PROFILE UPDATE
   ========================================================= */

async function handleProfileUpdate(e) {

  e.preventDefault();

  const btn =
    document.getElementById('profileSaveBtn');

  if (btn) {
    btn.disabled = true;
  }


  try {

    /*
     * NOTE:
     * Your current backend AuthController does not have
     * PUT /api/profile.
     *
     * So do not call a non-existing endpoint.
     *
     * Profile update will be enabled after adding the
     * corresponding backend API.
     */

    showToast(
      'Profile update API is not available yet.',
      'error'
    );


  } catch (err) {

    showToast(
      err.message || 'Could not update profile.',
      'error'
    );

  } finally {

    if (btn) {
      btn.disabled = false;
    }

  }

  return false;
}


/* =========================================================
   LOAD ADDRESSES
   ========================================================= */

async function loadAddresses() {

  const list =
    document.getElementById('addressesList');

  if (!list) return;


  try {

    const addresses =
      await apiRequest('/addresses');


    if (!Array.isArray(addresses)
        || addresses.length === 0) {

      list.innerHTML = `
        <div class="se-empty-state">

          <i class="bi bi-geo-alt"></i>

          <div>
            No saved addresses yet.
          </div>

        </div>
      `;

      return;
    }


    list.innerHTML =
      addresses
        .map(renderAddressCard)
        .join('');


  } catch (err) {

    console.error(
      'Address loading error:',
      err
    );

    list.innerHTML = `
      <div class="text-danger">
        ${escapeHtml(
          err.message || 'Could not load addresses.'
        )}
      </div>
    `;

  }
}


/* =========================================================
   ADDRESS CARD
   ========================================================= */

function renderAddressCard(a) {

  const isDefault =
    a.defaultAddress === true;


  return `

    <div class="se-line-item mb-2"
         style="align-items:flex-start;">

      <div class="flex-grow-1">

        <div class="d-flex align-items-center gap-2">

          <strong>
            ${escapeHtml(a.fullName || '')}
          </strong>

          ${
            isDefault
              ? `
                <span class="badge text-bg-success">
                  Default
                </span>
              `
              : ''
          }

        </div>


        <div class="small text-muted-se">

          ${escapeHtml(a.address || '')},

          ${escapeHtml(a.city || '')},

          ${escapeHtml(a.state || '')}

          -

          ${escapeHtml(a.pincode || '')}

        </div>


        <div class="small text-muted-se">

          Phone:

          ${escapeHtml(a.phoneNumber || '')}

        </div>


        <div class="d-flex gap-2 mt-2">

          <button
            class="btn btn-sm btn-se-outline"
            onclick='openAddressModal(${JSON.stringify(a)})'>

            <i class="bi bi-pencil me-1"></i>
            Edit

          </button>


          <button
            class="btn btn-sm btn-se-ghost-danger"
            onclick="deleteAddress(${a.addressId})">

            <i class="bi bi-trash me-1"></i>
            Delete

          </button>

        </div>

      </div>

    </div>

  `;
}


/* =========================================================
   OPEN ADDRESS MODAL
   ========================================================= */

function openAddressModal(address = null) {

  const form =
    document.getElementById('addressForm');

  if (!form) return;


  form.reset();


  document.getElementById('addressId').value =
    '';


  document.getElementById('addressModalTitle')
    .textContent =
      address
        ? 'Edit Address'
        : 'Add Address';


  if (address) {

    document.getElementById('addressId').value =
      address.addressId || '';


    document.getElementById('addrFullName').value =
      address.fullName || '';


    document.getElementById('addrPhone').value =
      address.phoneNumber || '';


    document.getElementById('addrAddress').value =
      address.address || '';


    document.getElementById('addrCity').value =
      address.city || '';


    document.getElementById('addrState').value =
      address.state || '';


    document.getElementById('addrPincode').value =
      address.pincode || '';


    document.getElementById('addrIsDefault').checked =
      address.defaultAddress === true;

  }


  const modalElement =
    document.getElementById('addressModal');


  if (!modalElement) return;


  addressModalInstance =
    addressModalInstance ||
    new bootstrap.Modal(modalElement);


  addressModalInstance.show();
}


/* =========================================================
   SAVE ADDRESS
   ========================================================= */

async function saveAddress(e) {

  e.preventDefault();


  const id =
    document.getElementById('addressId')
      .value;


  const payload = {

    fullName:
      document.getElementById('addrFullName')
        .value
        .trim(),

    phoneNumber:
      document.getElementById('addrPhone')
        .value
        .trim(),

    address:
      document.getElementById('addrAddress')
        .value
        .trim(),

    city:
      document.getElementById('addrCity')
        .value
        .trim(),

    state:
      document.getElementById('addrState')
        .value
        .trim(),

    pincode:
      document.getElementById('addrPincode')
        .value
        .trim(),

    defaultAddress:
      document.getElementById('addrIsDefault')
        .checked

  };


  try {

    if (id) {

      await apiRequest(
        '/addresses/' + id,
        {
          method: 'PUT',
          body: payload
        }
      );

      showToast(
        'Address updated.'
      );

    } else {

      await apiRequest(
        '/addresses',
        {
          method: 'POST',
          body: payload
        }
      );

      showToast(
        'Address added.'
      );

    }


    const modalElement =
      document.getElementById('addressModal');


    const modal =
      bootstrap.Modal.getInstance(
        modalElement
      );


    if (modal) {
      modal.hide();
    }


    await loadAddresses();


  } catch (err) {

    console.error(
      'Address save error:',
      err
    );

    showToast(
      err.message || 'Could not save address.',
      'error'
    );

  }


  return false;
}


/* =========================================================
   DELETE ADDRESS
   ========================================================= */

async function deleteAddress(id) {

  if (!id) return;


  const confirmed =
    confirm(
      'Are you sure you want to delete this address?'
    );


  if (!confirmed) {
    return;
  }


  try {

    await apiRequest(
      '/addresses/' + id,
      {
        method: 'DELETE'
      }
    );


    showToast(
      'Address deleted.'
    );


    await loadAddresses();


  } catch (err) {

    console.error(
      'Address delete error:',
      err
    );

    showToast(
      err.message || 'Could not delete address.',
      'error'
    );

  }
}