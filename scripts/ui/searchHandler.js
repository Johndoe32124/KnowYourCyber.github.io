// ============================================================
// SEARCH HANDLER
// Sets up live search functionality for the database page
// ============================================================

export function setupSearch(data, renderFn) {
    const searchInput = document.getElementById("search");
    const noResults = document.getElementById("no-results");
    
    if (!searchInput) return;
    
    searchInput.addEventListener("input", () => {
        const query = searchInput.value.toLowerCase();
        const filtered = data.filter(item =>
            item.company.toLowerCase().includes(query)
        );
        
        renderFn(filtered);
        
        if (noResults) {
            if (filtered.length === 0) {
                noResults.classList.remove("hidden");
            } else {
                noResults.classList.add("hidden");
            }
        }
    });
}