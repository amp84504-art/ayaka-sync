import { state } from '../data/state.js';
import { formatRupiah } from './format.js';

export function updateBalanceUI() {
    const formatted = formatRupiah(state.currentUser.balance);
    const sidebar  = document.getElementById('user-balance-sidebar');
    const homeBal  = document.getElementById('home-user-balance');
    const mobileBal = document.getElementById('mobile-user-balance');

    if (sidebar)   sidebar.innerText = formatted;
    if (homeBal)   homeBal.innerText = formatted;
    if (mobileBal) mobileBal.innerText = formatted;
}