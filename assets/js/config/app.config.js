// File: assets/js/config/app.config.js

// Konfigurasi IndoSMM
export const INDOSMM_CONFIG = {
    baseUrl: '',
    apiKey: ''
};

// Konfigurasi AirPay Gateway
export const AIRPAY_CONFIG = {
    baseUrl: '',
    apiKey: ''
};

// Data User Default (Simulasi)
export const INITIAL_USER = {
    id: "usr_9921",
    username: "Syahrul (User)",
    email: "syahrul@ayaka.store",
    balance: 0,
    role: "ADMIN"
};

// Fungsi untuk memuat API Key dari file .env (via server.js)
export async function loadEnvironmentVariables() {
    try {
        const response = await fetch('/api/config');
        if (!response.ok) throw new Error("Bukan API Server (Netlify mode)");
        
        const text = await response.text();
        // Cek jika yang di-return adalah HTML (error 404) bukan JSON
        if (text.trim().startsWith('<')) throw new Error("Response berupa HTML, bukan JSON");

        const data = JSON.parse(text);
        
        // Isi data IndoSMM
        INDOSMM_CONFIG.baseUrl = data.indosmmBaseUrl;
        INDOSMM_CONFIG.apiKey = data.indosmmApiKey;
        
        // Isi data AirPay
        AIRPAY_CONFIG.baseUrl = data.airpayUrl;
        AIRPAY_CONFIG.apiKey = data.airpayKey;
        
        console.log('✅ API Keys (IndoSMM & AirPay) berhasil dimuat dari .env');
    } catch (error) {
        console.warn('⚠️ Gagal memuat .env (Berjalan di Netlify). Menggunakan Dummy Config agar UI tetap muncul.');
        // Dummy Config agar Javascript tidak error saat berjalan di Netlify
        INDOSMM_CONFIG.baseUrl = 'https://indosmm.com/api/v2';
        AIRPAY_CONFIG.baseUrl = 'https://airpaygateway.site/api/qris';
        AIRPAY_CONFIG.apiKey = 'QP-Key-DUMMY';
    }
}