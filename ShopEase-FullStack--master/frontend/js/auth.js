/* =========================================================
   ShopEase - auth.js
   Handles login.html and signup.html form submissions.
   ========================================================= */


/* =========================================================
   INVALID FIELD
   ========================================================= */

function markInvalid(inputEl, invalid) {

    if (!inputEl) {
        return;
    }

    inputEl.classList.toggle(
        'is-invalid',
        invalid
    );
}


/* =========================================================
   LOGIN
   ========================================================= */

async function handleLogin(e) {

    e.preventDefault();


    const emailEl =
        document.getElementById('loginEmail');

    const passwordEl =
        document.getElementById('loginPassword');


    let valid = true;


    if (!emailEl.checkValidity()) {

        markInvalid(
            emailEl,
            true
        );

        valid = false;

    } else {

        markInvalid(
            emailEl,
            false
        );
    }


    if (!passwordEl.value) {

        markInvalid(
            passwordEl,
            true
        );

        valid = false;

    } else {

        markInvalid(
            passwordEl,
            false
        );
    }


    if (!valid) {
        return false;
    }


    const btn =
        document.getElementById(
            'loginSubmitBtn'
        );


    btn.disabled = true;

    btn.textContent =
        'Logging in...';


    try {

        const user =
            await apiRequest(
                '/auth/login',
                {
                    method: 'POST',

                    body: {
                        email:
                            emailEl.value.trim(),

                        password:
                            passwordEl.value
                    }
                }
            );


        /*
         * Save current user for this page.
         */

        CURRENT_USER =
            user;


        console.log(
            'LOGIN SUCCESS:',
            user
        );


        showToast(
            'Welcome back, '
            + user.fullName.split(' ')[0]
            + '!'
        );


        /*
         * If user was redirected to login
         * from another protected page,
         * return to that page.
         */

        const next =
            new URLSearchParams(
                window.location.search
            ).get('next');


        setTimeout(
            () => {

                window.location.href =
                    next || 'index.html';

            },
            600
        );


    } catch (err) {

        console.error(
            'LOGIN ERROR:',
            err
        );


        showToast(
            err.message,
            'error'
        );


        btn.disabled = false;

        btn.textContent =
            'Login';
    }


    return false;
}


/* =========================================================
   SIGNUP
   ========================================================= */

async function handleSignup(e) {

    e.preventDefault();


    const nameEl =
        document.getElementById(
            'signupName'
        );

    const emailEl =
        document.getElementById(
            'signupEmail'
        );

    const phoneEl =
        document.getElementById(
            'signupPhone'
        );

    const passwordEl =
        document.getElementById(
            'signupPassword'
        );


    let valid = true;


    /* Full name */

    if (!nameEl.checkValidity()) {

        markInvalid(
            nameEl,
            true
        );

        valid = false;

    } else {

        markInvalid(
            nameEl,
            false
        );
    }


    /* Email */

    if (!emailEl.checkValidity()) {

        markInvalid(
            emailEl,
            true
        );

        valid = false;

    } else {

        markInvalid(
            emailEl,
            false
        );
    }


    /* Phone */

    if (
        phoneEl.value
        &&
        !phoneEl.checkValidity()
    ) {

        markInvalid(
            phoneEl,
            true
        );

        valid = false;

    } else {

        markInvalid(
            phoneEl,
            false
        );
    }


    /* Password */

    if (!passwordEl.checkValidity()) {

        markInvalid(
            passwordEl,
            true
        );

        valid = false;

    } else {

        markInvalid(
            passwordEl,
            false
        );
    }


    if (!valid) {
        return false;
    }


    const btn =
        document.getElementById(
            'signupSubmitBtn'
        );


    btn.disabled = true;

    btn.textContent =
        'Creating account...';


    try {

        await apiRequest(
            '/auth/register',
            {
                method: 'POST',

                body: {

                    fullName:
                        nameEl.value.trim(),

                    email:
                        emailEl.value.trim(),

                    phone:
                        phoneEl.value.trim(),

                    password:
                        passwordEl.value
                }
            }
        );


        showToast(
            'Account created! Please login.'
        );


        setTimeout(
            () => {

                window.location.href =
                    'login.html';

            },
            800
        );


    } catch (err) {

        console.error(
            'SIGNUP ERROR:',
            err
        );


        showToast(
            err.message,
            'error'
        );


        if (err.fieldErrors) {

            Object.keys(
                err.fieldErrors
            ).forEach(
                field => {

                    const elementId =
                        'signup'
                        + field
                            .charAt(0)
                            .toUpperCase()
                        + field.slice(1);


                    const el =
                        document.getElementById(
                            elementId
                        );


                    if (el) {

                        markInvalid(
                            el,
                            true
                        );
                    }

                }
            );
        }


        btn.disabled = false;

        btn.textContent =
            'Create Account';
    }


    return false;
}