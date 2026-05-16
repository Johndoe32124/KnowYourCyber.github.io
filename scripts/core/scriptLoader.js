// ============================================================
// SCRIPT LOADER
// handles dynamic script loading and reinitialization
// ============================================================

// track loaded scripts
const loadedScripts = new Set();

// store original script content for re-execution
const scriptCache = new Map();

// ============================================================
// remove all dynamic page scripts
// ============================================================
function removeDynamicScripts() {
    const dynamicScripts = document.querySelectorAll('.dynamic-script');
    dynamicScripts.forEach(script => script.remove());
}

// ============================================================
// reset all initialization flags
// ============================================================
function resetInitFlags() {
    window.databaseInitialized = false;
    window.databaseMainInitialized = false;
    window.databaseAnimationsInitialized = false;
    window.homeAnimationsInitialized = false;
    window.homeInitialized = false;
    window.adviceInitialized = false;
    window.adviceAnimationsInitialized = false;
    window.dbDataLoaded = false;
    window.dbFiltersSetup = false;
    window.isSPA = false;
}

// ============================================================
// load scripts in parallel
// ============================================================
async function loadScripts(jsFiles) {
    const promises = jsFiles.map(src => {
        return new Promise((resolve) => {
            // check if it's a script we need to reload
            const isPageScript = src.includes('homeAnimations') || 
                                 src.includes('databaseAnimations') || 
                                 src.includes('adviceAnimations') ||
                                 src.includes('adviceLinks') ||
                                 src.includes('renderBreaches') ||
                                 src.includes('searchHandler') ||
                                 src.includes('databaseMain') ||
                                 src.includes('globalAlert') ||
                                 src.includes('newsletter');
            
            // for page-specific scripts, always reload
            if (isPageScript) {
                // remove if exists
                const existing = document.querySelector(`script[src="${src}"]`);
                if (existing) existing.remove();
            }
            
            const script = document.createElement('script');
            script.src = src;
            script.classList.add('dynamic-script');
            
            if (src.includes('main.js') || src.includes('databaseMain')) {
                script.type = 'module';
            }
            
            script.onload = () => {
                console.log(`✓ loaded: ${src}`);
                resolve();
            };
            script.onerror = () => {
                console.warn(`⚠ failed: ${src}`);
                resolve();
            };
            
            document.body.appendChild(script);
        });
    });
    
    await Promise.all(promises);
    await new Promise(resolve => setTimeout(resolve, 200));
}

// ============================================================
// manually trigger page-specific initialization
// ============================================================
function triggerPageInit(pageId) {
    console.log(`triggering page init for: ${pageId}`);
    
    // HOME PAGE - should be first
    if (pageId === 'home') {
        setTimeout(() => {
            if (typeof window.initHomeAnimations === 'function') {
                window.initHomeAnimations();
            }
            // reinitialize newsletter if it exists
            if (typeof window.initNewsletter === 'function') {
                window.initNewsletter();
            }
        }, 150);
    } 
    // DATABASE PAGE
    else if (pageId === 'database') {
        setTimeout(() => {
            // re-run database initialization
            if (typeof window.initDatabase === 'function') {
                window.initDatabase();
            }
            // re-run card effects
            if (typeof window.setupDatabaseCardEffects === 'function') {
                window.setupDatabaseCardEffects();
            }
            if (typeof window.animateCardEntrance === 'function') {
                window.animateCardEntrance();
            }
            // re-run database animations
            if (typeof window.initDatabaseAnimations === 'function') {
                window.initDatabaseAnimations();
            }
            // re-trigger the module if it exists
            const moduleEvent = new Event('database-reload');
            window.dispatchEvent(moduleEvent);
        }, 150);
    } 
    // ADVICE PAGE
    else if (pageId === 'advice') {
        setTimeout(() => {
            if (typeof window.initAdviceAnimations === 'function') {
                window.initAdviceAnimations();
            }
            if (typeof window.initAdviceLinks === 'function') {
                window.initAdviceLinks();
            }
            // re-run individual advice functions if needed
            if (typeof window.setupFAQAccordion === 'function') {
                window.setupFAQAccordion();
            }
            if (typeof window.setupStepScrollAnimation === 'function') {
                window.setupStepScrollAnimation();
            }
            if (typeof window.setupResourceCardEffects === 'function') {
                window.setupResourceCardEffects();
            }
            if (typeof window.setupVideoHover === 'function') {
                window.setupVideoHover();
            }
            if (typeof window.setupScrollRevealAdvice === 'function') {
                window.setupScrollRevealAdvice();
            }
        }, 150);
    }
}

// ============================================================
// reinitialize page scripts
// ============================================================
async function reinitialize(pageId, jsFiles) {
    console.log(`reinitializing page: ${pageId}`);
    
    // remove old dynamic scripts
    removeDynamicScripts();
    
    // reset all initialization flags
    resetInitFlags();
    
    // load fresh scripts
    await loadScripts(jsFiles);
    
    // trigger domcontentloaded event
    const domEvent = new Event('DOMContentLoaded');
    document.dispatchEvent(domEvent);
    
    // trigger page-specific init
    triggerPageInit(pageId);
    
    console.log(`reinitialization complete for: ${pageId}`);
}

// ============================================================
// force re-initialize current page
// ============================================================
function forceReinitialize(pageId) {
    console.log(`force reinitializing: ${pageId}`);
    triggerPageInit(pageId);
}

// ============================================================
// preload critical scripts
// ============================================================
function preloadCriticalScripts() {
    const criticalScripts = [
        '../scripts/ui/globalAlert.js'
    ];
    
    criticalScripts.forEach(src => {
        if (!loadedScripts.has(src)) {
            const link = document.createElement('link');
            link.rel = 'preload';
            link.as = 'script';
            link.href = src;
            document.head.appendChild(link);
        }
    });
}

// expose globally
window.ScriptLoader = {
    reinitialize,
    removeDynamicScripts,
    resetInitFlags,
    forceReinitialize,
    preloadCriticalScripts
};