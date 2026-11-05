import { INITIAL_USER } from '../config/app.config.js';

// Membaca sesi dengan aman (mencegah error jika format JSON rusak)
let savedUser = null;
try {
    const sessionStr = localStorage.getItem('ayaka_session');
    if (sessionStr && sessionStr !== 'undefined') {
        savedUser = JSON.parse(sessionStr);
    }
} catch (e) {
    console.warn("Sesi lama tidak valid, menghapus...");
    localStorage.removeItem('ayaka_session');
}

export const state = {
    currentUser: savedUser, // Akan bernilai null jika belum login
    smmServices: [],
    orderHistory: [],
    topupHistory: [],
    selectedService: null,
    currentSlideIndex: 0,
    autoSlideTimer: null,
    activeInvoiceData: null,
    statusPollingTimer: null
};