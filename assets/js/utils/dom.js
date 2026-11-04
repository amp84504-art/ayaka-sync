// Sembunyikan bottom nav ketika input difokus (keyboard mobile muncul)
export function setupKeyboardFocusHandlers() {
    const bottomNav = document.getElementById('mobile-bottom-nav');
    if (!bottomNav) return;

    const inputs = document.querySelectorAll('input, textarea, select');
    inputs.forEach(input => {
        input.addEventListener('focus', () => { bottomNav.style.display = 'none'; });
        input.addEventListener('blur',  () => { bottomNav.style.display = 'block'; });
    });
}