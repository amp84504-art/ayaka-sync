import { state } from '../data/state.js';
import { DEFAULT_SMM_SERVICES } from '../data/smm.data.js';
import { fetchServicesFromApi } from '../services/smm.service.js';
import { formatRupiah, formatNumber } from '../utils/format.js';
import { showAlert } from '../utils/alert.js';
import { updateBalanceUI } from '../utils/balance.js';
import { renderOrdersTable } from './transactions.js';

// ===== Fetch + Render =====
export async function fetchIndoSmmServices() {
    const spinner = document.getElementById('smm-loading-spinner');
    spinner?.classList.remove('hidden');

    try {
        const apiData = await fetchServicesFromApi();
        state.smmServices = apiData || DEFAULT_SMM_SERVICES;
    } finally {
        spinner?.classList.add('hidden');
        populateCategoriesDropdown();
        renderSmmTable(state.smmServices);

        const cnt = document.getElementById('count-services-total');
        if (cnt) cnt.innerText = state.smmServices.length.toLocaleString('id-ID');

        const homeCnt = document.getElementById('home-total-services-cnt');
        if (homeCnt) homeCnt.innerText = `${state.smmServices.length.toLocaleString('id-ID')}+`;
    }
}

export function populateCategoriesDropdown() {
    const select = document.getElementById('smm-category-select');
    if (!select) return;

    const categories = ['ALL', ...new Set(state.smmServices.map(s => s.category || 'Lainnya'))];
    select.innerHTML = '';
    categories.forEach(cat => {
        const opt = document.createElement('option');
        opt.value = cat;
        opt.innerText = cat === 'ALL' ? 'Semua Kategori' : cat;
        select.appendChild(opt);
    });
}

export function renderSmmTable(services) {
    const tbody = document.getElementById('smm-services-tbody');
    if (!tbody) return;
    tbody.innerHTML = '';

    services.forEach(item => {
        const sId   = item.service || item.id;
        const sRate = parseFloat(item.rate || item.price) || 0;
        const sMin  = parseInt(item.min) || 1;
        const sMax  = parseInt(item.max) || 100000;

        const tr = document.createElement('tr');
        tr.className = "hover:bg-gray-50 border-b border-gray-200 transition-colors cursor-pointer";
        tr.onclick = () => selectServiceForOrder(item);
        tr.innerHTML = `
            <td class="p-3 font-mono font-bold">#${sId}</td>
            <td class="p-3">
                <div class="font-bold text-neoBlack">${item.name}</div>
                <span class="text-[10px] bg-gray-100 border px-1.5 py-0.5 rounded text-gray-600 font-semibold">${item.category || 'Standard'}</span>
            </td>
            <td class="p-3 font-black text-blue-600">${formatRupiah(sRate)}</td>
            <td class="p-3 text-[11px] font-semibold">${formatNumber(sMin)} / ${formatNumber(sMax)}</td>
            <td class="p-3">
                <button class="bg-aqua border border-neoBlack text-neoBlack font-extrabold px-2.5 py-1 rounded-lg text-[10px] shadow-neo-sm hover:bg-cyan-300">Pilih</button>
            </td>
        `;
        tbody.appendChild(tr);
    });
}

// ===== Order Form =====
export function selectServiceForOrder(item) {
    state.selectedService = item;
    const sId   = item.service || item.id;
    const sMin  = parseInt(item.min) || 1;
    const sMax  = parseInt(item.max) || 100000;
    const refill = item.refill === true || item.refill === "1" || item.refill === 1;

    document.getElementById('order-service-id').value   = `#${sId}`;
    document.getElementById('order-service-name').value = item.name;
    document.getElementById('lbl-min-order').innerText  = formatNumber(sMin);
    document.getElementById('lbl-max-order').innerText  = formatNumber(sMax);
    document.getElementById('lbl-refill').innerText     = refill
        ? "Aktif (Auto Refill Supported)"
        : "Tidak Ada Refill";
    calculateSmmPrice();
}

export function calculateSmmPrice() {
    if (!state.selectedService) return;
    const sRate = parseFloat(state.selectedService.rate || state.selectedService.price) || 0;
    const qty   = parseInt(document.getElementById('order-qty-input').value) || 0;
    const total = (qty / 1000) * sRate;
    document.getElementById('order-total-price').innerText = formatRupiah(Math.round(total));
}

export function filterSmmServices() {
    const search   = (document.getElementById('smm-search-input').value || '').toLowerCase();
    const category = document.getElementById('smm-category-select').value;
    const sort     = document.getElementById('smm-sort-select').value;

    let filtered = state.smmServices.filter(item => {
        const sId = (item.service || item.id || '').toString();
        const matchSearch = item.name.toLowerCase().includes(search) || sId.includes(search);
        const matchCategory = (category === 'ALL') || item.category === category;
        return matchSearch && matchCategory;
    });

    if (sort === 'low')  filtered.sort((a, b) => (parseFloat(a.rate || a.price)) - (parseFloat(b.rate || b.price)));
    if (sort === 'high') filtered.sort((a, b) => (parseFloat(b.rate || b.price)) - (parseFloat(a.rate || a.price)));

    renderSmmTable(filtered);
}

// ===== Submit Order (ditambahkan karena tombol sudah ada di HTML) =====
export function submitSmmOrder() {
    if (!state.selectedService) {
        showAlert('Pilih layanan terlebih dahulu!', 'error');
        return;
    }

    const target = document.getElementById('order-target-input').value.trim();
    const qty    = parseInt(document.getElementById('order-qty-input').value) || 0;
    const sMin   = parseInt(state.selectedService.min) || 1;
    const sMax   = parseInt(state.selectedService.max) || 100000;

    if (!target) { showAlert('Target / link wajib diisi!', 'error'); return; }
    if (qty < sMin || qty > sMax) {
        showAlert(`Quantity harus antara ${formatNumber(sMin)} - ${formatNumber(sMax)}!`, 'error');
        return;
    }

    const sRate = parseFloat(state.selectedService.rate) || 0;
    const total = Math.round((qty / 1000) * sRate);

    if (state.currentUser.balance < total) {
        showAlert('Saldo tidak cukup. Silakan top up terlebih dahulu.', 'error');
        return;
    }

    state.currentUser.balance -= total;
    state.orderHistory.unshift({
        id: `ORD-${Date.now().toString().slice(-8)}`,
        service: state.selectedService.name,
        target,
        total,
        status: 'PENDING'
    });

    updateBalanceUI();
    renderOrdersTable();
    showAlert('Pesanan berhasil dibuat!', 'success');

    // reset form
    document.getElementById('order-target-input').value = '';
    document.getElementById('order-qty-input').value    = '';
    document.getElementById('order-total-price').innerText = 'Rp 0';
    document.getElementById('order-service-id').value   = '';
    document.getElementById('order-service-name').value = '';
    state.selectedService = null;
}