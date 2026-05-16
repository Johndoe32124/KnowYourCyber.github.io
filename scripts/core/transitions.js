// ============================================================
// PAGE TRANSITION MANAGER
// handles smooth page transitions with animations
// prevents rapid navigation and transition conflicts
// ============================================================

let currentPage = 'home';
let isTransitioning = false;
let lastNavigationTime = 0;
const NAVIGATION_COOLDOWN = 800; // ms to wait between navigations

// ============================================================
// get current page height
// ============================================================
function getCurrentHeight(element) {
    const clone = element.cloneNode(true);
    clone.style.minHeight = '';
    clone.style.height = 'auto';
    return clone.offsetHeight;
}

// ============================================================
// create animated content element
// ============================================================
function createAnimatedContent(html, height, direction) {
    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = html;
    const content = tempDiv.firstChild;
    
    if (content) {
        content.style.minHeight = height + 'px';
        content.style.display = 'block';
        content.style.width = '100%';
        content.style.animation = direction === 'right' 
            ? 'slideInFromRight 0.45s cubic-bezier(0.2, 0.9, 0.4, 1.05) forwards'
            : 'slideInFromLeft 0.45s cubic-bezier(0.2, 0.9, 0.4, 1.05) forwards';
    }
    
    return content;
}

// ============================================================
// animate content out
// ============================================================
function animateOut(element, direction) {
    const clone = element.cloneNode(true);
    clone.style.animation = direction === 'right'
        ? 'slideOutToLeft 0.45s cubic-bezier(0.2, 0.9, 0.4, 1.05) forwards'
        : 'slideOutToRight 0.45s cubic-bezier(0.2, 0.9, 0.4, 1.05) forwards';
    return clone;
}

// ============================================================
// perform page transition
// ============================================================
async function transitionTo(pageId, url, direction) {
    // prevent multiple simultaneous transitions
    if (isTransitioning) {
        console.log('transition already in progress, ignoring');
        return false;
    }
    
    // prevent rapid navigation
    const now = Date.now();
    if (now - lastNavigationTime < NAVIGATION_COOLDOWN) {
        console.log('navigation too fast, ignoring');
        return false;
    }
    
    isTransitioning = true;
    lastNavigationTime = now;
    
    const mainContainer = document.querySelector('main');
    if (!mainContainer) {
        isTransitioning = false;
        return false;
    }
    
    // get current height
    const currentHeight = getCurrentHeight(mainContainer);
    mainContainer.style.minHeight = currentHeight + 'px';
    
    try {
        // load page data from cache or fetch
        const pageData = await window.Cache.loadPageData(pageId, url);
        if (!pageData) {
            console.error('Failed to load page data');
            isTransitioning = false;
            return false;
        }
        
        // ensure css is loaded
        window.Cache.ensureCSSLoaded(pageData.cssFiles);
        
        // create new content
        const newContent = createAnimatedContent(pageData.mainHtml, currentHeight, direction);
        
        // animate out old content
        const exitingContent = animateOut(mainContainer, direction);
        mainContainer.innerHTML = '';
        mainContainer.appendChild(exitingContent);
        
        // wait for exit animation
        await new Promise(resolve => setTimeout(resolve, 450));
        
        // swap content
        mainContainer.innerHTML = '';
        if (newContent) mainContainer.appendChild(newContent);
        
        // update ui without page refresh
        window.Router.updateHeaderContent(pageData.headerTitle);
        window.Router.updatePageTitle(pageId);
        window.Router.updateUrl(pageId);  // This uses pushState, not page reload
        window.Router.updateActiveNav(pageId);
        
        // clean up heights
        mainContainer.style.minHeight = '';
        if (newContent) newContent.style.minHeight = '';
        
        // reinitialize scripts for the new page
        await window.ScriptLoader.reinitialize(pageId, pageData.jsFiles);
        
        // wait for entrance animation
        await new Promise(resolve => setTimeout(resolve, 450));
        if (newContent) newContent.style.animation = '';
        
        // trigger resize for footer
        window.dispatchEvent(new Event('resize'));
        
    } catch (error) {
        console.error('transition error:', error);
        isTransitioning = false;
        return false;
    }
    
    currentPage = pageId;
    isTransitioning = false;
    return true;
}

// ============================================================
// navigate to page
// ============================================================
async function navigateTo(targetPage, url) {
    // don't navigate to same page
    if (currentPage === targetPage) return;
    
    // don't navigate if transitioning
    if (isTransitioning) return;
    
    const direction = window.Router.getTransitionDirection(currentPage, targetPage);
    await transitionTo(targetPage, url, direction);
    currentPage = targetPage;
}

// ============================================================
// get current page
// ============================================================
function getCurrentPage() {
    return currentPage;
}

// ============================================================
// set current page (for initialization)
// ============================================================
function setCurrentPage(pageId) {
    currentPage = pageId;
}

// expose globally
window.Transitions = {
    navigateTo,
    getCurrentPage,
    setCurrentPage,
    isTransitioning: () => isTransitioning
};