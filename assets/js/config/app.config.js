// File: assets/js/config/app.config.js

export const BYFASTT_CONFIG = {
    baseUrl: '',
    authToken: ''
};

export const INDOSMM_CONFIG = {
    baseUrl: '',
    apiKey: ''
};

// TAMBAHAN KONFIGURASI AIRPAY
export const AIRPAY_CONFIG = {
    baseUrl: '',
    apiKey: ''
};

export const INITIAL_USER = {
    id: "usr_9921",
    username: "Syahrul (User)",
    email: "syahrul@ayaka.store",
    balance: 0,
    role: "ADMIN"
};

export async function loadEnvironmentVariables() {
    try {
        const response = await fetch('/api/config');
        if (response.ok) {
            const data = await response.json();
            
            // Isi data ByFastt
            BYFASTT_CONFIG.baseUrl = data.byfasttUrl;
            BYFASTT_CONFIG.authToken = data.byfasttToken;
            
            // Isi data IndoSMM
            INDOSMM_CONFIG.baseUrl = data.indosmmBaseUrl;
            INDOSMM_CONFIG.apiKey = data.indosmmApiKey;
            
            // Isi data AirPay
            AIRPAY_CONFIG.baseUrl = data.airpayUrl;
            AIRPAY_CONFIG.apiKey = data.airpayKey;
            
            console.log('✅ API Keys (ByFastt, IndoSMM, AirPay) berhasil dimuat dari .env');
        }
    } catch (error) {
        console.error('❌ Gagal memuat file .env:', error);
    }
}