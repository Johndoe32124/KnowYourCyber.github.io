// ============================================================
// advice page animations
// handles faq accordion, step animations, and 3d card effects
// ============================================================

// make functions global for spa reinitialization
window.setupFAQAccordion = setupFAQAccordion;
window.setupStepScrollAnimation = setupStepScrollAnimation;
window.setupResourceCardEffects = setupResourceCardEffects;
window.setupVideoHover = setupVideoHover;
window.setupScrollRevealAdvice = setupScrollReveal;
window.initAdviceAnimations = initAdviceAnimations;

// track if already initialized to prevent duplicate observers
let stepObserver = null;
let sectionObserver = null;

// ============================================================
// faq accordion functionality
// ============================================================
function setupFAQAccordion() {
    const faqItems = document.querySelectorAll('.faq-item');
    
    if (faqItems.length === 0) return;
    
    // remove any existing listeners to prevent duplicates
    faqItems.forEach(item => {
        const question = item.querySelector('.faq-question');
        if (question.hasAttribute('data-listener')) return;
        question.setAttribute('data-listener', 'true');
        
        question.addEventListener('click', function() {
            const isOpen = item.classList.contains('faq-open');
            // close all other faq items
            faqItems.forEach(faq => faq.classList.remove('faq-open'));
            // toggle current one
            if (!isOpen) item.classList.add('faq-open');
        });
    });
    
    // open first faq by default if none are open
    const anyOpen = Array.from(faqItems).some(item => item.classList.contains('faq-open'));
    if (!anyOpen && faqItems.length > 0) {
        faqItems[0].classList.add('faq-open');
    }
}

// ============================================================
// step scroll animation
// ============================================================
function setupStepScrollAnimation() {
    const steps = document.querySelectorAll('.step');
    if (steps.length === 0) return;
    
    // disconnect old observer if exists
    if (stepObserver) {
        stepObserver.disconnect();
    }
    
    // reset any existing classes
    steps.forEach(step => {
        step.classList.remove('step-visible', 'step-hidden');
        step.classList.add('step-hidden');
    });
    
    stepObserver = new IntersectionObserver((entries) => {
        entries.forEach((entry, index) => {
            if (entry.isIntersecting) {
                setTimeout(() => entry.target.classList.add('step-visible'), index * 100);
                stepObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.3 });
    
    steps.forEach(step => stepObserver.observe(step));
}

// ============================================================
// resource card 3d effects
// ============================================================
function setupResourceCardEffects() {
    const cards = document.querySelectorAll('.resource-card, .tip-card, .threat-card');
    
    cards.forEach(card => {
        // skip if already has listener
        if (card.hasAttribute('data-3d-listener')) return;
        card.setAttribute('data-3d-listener', 'true');
        
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            const rotateX = (y - centerY) / 25;
            const rotateY = (centerX - x) / 25;
            card.style.transform = `perspective(800px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-5px)`;
        });
        
        card.addEventListener('mouseleave', () => {
            card.style.transform = 'perspective(800px) rotateX(0deg) rotateY(0deg) translateY(0)';
        });
    });
}

// ============================================================
// video hover effect
// ============================================================
function setupVideoHover() {
    const videoWrapper = document.querySelector('.video-wrapper');
    if (!videoWrapper) return;
    
    // skip if already has listener
    if (videoWrapper.hasAttribute('data-video-listener')) return;
    videoWrapper.setAttribute('data-video-listener', 'true');
    
    videoWrapper.addEventListener('mouseenter', () => {
        videoWrapper.style.transform = 'scale(1.02)';
        videoWrapper.style.boxShadow = '0 20px 40px rgba(0, 208, 255, 0.25)';
        videoWrapper.style.transition = 'all 0.3s ease';
    });
    
    videoWrapper.addEventListener('mouseleave', () => {
        videoWrapper.style.transform = 'scale(1)';
        videoWrapper.style.boxShadow = 'none';
    });
}

// ============================================================
// scroll reveal for sections
// ============================================================
function setupScrollReveal() {
    const sections = document.querySelectorAll('.tips-grid-section, .emergency-section, .video-section, .threats-section, .resources-section, .faq-section');
    if (sections.length === 0) return;
    
    // disconnect old observer if exists
    if (sectionObserver) {
        sectionObserver.disconnect();
    }
    
    // reset visibility
    sections.forEach(section => {
        section.classList.remove('section-visible', 'section-hidden');
        section.classList.add('section-hidden');
    });
    
    sectionObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('section-visible');
                sectionObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.2 });
    
    sections.forEach(section => sectionObserver.observe(section));
}

// ============================================================
// force reattach all animations
// ============================================================
function forceReattachAnimations() {
    console.log('force reattaching advice animations...');
    
    // reset all listener flags to force reattachment
    const allCards = document.querySelectorAll('.resource-card, .tip-card, .threat-card');
    allCards.forEach(card => {
        card.removeAttribute('data-3d-listener');
    });
    
    const videoWrapper = document.querySelector('.video-wrapper');
    if (videoWrapper) {
        videoWrapper.removeAttribute('data-video-listener');
    }
    
    // re-setup all animations
    setupResourceCardEffects();
    setupVideoHover();
    setupFAQAccordion();
    setupStepScrollAnimation();
    setupScrollReveal();
    
    console.log('advice animations force reattached');
}

// ============================================================
// initialize all advice page animations
// ============================================================
function initAdviceAnimations() {
    console.log('advice animations initializing...');
    setupFAQAccordion();
    setupStepScrollAnimation();
    setupResourceCardEffects();
    setupVideoHover();
    setupScrollReveal();
    console.log('advice animations initialized');
}

// expose force reattach for SPA
window.forceReattachAdviceAnimations = forceReattachAnimations;

// only auto-init if not in spa mode
if (!window.isSPA && document.readyState !== 'loading') {
    initAdviceAnimations();
} else if (!window.isSPA) {
    document.addEventListener('DOMContentLoaded', initAdviceAnimations);
}