// File: assets/js/config/app.config.js

export const BYFASTT_CONFIG = {
    baseUrl: '',
    authToken: ''
};

export const INDOSMM_CONFIG = {
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

// Fungsi mengambil data dari .env via server.js
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
            
            console.log('✅ API Keys berhasil dimuat dari .env');
        }
    } catch (error) {
        console.error('❌ Gagal memuat file .env:', error);
    }
}