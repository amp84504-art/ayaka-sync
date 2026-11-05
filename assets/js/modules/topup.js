// File: assets/js/modules/topup.js
import { state } from '../data/state.js';
import { formatRupiah } from '../utils/format.js';
import { showAlert } from '../utils/alert.js';
import { updateBalanceUI } from '../utils/balance.js';
import * as airpay from '../services/airpay.service.js';

export async function requestTopupInvoice() {
    const amountInput = parseInt(document.getElementById('topup-amount-input').value) || 0;

    if (amountInput < 1000) {
        showAlert('Nominal minimal top up adalah Rp 1.000!', 'error');
        return;
    }

    const btn = document.getElementById('btn-generate-qris');
    const origText = btn.innerHTML;
    btn.innerHTML = `<i class="fa-solid fa-circle-notch fa-spin"></i> Menghubungkan AirPay...`;
    btn.disabled = true;

    try {
        // Buat External ID unik
        const externalId = `INV-${Date.now()}`;
        
        // Panggil API AirPay
        const result = await airpay.createQrisInvoice(amountInput, externalId);

        if (result.success && result.data) {
            state.activeInvoiceData = result.data;
            displayAirPayInvoice(result.data);
            showAlert(`Invoice QRIS ${result.data.transaction_id} berhasil dibuat!`, 'success');
            startInvoiceStatusPolling(result.data.transaction_id);
        } else {
            showAlert(result.message || 'Gagal membuat transaksi QRIS.', 'error');
        }
    } catch (err) {
        showAlert('Kesalahan koneksi ke AirPay Gateway.', 'error');
    } finally {
        btn.innerHTML = origText;
        btn.disabled = false;
    }
}

export function displayAirPayInvoice(data) {
    document.getElementById('inv-code').innerText = data.external_id;
    document.getElementById('inv-total-amount').innerText = formatRupiah(data.total_amount);
    
    // Tampilkan Gambar QRIS sesuai kode dari AirPay
    document.getElementById('airpay-qr-img').src = data.qr_url;
    
    // Link pembayaran opsional (jika ingin buka di tab baru)
    document.getElementById('btn-payment-url').href = data.qr_url;

    const expDate = new Date(data.expiry_at).toLocaleString('id-ID');
    document.getElementById('inv-expires-at').innerText = expDate;

    document.getElementById('active-invoice-card').classList.remove('hidden');

    const exists = state.topupHistory.some(item => item.inv === data.external_id);
    if (!exists) {
        state.topupHistory.unshift({
            inv: data.external_id,
            amount: data.total_amount,
            method: "AirPay QRIS",
            status: (data.status || 'Pending').toUpperCase(),
            expires_at: data.expiry_at
        });
        renderTopupHistory();
    }
}

export async function checkCurrentInvoiceStatus() {
    if (!state.activeInvoiceData || !state.activeInvoiceData.transaction_id) return;

    try {
        const result = await airpay.checkInvoiceStatus(state.activeInvoiceData.transaction_id);

        if (result.success && result.data) {
            const currentStatus = (result.data.status || 'Pending').toLowerCase();

            if (currentStatus === 'success' || currentStatus === 'paid') {
                stopInvoiceStatusPolling();

                const paidAmount = parseInt(result.data.net_amount) || state.activeInvoiceData.total_amount;
                state.currentUser.balance += paidAmount;
                
                // Simpan ke localStorage agar saldo tidak hilang saat di-refresh
                localStorage.setItem('ayaka_session', JSON.stringify(state.currentUser));
                updateBalanceUI();

                const histItem = state.topupHistory.find(i => i.inv === state.activeInvoiceData.external_id);
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

export async function cancelTopupInvoice() {
    if (!state.activeInvoiceData || !state.activeInvoiceData.transaction_id) return;

    stopInvoiceStatusPolling();
    const histItem = state.topupHistory.find(i => i.inv === state.activeInvoiceData.external_id);
    if (histItem) histItem.status = "CANCELLED";
    renderTopupHistory();

    document.getElementById('active-invoice-card').classList.add('hidden');
    showAlert(`Invoice ${state.activeInvoiceData.external_id} dibatalkan.`, 'info');
    state.activeInvoiceData = null;
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