import { state } from '../data/state.js';
import { formatRupiah } from '../utils/format.js';
import { showAlert } from '../utils/alert.js';
import { updateBalanceUI } from '../utils/balance.js';
import * as byfastt from '../services/byfastt.service.js';

// ===== Request Invoice =====
export async function requestByFasttInvoice() {
    const amountInput = parseInt(document.getElementById('topup-amount-input').value) || 0;
    const addAmountInput = parseInt(document.getElementById('topup-add-amount-input').value) || 0;

    if (amountInput < 1000) {
        showAlert('Nominal minimal top up adalah Rp 1.000!', 'error');
        return;
    }

    const btn = document.getElementById('btn-generate-qris');
    const origText = btn.innerHTML;
    btn.innerHTML = `<i class="fa-solid fa-circle-notch fa-spin"></i> Menghubungkan API...`;
    btn.disabled = true;

    try {
        const result = await byfastt.createQrisInvoice(amountInput, addAmountInput);

        if (result.success && result.data) {
            state.activeInvoiceData = result.data;
            displayByFasttInvoice(result.data);
            showAlert(`Invoice QRIS ${result.data.trx_id} berhasil dibuat!`, 'success');
            startInvoiceStatusPolling(result.data.trx_id);
        } else {
            showAlert(result.message || 'Gagal membuat transaksi QRIS.', 'error');
        }
    } catch (err) {
        showAlert('Kesalahan koneksi ke ByFastt API.', 'error');
    } finally {
        btn.innerHTML = origText;
        btn.disabled = false;
    }
}

export function displayByFasttInvoice(data) {
    document.getElementById('inv-code').innerText = data.trx_id;
    document.getElementById('inv-total-amount').innerText = formatRupiah(data.amount);
    document.getElementById('byfastt-qr-img').src = data.qr_image_url;
    document.getElementById('btn-payment-url').href = data.payment_url;

    const expDate = new Date(data.expires_at).toLocaleString('id-ID');
    document.getElementById('inv-expires-at').innerText = expDate;

    document.getElementById('active-invoice-card').classList.remove('hidden');

    const exists = state.topupHistory.some(item => item.inv === data.trx_id);
    if (!exists) {
        state.topupHistory.unshift({
            inv: data.trx_id,
            amount: data.amount,
            method: "Dynamic QRIS",
            status: (data.status || 'pending').toUpperCase(),
            expires_at: data.expires_at
        });
        renderTopupHistory();
    }
}

// ===== Check Status (realtime) =====
export async function checkCurrentInvoiceStatus() {
    if (!state.activeInvoiceData || !state.activeInvoiceData.trx_id) return;

    try {
        const result = await byfastt.getInvoiceStatus(state.activeInvoiceData.trx_id);

        if (result.success && result.data) {
            const currentStatus = (result.data.status || 'pending').toLowerCase();

            if (currentStatus === 'success' || currentStatus === 'paid') {
                stopInvoiceStatusPolling();

                const paidAmount = parseInt(result.data.amount) || state.activeInvoiceData.amount;
                state.currentUser.balance += paidAmount;
                updateBalanceUI();

                const histItem = state.topupHistory.find(i => i.inv === state.activeInvoiceData.trx_id);
                if (histItem) histItem.status = "Success";
                renderTopupHistory();

                document.getElementById('active-invoice-card').classList.add('hidden');
                showAlert(`🎉 PEMBAYARAN SUKSES! Saldo +${formatRupiah(paidAmount)}`, 'success');
                state.activeInvoiceData = null;
            }
        }
    } catch (err) {
        console.error("Status Check Error:", err);
    }
}

export function startInvoiceStatusPolling(trxId) {
    stopInvoiceStatusPolling();
    state.statusPollingTimer = setInterval(() => checkCurrentInvoiceStatus(), 5000);
}

export function stopInvoiceStatusPolling() {
    if (state.statusPollingTimer) {
        clearInterval(state.statusPollingTimer);
        state.statusPollingTimer = null;
    }
}

// ===== Cancel Invoice =====
export async function cancelByFasttInvoice() {
    if (!state.activeInvoiceData || !state.activeInvoiceData.trx_id) return;

    try {
        await byfastt.cancelInvoice(state.activeInvoiceData.trx_id);

        stopInvoiceStatusPolling();
        const histItem = state.topupHistory.find(i => i.inv === state.activeInvoiceData.trx_id);
        if (histItem) histItem.status = "CANCELLED";
        renderTopupHistory();

        document.getElementById('active-invoice-card').classList.add('hidden');
        showAlert(`Invoice ${state.activeInvoiceData.trx_id} dibatalkan.`, 'info');
        state.activeInvoiceData = null;
    } catch (err) {
        showAlert('Gagal membatalkan invoice.', 'error');
    }
}

// ===== History =====
export async function fetchByFasttHistory() {
    try {
        const result = await byfastt.getHistory(10);

        if (result.success && (result.data || result.transactions)) {
            const list = result.data || result.transactions;
            if (Array.isArray(list)) {
                list.forEach(apiItem => {
                    const exists = state.topupHistory.some(i => i.inv === apiItem.trx_id);
                    if (!exists) {
                        state.topupHistory.push({
                            inv: apiItem.trx_id,
                            amount: apiItem.amount,
                            method: "Dynamic QRIS",
                            status: (apiItem.status || 'pending').toUpperCase(),
                            expires_at: apiItem.expires_at || '-'
                        });
                    }
                });
                renderTopupHistory();
            }
        }
    } catch (err) {
        console.warn("API list fallback");
    }
}

export function renderTopupHistory() {
    const tbody = document.getElementById('topup-history-tbody');
    if (!tbody) return;
    tbody.innerHTML = '';

    state.topupHistory.forEach(item => {
        let badgeClass = 'bg-yellow-100 text-yellow-800 border-yellow-700';
        if (item.status === 'SUCCESS' || item.status === 'PAID') badgeClass = 'bg-green-100 text-green-800 border-green-700';
        if (item.status === 'CANCELLED' || item.status === 'EXPIRED') badgeClass = 'bg-red-100 text-red-800 border-red-700';

        tbody.innerHTML += `
            <tr>
                <td class="p-3 font-mono font-bold">${item.inv}</td>
                <td class="p-3 font-bold text-green-700">${formatRupiah(item.amount)}</td>
                <td class="p-3">${item.method}</td>
                <td class="p-3"><span class="px-2.5 py-0.5 text-[10px] font-bold rounded-full border ${badgeClass}">${item.status}</span></td>
                <td class="p-3 font-mono text-[11px] text-gray-500">${item.expires_at ? new Date(item.expires_at).toLocaleTimeString() : '-'}</td>
            </tr>
        `;
    });
}