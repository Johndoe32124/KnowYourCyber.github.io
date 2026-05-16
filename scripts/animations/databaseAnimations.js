// ============================================================
// DATABASE PAGE ANIMATIONS
// Handles 3D card effects and entrance animations
// ============================================================

// make functions global for spa reinitialization
window.setupDatabaseCardEffects = setupDatabaseCardEffects;
window.animateCardEntrance = animateCardEntrance;
window.setupSearchAnimation = setupSearchAnimation;
window.initDatabaseAnimations = initDatabaseAnimations;

// ============================================================
// 3D Tilt Effect for Database Cards
// ============================================================
function setupDatabaseCardEffects() {
    const cards = document.querySelectorAll('.card');
    
    cards.forEach(card => {
        // Skip if already has effect to prevent duplicate listeners
        if (card.hasAttribute('data-effect-initialized')) return;
        card.setAttribute('data-effect-initialized', 'true');
        
        card.style.opacity = '0';
        card.style.transform = 'translateY(30px)';
        
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            const rotateX = (y - centerY) / 20;
            const rotateY = (centerX - x) / 20;
            card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-5px)`;
        });
        
        card.addEventListener('mouseleave', () => {
            card.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) translateY(0)';
        });
    });
}

// ============================================================
// Staggered Entrance Animation for Cards
// ============================================================
function animateCardEntrance() {
    const cards = document.querySelectorAll('.card');
    cards.forEach((card, index) => {
        // Skip if already animated
        if (card.hasAttribute('data-entrance-done')) return;
        card.setAttribute('data-entrance-done', 'true');
        
        setTimeout(() => {
            card.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
            card.style.opacity = '1';
            card.style.transform = 'translateY(0)';
        }, index * 50);
    });
}

// ============================================================
// Search Input Animation
// ============================================================
function setupSearchAnimation() {
    const searchInput = document.getElementById('search');
    if (!searchInput) return;
    
    // Skip if already set up
    if (searchInput.hasAttribute('data-animation-setup')) return;
    searchInput.setAttribute('data-animation-setup', 'true');
    
    searchInput.addEventListener('focus', () => {
        searchInput.style.transform = 'scale(1.01)';
        searchInput.style.transition = 'transform 0.2s ease';
    });
    
    searchInput.addEventListener('blur', () => {
        searchInput.style.transform = 'scale(1)';
    });
}

// ============================================================
// Initialize All Database Animations
// ============================================================
function initDatabaseAnimations() {
    console.log('database animations initializing...');
    
    // Set up search animation
    setupSearchAnimation();
    
    // Watch for new cards being added to the DOM
    const observer = new MutationObserver((mutations, obs) => {
        let hasNewCards = false;
        mutations.forEach((mutation) => {
            if (mutation.addedNodes.length) {
                hasNewCards = true;
            }
        });
        if (hasNewCards) {
            setTimeout(() => {
                setupDatabaseCardEffects();
                animateCardEntrance();
            }, 100);
        }
    });
    
    const resultsContainer = document.getElementById('results');
    if (resultsContainer) {
        observer.observe(resultsContainer, { childList: true, subtree: true });
    }
    
    // Initial setup for existing cards
    setTimeout(() => {
        setupDatabaseCardEffects();
        animateCardEntrance();
    }, 200);
    
    console.log('database animations initialized');
}

// ============================================================
// Auto-initialize on page load
// ============================================================
if (!window.isSPA && document.readyState !== 'loading') {
    initDatabaseAnimations();
} else if (!window.isSPA) {
    document.addEventListener('DOMContentLoaded', initDatabaseAnimations);
}