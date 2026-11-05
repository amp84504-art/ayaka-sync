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
import { handleLogout } from './modules/auth.js';

// IMPORT NOKOS & AI
import { buyNokos, checkNokosStatus } from './modules/nokos.js';
import { sendAiMessage } from './modules/ai.js'; // TAMBAHAN AI

function attachGlobalHandlers() {
    // Navigasi & UI Dasar
    window.switchTab               = switchTab;
    window.toggleMobileMenu        = toggleMobileMenu;
    window.showAlert               = showAlert;
    window.closeAlert              = closeAlert;
    window.handleLogout            = handleLogout;
    window.setupKeyboardFocusHandlers = setupKeyboardFocusHandlers;

    // Banner Slider
    window.goToBanner              = goToBanner;
    window.nextBanner              = nextBanner;
    window.prevBanner              = prevBanner;

    // SMM Panel
    window.fetchIndoSmmServices    = fetchIndoSmmServices;
    window.filterSmmServices       = filterSmmServices;
    window.calculateSmmPrice       = calculateSmmPrice;
    window.selectServiceForOrder   = selectServiceForOrder;
    window.submitSmmOrder          = submitSmmOrder;

    // Top Up & Pembayaran
    window.requestByFasttInvoice   = requestByFasttInvoice;
    window.checkCurrentInvoiceStatus = checkCurrentInvoiceStatus;
    window.cancelByFasttInvoice    = cancelByFasttInvoice;
    window.fetchByFasttHistory     = fetchByFasttHistory;
    window.renderTopupHistory      = renderTopupHistory;

    // Transaksi
    window.renderOrdersTable       = renderOrdersTable;

    // Nokos OTP
    window.buyNokos                = buyNokos;
    window.checkNokosStatus        = checkNokosStatus;
    
    // Ayaka AI
    window.sendAiMessage           = sendAiMessage; 
}

async function initApp() {
    switchTab('home');
    updateBalanceUI();
    await fetchIndoSmmServices();      
    renderOrdersTable();
    renderTopupHistory();
    startBannerAutoSlide();            
    await fetchByFasttHistory();
    
    // Panggil setelah HTML ter-render
    setTimeout(() => setupKeyboardFocusHandlers(), 500);      
}

async function bootstrap() {
    await loadEnvironmentVariables(); // Load API Keys dari .env
    await loadIncludes();             // Load Partials & Sections HTML
    attachGlobalHandlers();           // Daftarkan fungsi ke Window (untuk onclick)
    await initApp();                  // Jalankan inisialisasi aplikasi
}

document.addEventListener('DOMContentLoaded', bootstrap);