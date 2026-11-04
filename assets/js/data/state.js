import { INITIAL_USER } from '../config/app.config.js';

export const state = {
    currentUser: { ...INITIAL_USER },
    smmServices: [],
    orderHistory: [],
    topupHistory: [],
    selectedService: null,
    currentSlideIndex: 0,
    autoSlideTimer: null,
    activeInvoiceData: null,
    statusPollingTimer: null
};