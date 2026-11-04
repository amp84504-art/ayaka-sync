export function switchTab(tabId) {
    document.querySelectorAll('.tab-content').forEach(el => el.classList.add('hidden'));

    const target = document.getElementById(`tab-${tabId}`);
    if (target) {
        target.classList.remove('hidden');
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }

    // Desktop sidebar
    document.querySelectorAll('.nav-btn').forEach(btn => {
        const active = btn.dataset.tab === tabId;
        btn.classList.toggle('bg-lightCyan', active);
        btn.classList.toggle('border-neoBlack', active);
        btn.classList.toggle('shadow-neo', active);
        btn.classList.toggle('border-transparent', !active);
    });

    // Mobile bottom nav
    document.querySelectorAll('.bottom-nav-btn').forEach(btn => {
        const active = btn.dataset.tab === tabId;
        btn.classList.toggle('bg-aqua', active);
        btn.classList.toggle('border-neoBlack', active);
        btn.classList.toggle('shadow-neo-sm', active);
        btn.classList.toggle('text-neoBlack', active);
        btn.classList.toggle('border-transparent', !active);
        btn.classList.toggle('text-gray-500', !active);
    });
}

export function toggleMobileMenu() {
    const menu = document.getElementById('mobile-menu');
    if (menu) menu.classList.toggle('hidden');
}