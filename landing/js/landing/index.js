const BASE_URL = 'http://34.193.147.252';

/* Login form */
const signUpButton = document.getElementById('signUp');
const signInButton = document.getElementById('signIn');
const container = document.getElementById('form-container');

signUpButton.addEventListener('click', () => {
    container.classList.add("right-panel-active");
});

signInButton.addEventListener('click', _ => {
    container.classList.remove("right-panel-active");
});

async function login(e) {
    let asd;
    e.preventDefault();
    /* get inputs */
    let form = document.querySelector('.sign-in-container form');
    let email = form.querySelector('[name=email]').value;
    let password = form.querySelector('[name=password]').value;

    let url = BASE_URL + '/api/users/login';

    /* Send to API */
    let body = toFormData({
        email,
        password
    });

    let response = await fetch(url, {
        body,
        method: 'POST'
    });
    let data = await response.json();

    if (!data.err) {
        /* Save token to localStorage */
        localStorage._token = data._token;
        // console.log(localStorage._token);
        // console.log(data._token);
        /* Redirect to posts page */
        window.location.href = '/home';
    } else {
        window.alert(data.msg);
    }
}

async function signup(e) {
    e.preventDefault();

    let form = e.target;
    let nameField = form.querySelector('[name=name]');
    let emailField = form.querySelector('[name=email]');
    let passwordField = form.querySelector('[name=password]');
    let name = nameField.value;
    let email = emailField.value;
    let password = passwordField.value;

    let body = toFormData({
        email,
        password,
        first_name: name
    });

    let url = BASE_URL + '/api/users/signup';

    let response = await fetch(url, {
        body,
        method: 'POST'
    });

    let data = await response.json();

    /* Signup is successful, show success message and clear inputs */
    if (!data.err) {
        Swal.fire({
            title: 'Success',
            text: 'You have successfully registered your account.',
            icon: 'success'
        });
        nameField.value = '';
        emailField.value = '';
        passwordField.value = '';

        signInButton.click();

    } else {
        Swal.fire(data.msg);
    }
}

/* Add event listeners for login and sign up */
let loginForm = document.querySelector('.sign-in-container form');
let signupForm = document.querySelector('.sign-up-container form');

loginForm.addEventListener('submit', login);
signupForm.addEventListener('submit', signup);