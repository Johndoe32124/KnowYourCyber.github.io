// ============================================================
// GLOBAL THEMED ALERT SYSTEM
// Cyber-styled custom alerts
// ============================================================

// ============================================================
// helper: escape html to prevent injection
// ============================================================
function escapeHtml(str) {
    if (!str) return '';
    return str.replace(/[&<>]/g, function(m) {
        if (m === '&') return '&amp;';
        if (m === '<') return '&lt;';
        if (m === '>') return '&gt;';
        return m;
    });
}

// ============================================================
// show a themed alert
// ============================================================
window.showCyberAlert = function(title, message, steps = [], showCloseButton = true) {
    // remove any existing alert
    const existingOverlay = document.querySelector('.cyber-alert-overlay');
    if (existingOverlay) {
        existingOverlay.remove();
    }
    
    // create overlay
    const overlay = document.createElement('div');
    overlay.className = 'cyber-alert-overlay';
    
    // create alert box
    const alertBox = document.createElement('div');
    alertBox.className = 'cyber-alert';
    
    // close button (x)
    if (showCloseButton) {
        const closeBtn = document.createElement('button');
        closeBtn.className = 'cyber-alert-close';
        closeBtn.innerHTML = '×';
        closeBtn.onclick = () => overlay.remove();
        alertBox.appendChild(closeBtn);
    }
    
    // header
    const header = document.createElement('div');
    header.className = 'cyber-alert-header';
    header.innerHTML = `
        <div class="cyber-alert-icon">🛡️</div>
        <h3 class="cyber-alert-title">${escapeHtml(title)}</h3>
    `;
    alertBox.appendChild(header);
    
    // content
    const content = document.createElement('div');
    content.className = 'cyber-alert-content';
    
    // message
    if (message) {
        const messageEl = document.createElement('p');
        messageEl.className = 'cyber-alert-message';
        messageEl.innerHTML = escapeHtml(message);
        content.appendChild(messageEl);
    }
    
    // steps
    if (steps && steps.length > 0) {
        const stepsList = document.createElement('ul');
        stepsList.className = 'cyber-alert-steps';
        steps.forEach(step => {
            const li = document.createElement('li');
            li.innerHTML = escapeHtml(step);
            stepsList.appendChild(li);
        });
        content.appendChild(stepsList);
    }
    
    alertBox.appendChild(content);
    
    // buttons
    const buttons = document.createElement('div');
    buttons.className = 'cyber-alert-buttons';
    
    const okBtn = document.createElement('button');
    okBtn.className = 'cyber-alert-btn cyber-alert-btn-primary';
    okBtn.textContent = 'Got it';
    okBtn.onclick = () => overlay.remove();
    buttons.appendChild(okBtn);
    
    alertBox.appendChild(buttons);
    overlay.appendChild(alertBox);
    document.body.appendChild(overlay);
    
    // close on escape key
    const handleEscape = (e) => {
        if (e.key === 'Escape') {
            overlay.remove();
            document.removeEventListener('keydown', handleEscape);
        }
    };
    document.addEventListener('keydown', handleEscape);
};

// ============================================================
// quick alert presets
// ============================================================
window.showInfoAlert = function(title, message) {
    window.showCyberAlert(title, message, [], true);
};

window.showWarningAlert = function(title, message) {
    window.showCyberAlert(`⚠️ ${title}`, message, [], true);
};

window.showSuccessAlert = function(title, message) {
    window.showCyberAlert(`✓ ${title}`, message, [], true);
};

window.showStepsAlert = function(title, steps) {
    window.showCyberAlert(title, 'follow these steps:', steps, true);
};

console.log('global alert system initialized');