// ============================================================
// PAGE ROUTER
// handles page routing and url management
// ============================================================

// page order for direction detection
const PAGE_ORDER = ['home', 'database', 'advice'];

// page url mapping
const PAGE_URLS = {
    home: 'index.html',
    database: 'database.html',
    advice: 'advice.html'
};

// page title mapping
const PAGE_TITLES = {
    home: 'KnowYourCyber – Home',
    database: 'KnowYourCyber – Cyber Threat Database',
    advice: 'KnowYourCyber – Online Safety Advice'
};

// ============================================================
// get current page from url
// ============================================================
function getCurrentPageFromUrl() {
    const path = window.location.pathname;
    if (path.includes('database.html')) return 'database';
    if (path.includes('advice.html')) return 'advice';
    return 'home';
}

// ============================================================
// get transition direction between pages
// ============================================================
function getTransitionDirection(currentPage, targetPage) {
    const currentIndex = PAGE_ORDER.indexOf(currentPage);
    const targetIndex = PAGE_ORDER.indexOf(targetPage);
    
    if (targetIndex > currentIndex) return 'right';
    if (targetIndex < currentIndex) return 'left';
    return 'none';
}

// ============================================================
// determine target page from href
// ============================================================
function getTargetPageFromHref(href) {
    if (href.includes('index.html') || href === './' || href === '/') {
        return 'home';
    }
    if (href.includes('database.html')) {
        return 'database';
    }
    if (href.includes('advice.html')) {
        return 'advice';
    }
    return null;
}

// ============================================================
// update url without page reload
// ============================================================
function updateUrl(pageId) {
    const url = PAGE_URLS[pageId];
    window.history.pushState({ page: pageId }, '', url);
}

// ============================================================
// update page title
// ============================================================
function updatePageTitle(pageId) {
    document.title = PAGE_TITLES[pageId];
}

// ============================================================
// update active navigation styling
// ============================================================
function updateActiveNav(pageId) {
    const navLinks = document.querySelectorAll('.nav-link');
    navLinks.forEach(link => {
        const href = link.getAttribute('href');
        if (href) {
            const isActive = (pageId === 'home' && (href === 'index.html' || href === './' || href === '/')) ||
                            (pageId === 'database' && href === 'database.html') ||
                            (pageId === 'advice' && href === 'advice.html');
            link.classList.toggle('active-nav', isActive);
        }
    });
}

// ============================================================
// update header content
// ============================================================
function updateHeaderContent(headerTitle) {
    const headerH1 = document.querySelector('.header-content h1');
    if (headerH1 && headerTitle) {
        headerH1.innerHTML = headerTitle;
    }
}

// expose globally
window.Router = {
    PAGE_ORDER,
    PAGE_URLS,
    PAGE_TITLES,
    getCurrentPageFromUrl,
    getTransitionDirection,
    getTargetPageFromHref,
    updateUrl,
    updatePageTitle,
    updateActiveNav,
    updateHeaderContent
};