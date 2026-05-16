// ============================================================
// ADVICE PAGE LINK HANDLER
// Makes all interactive links and buttons work properly
// Uses global themed alert system
// ============================================================

// make init function global for spa
window.initAdviceLinks = initAdviceLinks;

// ============================================================
// initialize all advice page links
// ============================================================
function initAdviceLinks() {
    console.log('initializing advice page links...');
    
    // wait for global alert to be ready
    if (typeof window.showStepsAlert !== 'function') {
        console.log('waiting for global alert system...');
        setTimeout(() => initAdviceLinks(), 100);
        return;
    }
    
    // ============================================================
    // TIP BUTTON ACTIONS
    // ============================================================
    
    // password manager button
    const passwordManagerBtn = document.querySelector('[data-action="password-manager"]');
    if (passwordManagerBtn) {
        const newBtn = passwordManagerBtn.cloneNode(true);
        passwordManagerBtn.parentNode.replaceChild(newBtn, passwordManagerBtn);
        newBtn.addEventListener('click', function(e) {
            e.preventDefault();
            window.open('https://www.nordpass.com', '_blank');
        });
    }

    // two-factor authentication button
    const twoFABtn = document.querySelector('[data-action="2fa"]');
    if (twoFABtn) {
        const newBtn = twoFABtn.cloneNode(true);
        twoFABtn.parentNode.replaceChild(newBtn, twoFABtn);
        newBtn.addEventListener('click', function(e) {
            e.preventDefault();
            window.open('https://www.fortinet.com/resources/cyberglossary/two-factor-authentication', '_blank');
        });
    }

    // check for reused passwords button
    const reusedPassBtn = document.querySelector('[data-action="reused-passwords"]');
    if (reusedPassBtn) {
        const newBtn = reusedPassBtn.cloneNode(true);
        reusedPassBtn.parentNode.replaceChild(newBtn, reusedPassBtn);
        newBtn.addEventListener('click', function(e) {
            e.preventDefault();
            window.open('https://haveibeenpwned.com/Passwords', '_blank');
        });
    }

    // phishing button
    const phishingBtn = document.querySelector('[data-action="phishing"]');
    if (phishingBtn) {
        const newBtn = phishingBtn.cloneNode(true);
        phishingBtn.parentNode.replaceChild(newBtn, phishingBtn);
        newBtn.addEventListener('click', function(e) {
            e.preventDefault();
            window.open('https://www.phishing.org/what-is-phishing', '_blank');
        });
    }

    // account activity button - uses custom themed alert
    const accountActivityBtn = document.querySelector('[data-action="account-activity"]');
    if (accountActivityBtn) {
        const newBtn = accountActivityBtn.cloneNode(true);
        accountActivityBtn.parentNode.replaceChild(newBtn, accountActivityBtn);
        newBtn.addEventListener('click', function(e) {
            e.preventDefault();
            window.showStepsAlert('check your account activity', [
                'go to your account security settings',
                'look for "recent activity" or "login history"',
                'review all devices and locations',
                'sign out of any unrecognized devices',
                'enable login notifications if available'
            ]);
        });
    }

    // backup button
    const backupBtn = document.querySelector('[data-action="backup"]');
    if (backupBtn) {
        const newBtn = backupBtn.cloneNode(true);
        backupBtn.parentNode.replaceChild(newBtn, backupBtn);
        newBtn.addEventListener('click', function(e) {
            e.preventDefault();
            window.open('https://cloudian.com/guides/data-backup/data-backup-in-depth/', '_blank');
        });
    }

    // ============================================================
    // THREAT CARD LEARN MORE LINKS
    // ============================================================
    
    const threats = [
        { selector: '[data-threat="phishing"]', url: 'https://www.cloudflare.com/learning/access-management/phishing-attack/' },
        { selector: '[data-threat="ransomware"]', url: 'https://www.cisa.gov/ransomware' },
        { selector: '[data-threat="trojan"]', url: 'https://www.kaspersky.com/resource-center/threats/trojans' },
        { selector: '[data-threat="credential"]', url: 'https://owasp.org/www-community/attacks/Credential_stuffing' },
        { selector: '[data-threat="mitm"]', url: 'https://www.cloudflare.com/learning/security/threats/man-in-the-middle-attack/' },
        { selector: '[data-threat="sim-swapping"]', url: 'https://www.verizon.com/about/account-security/sim-swapping' }
    ];
    
    threats.forEach(threat => {
        const element = document.querySelector(threat.selector);
        if (element) {
            const newElement = element.cloneNode(true);
            element.parentNode.replaceChild(newElement, element);
            newElement.addEventListener('click', function(e) {
                e.preventDefault();
                window.open(threat.url, '_blank');
            });
        }
    });

    console.log('advice page links initialized');
}

// auto-initialize when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initAdviceLinks);
} else {
    initAdviceLinks();
}