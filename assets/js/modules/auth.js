import { state } from '../data/state.js';
import { showAlert } from '../utils/alert.js';

export function handleLogin(event) {
    if (event) event.preventDefault();

    const username = document.getElementById('login-username').value;
    const email = document.getElementById('login-email').value;

    if (username && email) {
        const userData = {
            username: username,
            email: email,
            balance: 0, // <--- SALDO 0
            role: 'USER'
        };

        localStorage.setItem('ayaka_session', JSON.stringify(userData));
        state.currentUser = userData;

        showAlert(`Selamat datang kembali, ${username}!`, 'success');
        setTimeout(() => location.reload(), 1000);
    }
}

export function handleLogout() {
    localStorage.removeItem('ayaka_session');
    state.currentUser = null;
    showAlert('Anda telah keluar dari akun.', 'info');
    setTimeout(() => location.reload(), 1000);
}

export function updateProfileUI() {
    if (!state.currentUser) return;
    
    const profUsername = document.getElementById('profile-username');
    const profEmail = document.getElementById('profile-email');
    const sideName = document.getElementById('user-display-name');

    if (profUsername) profUsername.value = state.currentUser.username;
    if (profEmail) profEmail.value = state.currentUser.email;
    if (sideName) sideName.innerText = state.currentUser.username;
}