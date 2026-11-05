import { showAlert } from '../utils/alert.js';

let currentNokosOrderId = null;
let nokosPollingTimer = null;

export async function buyNokos() {
    const btn = document.getElementById('btn-buy-nokos');
    const origText = btn.innerHTML;
    
    btn.innerHTML = `<i class="fa-solid fa-circle-notch fa-spin"></i> Memproses...`;
    btn.disabled = true;

    try {
        const response = await fetch('/api/nokos/order', { method: 'POST' });
        const result = await response.json();

        if (result.success && result.data) {
            currentNokosOrderId = result.data.id;
            
            // Tampilkan UI
            document.getElementById('nokos-result-card').classList.remove('hidden');
            document.getElementById('nokos-order-id').innerText = currentNokosOrderId;
            document.getElementById('nokos-number-display').innerText = result.data.number || "Menunggu Nomor...";
            document.getElementById('nokos-otp-display').innerText = "- - - -";
            document.getElementById('nokos-status-text').innerText = "Sedang mengecek pesan masuk...";
            
            showAlert('Nomor berhasil dipesan! Menunggu OTP masuk.', 'success');
            
            // Mulai Polling
            startNokosPolling();
        } else {
            showAlert(result.message || 'Gagal membeli Nokos.', 'error');
        }
    } catch (err) {
        showAlert('Kesalahan koneksi ke server Nokos.', 'error');
    } finally {
        btn.innerHTML = origText;
        btn.disabled = false;
    }
}

export async function checkNokosStatus() {
    if (!currentNokosOrderId) return;

    try {
        const response = await fetch(`/api/nokos/status/${currentNokosOrderId}`);
        const result = await response.json();

        if (result.success && result.data) {
            const order = result.data;
            
            if (order.number) {
                document.getElementById('nokos-number-display').innerText = order.number;
            }

            if (order.status === "completed" && order.otp?.code && order.otp_is_previous === false) {
                // OTP DITERIMA
                stopNokosPolling();
                document.getElementById('nokos-otp-display').innerText = order.otp.code;
                document.getElementById('nokos-status-text').innerText = "✅ OTP Berhasil Diterima!";
                document.getElementById('nokos-status-text').className = "text-xs font-bold text-green-600 mt-2";
                showAlert('OTP Berhasil Diterima!', 'success');
            } 
            else if (["completed", "cancelled", "expired"].includes(order.status)) {
                // SELESAI TAPI TIDAK ADA OTP BARU
                stopNokosPolling();
                document.getElementById('nokos-status-text').innerText = `Status Akhir: ${order.status.toUpperCase()}`;
            } 
            else {
                // MASIH PENDING
                document.getElementById('nokos-status-text').innerText = `Status: ${order.status} (Cek otomatis tiap 5 detik)`;
            }
        }
    } catch (err) {
        console.error("Polling error:", err);
    }
}

export function startNokosPolling() {
    stopNokosPolling();
    // Cek setiap 5 detik
    nokosPollingTimer = setInterval(() => {
        checkNokosStatus();
    }, 5000);
}

export function stopNokosPolling() {
    if (nokosPollingTimer) {
        clearInterval(nokosPollingTimer);
        nokosPollingTimer = null;
    }
}