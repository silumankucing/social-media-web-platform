function login() {
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
    alert(`Login attempted with Username: ${username} and Password: ${password}`);
}

function cancel() {
    document.getElementById('loginForm').reset();
}

function register() {
    window.location.href = 'administrator_register.html';
}