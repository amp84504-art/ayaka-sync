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

// Fungsi Pengecekan Sesi
function checkAuthSession() {
    const loginScreen = document.getElementById('login-screen');
    const dashboardScreen = document.getElementById('dashboard-screen');

    if (!state.currentUser) {
        // BELUM LOGIN
        if (loginScreen) {
            loginScreen.classList.remove('hidden');
            loginScreen.classList.add('flex'); // Pastikan flexbox bekerja
        }
        if (dashboardScreen) {
            dashboardScreen.classList.add('hidden');
            dashboardScreen.classList.remove('flex');
        }
    } else {
        // SUDAH LOGIN
        if (loginScreen) {
            loginScreen.classList.add('hidden');
            loginScreen.classList.remove('flex');
        }
        if (dashboardScreen) {
            dashboardScreen.classList.remove('hidden');
            dashboardScreen.classList.add('flex'); // Aktifkan layout flex-col md:flex-row
        }
        
        updateProfileUI(); 
    }
}

async function initApp() {
    // Cek sesi login terlebih dahulu
    checkAuthSession();

    // Jika sudah login, jalankan fungsi aplikasi
    if (state.currentUser) {
        switchTab('home');
        updateBalanceUI();
        await fetchIndoSmmServices();      
        renderOrdersTable();
        renderTopupHistory();
        startBannerAutoSlide();            
        await fetchByFasttHistory();
        
        // Delay sedikit agar elemen HTML selesai dirender sebelum pasang event keyboard
        setTimeout(() => setupKeyboardFocusHandlers(), 500);      
    }
}

async function bootstrap() {
    await loadEnvironmentVariables(); 
    await loadIncludes();              
    attachGlobalHandlers();            
    await initApp();                   
}

document.addEventListener('DOMContentLoaded', bootstrap);