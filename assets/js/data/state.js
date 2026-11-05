import { INITIAL_USER } from '../config/app.config.js';

export const state = {
    // Cek localStorage, jika tidak ada set null
    currentUser: JSON.parse(localStorage.getItem('ayaka_session')) || null,
    
    smmServices: [],
    orderHistory: [],
    topupHistory: [],
    selectedService: null,
    currentSlideIndex: 0,
    autoSlideTimer: null,
    activeInvoiceData: null,
    statusPollingTimer: null
};