// ============================================================
// MAIN ENTRY POINT
// initializes the spa and all core systems
// ============================================================

// ============================================================
// setup navigation click handler
// ============================================================
function setupNavigation() {
    document.body.addEventListener('click', async (e) => {
        const link = e.target.closest('a');
        if (!link) return;
        
        let href = link.getAttribute('href');
        if (!href) return;
        if (href.startsWith('#') || href.startsWith('javascript:')) return;
        if (href.startsWith('http') && !href.includes(window.location.hostname)) return;
        
        e.preventDefault();
        
        // normalize href
        if (href === './' || href === '/') {
            href = 'index.html';
        }
        
        const targetPage = window.Router.getTargetPageFromHref(href);
        
        if (targetPage) {
            const url = window.Router.PAGE_URLS[targetPage];
            
            // preload if not cached
            if (!window.Cache.getCachedPage(targetPage)) {
                window.Cache.loadPageData(targetPage, url);
            }
            
            await window.Transitions.navigateTo(targetPage, url);
        } else if (href.startsWith('http')) {
            window.open(href, '_blank');
        }
    });
}

// ============================================================
// setup browser back/forward handling
// ============================================================
function setupHistoryNavigation() {
    window.addEventListener('popstate', async (e) => {
        const pageId = e.state?.page || 'home';
        const currentPage = window.Transitions.getCurrentPage();
        
        if (pageId !== currentPage) {
            const url = window.Router.PAGE_URLS[pageId];
            await window.Transitions.navigateTo(pageId, url);
        }
    });
}

// ============================================================
// cache current page content
// ============================================================
function cacheCurrentPage() {
    const mainContent = document.querySelector('main');
    const headerH1 = document.querySelector('.header-content h1');
    const currentPage = window.Router.getCurrentPageFromUrl();
    
    if (mainContent) {
        window.Cache.cacheCurrentPage(
            currentPage,
            headerH1?.innerHTML || '',
            mainContent.outerHTML,
            document.title
        );
    }
}

// ============================================================
// add entrance animation
// ============================================================
function addEntranceAnimation() {
    document.body.style.animation = 'fadeInUp 0.3s ease forwards';
    setTimeout(() => {
        document.body.style.animation = '';
    }, 300);
}

// ============================================================
// initialize spa
// ============================================================
async function initSPA() {
    console.log('spa initializing...');
    
    // set current page
    const currentPage = window.Router.getCurrentPageFromUrl();
    window.Transitions.setCurrentPage(currentPage);
    window.Router.updateActiveNav(currentPage);
    
    // cache current page
    cacheCurrentPage();
    
    // setup event listeners
    setupNavigation();
    setupHistoryNavigation();
    
    // preload adjacent pages
    setTimeout(() => window.Cache.preloadAdjacentPages(currentPage), 500);
    
    // add entrance animation
    addEntranceAnimation();
    
    console.log('spa initialized');
}

// start the spa
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initSPA);
} else {
    initSPA();
}