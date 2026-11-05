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
    window.handleLogin             = handleLogin;
    window.handleLogout            = handleLogout;
    window.buyNokos                = buyNokos;
    window.checkNokosStatus        = checkNokosStatus;
    window.sendAiMessage           = sendAiMessage; 
}

function checkAuthSession() {
    const loginScreen = document.getElementById('login-screen');
    const dashboardScreen = document.getElementById('dashboard-screen');

    if (!state.currentUser) {
        // Tampilkan Login
        if (loginScreen) {
            loginScreen.classList.remove('hidden');
            loginScreen.classList.add('flex');
        }
        if (dashboardScreen) {
            dashboardScreen.classList.add('hidden');
            dashboardScreen.classList.remove('flex');
        }
    } else {
        // Tampilkan Dashboard
        if (loginScreen) {
            loginScreen.classList.add('hidden');
            loginScreen.classList.remove('flex');
        }
        if (dashboardScreen) {
            dashboardScreen.classList.remove('hidden');
            dashboardScreen.classList.add('flex');
        }
        updateProfileUI(); 
    }
}

async function initApp() {
    checkAuthSession();

    if (state.currentUser) {
        switchTab('home');
        updateBalanceUI();
        await fetchIndoSmmServices();      
        renderOrdersTable();
        renderTopupHistory();
        startBannerAutoSlide();            
        await fetchByFasttHistory();
        setTimeout(() => setupKeyboardFocusHandlers(), 500);      
    }
}

async function bootstrap() {
    try {
        // Tampilkan layar login terlebih dahulu agar tidak blank saat loading
        const loginScreen = document.getElementById('login-screen');
        if (loginScreen) {
            loginScreen.classList.remove('hidden');
            loginScreen.classList.add('flex');
        }

        await loadEnvironmentVariables(); 
        await loadIncludes();              
        attachGlobalHandlers();            
        await initApp(); 
    } catch (error) {
        console.error("Terjadi kesalahan saat memuat aplikasi:", error);
    }
}

document.addEventListener('DOMContentLoaded', bootstrap);