// ============================================================
// RENDER BREACHES UI
// Dynamically generates breach cards from the data array
// ============================================================

export function renderBreaches(data) {
    const container = document.getElementById("results");
    if (!container) return;
    
    container.innerHTML = "";
    
    data.forEach(item => {
        const card = document.createElement("div");
        card.classList.add("card");
        card.innerHTML = `
            <h3>${escapeHtml(item.company)}</h3>
            <p><strong>Year:</strong> ${item.year}</p>
            <p><strong>Records:</strong> ${item.records}</p>
            <p><strong>Type:</strong> ${escapeHtml(item.type)}</p>
            <p><strong>Summary:</strong> ${escapeHtml(item.summary)}</p>
        `;
        container.appendChild(card);
    });
}

// ============================================================
// Helper: Escape HTML to prevent XSS
// ============================================================
function escapeHtml(str) {
    return str.replace(/[&<>]/g, function(m) {
        if (m === '&') return '&amp;';
        if (m === '<') return '&lt;';
        if (m === '>') return '&gt;';
        return m;
    });
}