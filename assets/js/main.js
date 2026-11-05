import { state } from '../data/state.js';
import { showAlert } from '../utils/alert.js';

export function handleLogin(event) {
    if (event) event.preventDefault();

    const username = document.getElementById('login-username').value;
    const email = document.getElementById('login-email').value;
    // Password diabaikan karena ini simulasi Frontend (Netlify)

    if (username && email) {
        // Simulasi data user yang login
        const userData = {
            username: username,
            email: email,
            balance: 0, // <--- SALDO DIUBAH MENJADI 0
            role: 'USER'
        };

        // 1. Simpan ke LocalStorage sebagai sesi
        localStorage.setItem('ayaka_session', JSON.stringify(userData));
        
        // 2. Update State
        state.currentUser = userData;

        showAlert(`Selamat datang kembali, ${username}!`, 'success');
        
        // 3. Reload halaman untuk menerapkan sesi
        setTimeout(() => location.reload(), 1000);
    }
}

export function handleLogout() {
    // Hapus sesi dari LocalStorage
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