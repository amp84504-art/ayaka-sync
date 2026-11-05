import { loadEnvironmentVariables } from './config/app.config.js'; 
import { loadIncludes } from './components/include.js';
import { switchTab, toggleMobileMenu } from './components/router.js';
import { showAlert, closeAlert } from './utils/alert.js';
import { setupKeyboardFocusHandlers } from './utils/dom.js';
import { updateBalanceUI } from './utils/balance.js';
import { goToBanner, nextBanner, prevBanner, startBannerAutoSlide } from './components/banner.js';
import { fetchIndoSmmServices, filterSmmServices, calculateSmmPrice,
         selectServiceForOrder, submitSmmOrder } from './modules/smm.js';
import { requestByFasttInvoice, checkCurrentInvoiceStatus,
         cancelByFasttInvoice, fetchByFasttHistory,
         renderTopupHistory } from './modules/topup.js';
import { renderOrdersTable } from './modules/transactions.js';
import { handleLogin, handleLogout, updateProfileUI } from './modules/auth.js';
import { buyNokos, checkNokosStatus } from './modules/nokos.js';
import { sendAiMessage } from './modules/ai.js';
import { state } from './data/state.js';

function attachGlobalHandlers() {
    window.switchTab               = switchTab;
    window.toggleMobileMenu        = toggleMobileMenu;
    window.showAlert               = showAlert;
    window.closeAlert              = closeAlert;
    window.goToBanner              = goToBanner;
    window.nextBanner              = nextBanner;
    window.prevBanner              = prevBanner;
    window.fetchIndoSmmServices    = fetchIndoSmmServices;
    window.filterSmmServices       = filterSmmServices;
    window.calculateSmmPrice       = calculateSmmPrice;
    window.selectServiceForOrder   = selectServiceForOrder;
    window.submitSmmOrder          = submitSmmOrder;
    window.requestByFasttInvoice   = requestByFasttInvoice;
    window.checkCurrentInvoiceStatus = checkCurrentInvoiceStatus;
    window.cancelByFasttInvoice    = cancelByFasttInvoice;
    window.fetchByFasttHistory     = fetchByFasttHistory;
    window.renderOrdersTable       = renderOrdersTable;
    window.renderTopupHistory      = renderTopupHistory;
    
    // AUTH
    window.handleLogin             = handleLogin;
    window.handleLogout            = handleLogout;

    // NOKOS & AI
    window.buyNokos                = buyNokos;
    window.checkNokosStatus        = checkNokosStatus;
    window.sendAiMessage           = sendAiMessage; 
}

// Fungsi untuk mengecek sesi login (Guard)
function checkAuthSession() {
    const loginSection = document.getElementById('tab-login');
    const mainAppContent = document.getElementById('main-app-content'); // Kita perlu ID ini di index.html
    const sidebar = document.getElementById('sidebar');
    const mobileHeader = document.querySelector('header');
    const mobileNav = document.getElementById('mobile-bottom-nav');

    if (!state.currentUser) {
        // BELUM LOGIN
        if (loginSection) loginSection.classList.remove('hidden');
        
        // Sembunyikan konten utama & navigasi
        if (mainAppContent) mainAppContent.classList.add('hidden');
        if (sidebar) sidebar.classList.add('hidden');
        if (mobileHeader) mobileHeader.classList.add('hidden');
        if (mobileNav) mobileNav.classList.add('hidden');
    } else {
        // SUDAH LOGIN
        if (loginSection) loginSection.classList.add('hidden');
        
        // Tampilkan konten utama
        if (mainAppContent) mainAppContent.classList.remove('hidden');
        if (sidebar) sidebar.classList.remove('hidden');
        if (mobileHeader) mobileHeader.classList.remove('hidden');
        if (mobileNav) mobileNav.classList.remove('hidden');
        
        updateProfileUI(); // Isi data profil dengan data user
    }
}

async function initApp() {
    // Cek sesi terlebih dahulu
    checkAuthSession();

    if (state.currentUser) {
        // Jika sudah login, jalankan fungsi normal aplikasi
        switchTab('home');
        updateBalanceUI();
        await fetchIndoSmmServices();      
        renderOrdersTable();
        renderTopupHistory();
        startBannerAutoSlide();            
        await fetchByFasttHistory();
        setupKeyboardFocusHandlers();      
    }
}

async function bootstrap() {
    await loadEnvironmentVariables(); 
    await loadIncludes();              
    attachGlobalHandlers();            
    await initApp();                   
}

document.addEventListener('DOMContentLoaded', bootstrap);