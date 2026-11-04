import { state } from '../data/state.js';

export function goToBanner(index) {
    const slides = document.querySelectorAll('.banner-slide');
    const dots   = document.querySelectorAll('.banner-dot');
    if (!slides.length) return;

    // Reset semua slide ke keadaan tersembunyi
    slides.forEach(s => {
        s.classList.remove('active');
        s.classList.add('opacity-0', 'invisible', 'z-0');
        s.classList.remove('opacity-100', 'visible', 'z-10');
    });
    
    // Reset styling dot (kembali ke abu-abu kecil)
    dots.forEach(d => {
        d.classList.remove('bg-neoBlack', 'w-8');
        d.classList.add('bg-gray-300', 'w-3');
    });

    // Kalkulasi index selanjutnya
    state.currentSlideIndex = (index + slides.length) % slides.length;

    // Tampilkan slide yang aktif
    const activeSlide = slides[state.currentSlideIndex];
    if (activeSlide) {
        activeSlide.classList.remove('opacity-0', 'invisible', 'z-0');
        activeSlide.classList.add('active', 'opacity-100', 'visible', 'z-10');
    }
    
    // Ubah styling dot yang aktif (hitam panjang)
    const dot = dots[state.currentSlideIndex];
    if (dot) {
        dot.classList.remove('bg-gray-300', 'w-3');
        dot.classList.add('bg-neoBlack', 'w-8');
    }
}

export function nextBanner() { 
    goToBanner(state.currentSlideIndex + 1); 
}

export function prevBanner() { 
    goToBanner(state.currentSlideIndex - 1); 
}

export function startBannerAutoSlide() {
    if (state.autoSlideTimer) clearInterval(state.autoSlideTimer);
    state.autoSlideTimer = setInterval(() => nextBanner(), 4000);
}