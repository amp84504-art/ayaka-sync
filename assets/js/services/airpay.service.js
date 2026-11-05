// File: assets/js/services/airpay.service.js

// Mengambil API Key dari file config (atau ganti string di bawah langsung dengan key asli Anda)
const API_KEY = 'QP-Key-YOUR_SECRET_KEY'; 
const BASE_URL = 'https://airpaygateway.site/api/qris';

export async function createQrisInvoice(amount, externalId) {
    const response = await fetch(`${BASE_URL}/create`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'X-API-KEY': API_KEY
        },
        body: JSON.stringify({
            amount: amount,
            external_id: externalId
        })
    });
    return response.json();
}

export async function checkInvoiceStatus(transactionId) {
    const response = await fetch(`${BASE_URL}/status`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'X-API-KEY': API_KEY
        },
        body: JSON.stringify({
            transaction_id: transactionId
        })
    });
    return response.json();
}