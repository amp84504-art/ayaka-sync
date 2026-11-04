export function formatRupiah(amount) {
    return `Rp ${Number(amount || 0).toLocaleString('id-ID')}`;
}

export function formatNumber(n) {
    return Number(n || 0).toLocaleString('id-ID');
}