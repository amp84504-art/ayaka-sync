import { state } from '../data/state.js';
import { formatRupiah } from '../utils/format.js';

export function renderOrdersTable() {
    const homeTbody = document.getElementById('home-recent-orders-tbody');
    const fullTbody = document.getElementById('full-orders-history-tbody');

    let html = '';
    state.orderHistory.forEach(ord => {
        html += `
            <tr>
                <td class="p-3 font-mono font-bold">${ord.id}</td>
                <td class="p-3">${ord.service}</td>
                <td class="p-3 font-mono text-xs text-blue-700 truncate max-w-[150px]">${ord.target}</td>
                <td class="p-3 font-bold">${formatRupiah(ord.total)}</td>
                <td class="p-3"><span class="px-2.5 py-0.5 text-[10px] font-extrabold rounded-full border bg-yellow-100 text-yellow-800 border-yellow-700">${ord.status}</span></td>
            </tr>
        `;
    });

    if (homeTbody) homeTbody.innerHTML = html;
    if (fullTbody) fullTbody.innerHTML = html;
}