// Pure API call — return null jika gagal (agar fallback ke data statis)
export async function fetchServicesFromApi() {
    try {
        const response = await fetch('/api/smm/services', { method: 'GET' }).catch(() => null);
        if (response && response.ok) {
            const data = await response.json();
            if (Array.isArray(data) && data.length > 0) return data;
        }
    } catch (err) {
        console.warn('IndoSMM API fetch fallback to static list');
    }
    return null;
}