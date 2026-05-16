// ============================================================
// NEWSLETTER HANDLER
// Handles newsletter subscription with themed alerts
// ============================================================

// ============================================================
// validate email format
// ============================================================
function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

// ============================================================
// show success message
// ============================================================
function showSuccess(email) {
    if (typeof window.showSuccessAlert === 'function') {
        window.showSuccessAlert('subscription confirmed', `security alerts will be sent to ${email}`);
    } else {
        alert(`thank you for subscribing! security alerts will be sent to ${email}`);
    }
}

// ============================================================
// show error message
// ============================================================
function showError() {
    if (typeof window.showWarningAlert === 'function') {
        window.showWarningAlert('invalid email', 'please enter a valid email address (e.g., name@example.com)');
    } else {
        alert('please enter a valid email address');
    }
}

// ============================================================
// initialize newsletter form
// ============================================================
function initNewsletter() {
    console.log('initializing newsletter...');
    
    const newsletterForm = document.getElementById('newsletterForm');
    if (!newsletterForm) {
        console.log('newsletter form not found');
        return;
    }
    
    // remove existing listener if any (clone and replace to avoid duplicates)
    const newForm = newsletterForm.cloneNode(true);
    newsletterForm.parentNode.replaceChild(newForm, newsletterForm);
    
    newForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const emailInput = newForm.querySelector('input[type="email"]');
        const email = emailInput.value.trim();
        
        if (isValidEmail(email)) {
            showSuccess(email);
            newForm.reset();
        } else {
            showError();
        }
    });
    
    console.log('newsletter initialized');
}

// ============================================================
// make init function global for spa reinitialization
// ============================================================
window.initNewsletter = initNewsletter;

// ============================================================
// auto-initialize when DOM is ready
// ============================================================
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initNewsletter);
} else {
    initNewsletter();
}