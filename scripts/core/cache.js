// ============================================================
// PAGE CACHE MANAGER
// handles caching of page content for instant loading
// ============================================================

// cache storage
const pageCache = {};

// track loaded css to avoid duplicates
const loadedCSS = new Set();

// ============================================================
// load full page data from url
// ============================================================
async function loadPageData(pageId, url) {
    if (pageCache[pageId]) {
        return pageCache[pageId];
    }
    
    try {
        const response = await fetch(url);
        const htmlText = await response.text();
        
        const parser = new DOMParser();
        const doc = parser.parseFromString(htmlText, 'text/html');
        
        // get header content
        const headerContent = doc.querySelector('.header-content');
        const headerTitle = headerContent ? headerContent.querySelector('h1')?.innerHTML : '';
        
        // get main content
        const mainContent = doc.querySelector('main');
        
        // get page-specific css links
        const cssLinks = [];
        const links = doc.querySelectorAll('link[rel="stylesheet"]');
        links.forEach(link => {
            const href = link.getAttribute('href');
            if (href && !href.includes('global.css') && !href.includes('transitions.css')) {
                cssLinks.push(href);
            }
        });
        
        // get js files
        const jsFiles = [];
        const scripts = doc.querySelectorAll('script');
        scripts.forEach(script => {
            const src = script.getAttribute('src');
            if (src && !src.includes('transitions.js') && !src.includes('cache.js') && !src.includes('router.js') && !src.includes('scriptLoader.js') && !src.includes('main.js')) {
                jsFiles.push(src);
            }
        });
        
        pageCache[pageId] = {
            headerTitle: headerTitle,
            mainHtml: mainContent ? mainContent.outerHTML : '',
            cssFiles: cssLinks,
            jsFiles: jsFiles,
            title: doc.querySelector('title')?.innerText || '',
            loaded: true
        };
        
        return pageCache[pageId];
    } catch (error) {
        console.error('failed to load page:', error);
        return null;
    }
}

// ============================================================
// ensure css is loaded
// ============================================================
function ensureCSSLoaded(cssFiles) {
    cssFiles.forEach(href => {
        if (!loadedCSS.has(href)) {
            loadedCSS.add(href);
            const link = document.createElement('link');
            link.rel = 'stylesheet';
            link.href = href;
            document.head.appendChild(link);
        }
    });
}

// ============================================================
// preload adjacent pages for instant navigation
// ============================================================
function preloadAdjacentPages(currentPage) {
    const pageOrder = ['home', 'database', 'advice'];
    const currentIndex = pageOrder.indexOf(currentPage);
    
    if (currentIndex > 0) {
        const prev = pageOrder[currentIndex - 1];
        const prevUrl = prev === 'home' ? 'index.html' : prev + '.html';
        loadPageData(prev, prevUrl);
    }
    if (currentIndex < pageOrder.length - 1) {
        const next = pageOrder[currentIndex + 1];
        const nextUrl = next === 'home' ? 'index.html' : next + '.html';
        loadPageData(next, nextUrl);
    }
}

// ============================================================
// cache current page content
// ============================================================
function cacheCurrentPage(pageId, headerTitle, mainHtml, title) {
    pageCache[pageId] = {
        headerTitle: headerTitle,
        mainHtml: mainHtml,
        cssFiles: [],
        jsFiles: [],
        title: title,
        loaded: true
    };
}

// ============================================================
// get cached page
// ============================================================
function getCachedPage(pageId) {
    return pageCache[pageId] || null;
}

// expose globally
window.Cache = {
    loadPageData,
    ensureCSSLoaded,
    preloadAdjacentPages,
    cacheCurrentPage,
    getCachedPage
};