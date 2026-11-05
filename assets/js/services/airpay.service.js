// File: assets/js/services/airpay.service.js
import { AIRPAY_CONFIG } from '../config/app.config.js';

export async function createQrisInvoice(amount, externalId) {
    const response = await fetch(`${AIRPAY_CONFIG.baseUrl}/create`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'X-API-KEY': AIRPAY_CONFIG.apiKey // DINAMIS DARI .ENV
        },
        body: JSON.stringify({
            amount: amount,
            external_id: externalId
        })
    });
    return response.json();
}

export async function checkInvoiceStatus(transactionId) {
    const response = await fetch(`${AIRPAY_CONFIG.baseUrl}/status`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'X-API-KEY': AIRPAY_CONFIG.apiKey // DINAMIS DARI .ENV
        },
        body: JSON.stringify({
            transaction_id: transactionId
        })
    });
    return response.json();
}