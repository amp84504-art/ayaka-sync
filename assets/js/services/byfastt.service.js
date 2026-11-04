import { BYFASTT_CONFIG } from '../config/app.config.js';

const headers = {
    'Authorization': BYFASTT_CONFIG.authToken,
    'Content-Type': 'application/json'
};

export async function createQrisInvoice(amount, additionalAmount) {
    const response = await fetch(`${BYFASTT_CONFIG.baseUrl}/create`, {
        method: 'POST',
        headers,
        body: JSON.stringify({
            type: 'qris',
            amount,
            additional_amount: additionalAmount
        })
    });
    return response.json();
}

export async function getInvoiceStatus(trxId) {
    const response = await fetch(`${BYFASTT_CONFIG.baseUrl}/status`, {
        method: 'POST',
        headers,
        body: JSON.stringify({ trx_id: trxId })
    });
    return response.json();
}

export async function cancelInvoice(trxId) {
    const response = await fetch(`${BYFASTT_CONFIG.baseUrl}/cancel`, {
        method: 'POST',
        headers,
        body: JSON.stringify({ trx_id: trxId })
    });
    return response.json();
}

export async function getHistory(limit = 10) {
    const response = await fetch(`${BYFASTT_CONFIG.baseUrl}/list?limit=${limit}`, {
        headers: { 'Authorization': BYFASTT_CONFIG.authToken }
    });
    return response.json();
}