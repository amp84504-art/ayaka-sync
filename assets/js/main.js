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
    window.handleLogout            = handleLogout;
}

async function initApp() {
    switchTab('home');
    updateBalanceUI();
    await fetchIndoSmmServices();      
    renderOrdersTable();
    renderTopupHistory();
    startBannerAutoSlide();            
    await fetchByFasttHistory();
    setupKeyboardFocusHandlers();      
}

async function bootstrap() {
    await loadIncludes();              
    attachGlobalHandlers();            
    await initApp();                   
}

document.addEventListener('DOMContentLoaded', bootstrap);