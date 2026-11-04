import { showAlert } from '../utils/alert.js';

export function handleLogout() {
    showAlert('Anda telah keluar dari akun.', 'info');
    setTimeout(() => location.reload(), 1500);
}