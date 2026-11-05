// File: assets/js/services/smm.service.js
import { INDOSMM_CONFIG } from '../config/app.config.js';

export async function fetchServicesFromApi() {
    try {
        if (!INDOSMM_CONFIG.apiKey || INDOSMM_CONFIG.apiKey === 'MASUKKAN_API_KEY_INDOSMM_ANDA_DISINI') {
            console.warn("⚠️ API Key IndoSMM belum diisi di file .env");
            return null;
        }

        // Standar API IndoSMM biasanya menggunakan POST Form URL Encoded
        const formData = new URLSearchParams();
        formData.append('key', INDOSMM_CONFIG.apiKey);
        formData.append('action', 'services');

        const response = await fetch(INDOSMM_CONFIG.baseUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            body: formData.toString()
        });

        if (!response.ok) throw new Error('Gagal terhubung ke IndoSMM API');

        const data = await response.json();
        
        // Pastikan format data sesuai dengan UI
        if (Array.isArray(data) && data.length > 0) {
            return data.map(item => ({
                service: item.service,
                category: item.category || 'Standard',
                name: item.name,
                rate: item.rate,
                min: item.min,
                max: item.max,
                refill: item.refill || false
            }));
        }
    } catch (err) {
        console.error('❌ IndoSMM API Error:', err);
    }
    return null;
}