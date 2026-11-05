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
    balance: 0, // <--- SALDO DIUBAH MENJADI 0
    role: "ADMIN"
};

export async function loadEnvironmentVariables() {
    try {
        const response = await fetch('/api/config');
        if (response.ok) {
            const data = await response.json();
            
            BYFASTT_CONFIG.baseUrl = data.byfasttUrl;
            BYFASTT_CONFIG.authToken = data.byfasttToken;
            
            INDOSMM_CONFIG.baseUrl = data.indosmmBaseUrl;
            INDOSMM_CONFIG.apiKey = data.indosmmApiKey;
            
            console.log('✅ API Keys berhasil dimuat dari .env');
        }
    } catch (error) {
        console.error('❌ Gagal memuat file .env:', error);
    }
}