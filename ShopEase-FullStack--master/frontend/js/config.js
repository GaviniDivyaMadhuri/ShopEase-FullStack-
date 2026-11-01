/* =========================================================
   ShopEase - config.js
   Core helpers shared by every page
   ========================================================= */


/* =========================================================
   API CONFIGURATION
   ========================================================= */

const API_BASE = 'http://localhost:8080/api';

const FALLBACK_IMAGE =
    'https://via.placeholder.com/400x400.png?text=ShopEase';


/* =========================================================
   API REQUEST
   ========================================================= */

async function apiRequest(path, options = {}) {

    const config = {

        method: options.method || 'GET',

        credentials: 'include',

        headers: {
            'Content-Type': 'application/json',
            ...(options.headers || {})
        }

    };


    if (options.body !== undefined) {

        config.body =
            JSON.stringify(options.body);

    }


    let response;


    try {

        response =
            await fetch(
                API_BASE + path,
                config
            );

    } catch (networkErr) {

        throw new Error(
            'Could not reach the server. Is the backend running on '
            + API_BASE + '?'
        );

    }


    let data = null;

    const text =
        await response.text();


    if (text) {

        try {

            data =
                JSON.parse(text);

        } catch (e) {

            data = null;

        }

    }


    if (!response.ok) {

        if (response.status === 401) {

            const err =
                new Error(
                    (data && data.message)
                    || 'Please login to continue.'
                );

            err.status = 401;

            throw err;

        }


        const err =
            new Error(
                (data && data.message)
                || 'Something went wrong. Please try again.'
            );

        err.status =
            response.status;

        err.fieldErrors =
            data && data.fieldErrors;

        throw err;

    }


    return data;
}


/* =========================================================
   LOADER
   ========================================================= */

function showLoader() {

    let overlay =
        document.getElementById('se-loader');


    if (!overlay) {

        overlay =
            document.createElement('div');

        overlay.id =
            'se-loader';

        overlay.className =
            'se-loader-overlay';

        overlay.innerHTML =
            '<div class="se-spinner"></div>';

        document.body.appendChild(
            overlay
        );

    }


    overlay.classList.add('show');
}


function hideLoader() {

    const overlay =
        document.getElementById('se-loader');


    if (overlay) {

        overlay.classList.remove('show');

    }

}


/* =========================================================
   TOAST
   ========================================================= */

function showToast(
    message,
    type = 'success'
) {

    let container =
        document.querySelector(
            '.se-toast-container'
        );


    if (!container) {

        container =
            document.createElement('div');

        container.className =
            'se-toast-container';

        document.body.appendChild(
            container
        );

    }


    const toast =
        document.createElement('div');

    toast.className =
        'se-toast se-toast-'
        + (
            type === 'error'
                ? 'error'
                : 'success'
        );


    toast.textContent =
        message;


    container.appendChild(
        toast
    );


    setTimeout(
        () => toast.remove(),
        3200
    );

}


/* =========================================================
   FORMATTING
   ========================================================= */

function formatCurrency(amount) {

    const num =
        Number(amount || 0);


    return '₹' +
        num.toLocaleString(
            'en-IN',
            {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2
            }
        );

}


function formatDate(isoString) {

    if (!isoString) {
        return '';
    }


    const d =
        new Date(isoString);


    return d.toLocaleDateString(
        'en-IN',
        {
            day: 'numeric',
            month: 'short',
            year: 'numeric'
        }
    );

}


/* =========================================================
   IMAGE FALLBACK
   ========================================================= */

function withImageFallback(imgEl) {

    if (!imgEl) {
        return imgEl;
    }


    imgEl.addEventListener(
        'error',
        function handler() {

            imgEl.removeEventListener(
                'error',
                handler
            );

            imgEl.src =
                FALLBACK_IMAGE;

        }
    );


    return imgEl;

}


/* =========================================================
   HTML ESCAPE
   ========================================================= */

function escapeHtml(str) {

    const div =
        document.createElement('div');


    div.textContent =
        str || '';


    return div.innerHTML;

}


/* =========================================================
   AUTH STATE
   ========================================================= */

let CURRENT_USER = null;


/* =========================================================
   LOAD CURRENT USER
   ========================================================= */

async function loadCurrentUser() {

    try {

        const user =
            await apiRequest(
                '/auth/me'
            );


        console.log(
            'AUTH ME SUCCESS:',
            user
        );


        CURRENT_USER =
            user;


    } catch (err) {

        console.error(
            'AUTH ME FAILED:',
            err
        );


        console.error(
            'AUTH ME STATUS:',
            err.status
        );


        CURRENT_USER =
            null;

    }


    return CURRENT_USER;

}


/* =========================================================
   LOGIN CHECK
   ========================================================= */

function isLoggedIn() {

    return CURRENT_USER !== null;

}


/* =========================================================
   ADMIN CHECK
   ========================================================= */

function isAdmin() {

    return (
        CURRENT_USER !== null
        &&
        Array.isArray(
            CURRENT_USER.roles
        )
        &&
        CURRENT_USER.roles.includes(
            'ROLE_ADMIN'
        )
    );

}


/* =========================================================
   REQUIRE LOGIN
   ========================================================= */

function requireLogin(
    redirectBackTo
) {

    if (isLoggedIn()) {

        return true;

    }


    showToast(
        'Please login to continue.',
        'error'
    );


    setTimeout(
        () => {

            let url =
                'login.html';


            if (redirectBackTo) {

                url +=
                    '?next=' +
                    encodeURIComponent(
                        redirectBackTo
                    );

            }


            window.location.href =
                url;

        },
        900
    );


    return false;

}


/* =========================================================
   REQUIRE ADMIN
   ========================================================= */

function requireAdmin() {

    if (!isLoggedIn()) {

        window.location.href =
            'login.html';

        return false;

    }


    if (!isAdmin()) {

        showToast(
            'You do not have permission to access this page.',
            'error'
        );


        setTimeout(
            () => {

                window.location.href =
                    '../index.html';

            },
            1200
        );


        return false;

    }


    return true;

}


/* =========================================================
   DARK / LIGHT THEME
   ========================================================= */

function initTheme() {

    const saved =
        localStorage.getItem(
            'shopease-theme'
        ) || 'light';


    document.documentElement
        .setAttribute(
            'data-theme',
            saved
        );

}


function toggleTheme() {

    const current =
        document.documentElement
            .getAttribute(
                'data-theme'
            ) || 'light';


    const next =
        current === 'light'
            ? 'dark'
            : 'light';


    document.documentElement
        .setAttribute(
            'data-theme',
            next
        );


    localStorage.setItem(
        'shopease-theme',
        next
    );


    const icon =
        document.getElementById(
            'theme-icon'
        );


    if (icon) {

        icon.className =
            next === 'light'
                ? 'bi bi-moon-stars'
                : 'bi bi-sun';

    }

}


/* =========================================================
   INITIALIZE THEME
   ========================================================= */

initTheme();