import { state } from '../data/state.js';
import { formatRupiah } from './format.js';

export function updateBalanceUI() {
    // Jika tidak ada user yang login, jangan tampilkan saldo
    const formatted = state.currentUser ? formatRupiah(state.currentUser.balance) : 'Rp 0';
    
    const sidebar  = document.getElementById('user-balance-sidebar');
    const homeBal  = document.getElementById('home-user-balance');
    const mobileBal = document.getElementById('mobile-user-balance');

    if (sidebar)   sidebar.innerText = formatted;
    if (homeBal)   homeBal.innerText = formatted;
    if (mobileBal) mobileBal.innerText = formatted;
}