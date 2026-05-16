// ============================================================
// DATABASE MAIN ENTRY POINT
// handles data loading, filtering, and search functionality
// ============================================================
import { getBreaches } from './fetchBreaches.js';
import { renderBreaches } from '../ui/renderBreaches.js';
import { setupSearch } from '../ui/searchHandler.js';

let currentData = [];
let currentFilter = 'all';

// ============================================================
// get unique years from data and sort descending
// ============================================================
function getUniqueYears(data) {
    const years = new Set();
    data.forEach(item => {
        if (item.year) {
            years.add(item.year);
        }
    });
    return Array.from(years).sort((a, b) => b - a);
}

// ============================================================
// dynamically generate year filter buttons
// ============================================================
function generateYearFilters(data) {
    const container = document.getElementById('yearFilters');
    if (!container) return;
    
    const years = getUniqueYears(data);
    
    let html = '<button class="filter-btn active" data-filter="all">All</button>';
    
    years.forEach(year => {
        html += `<button class="filter-btn" data-filter="${year}">${year}</button>`;
    });
    
    container.innerHTML = html;
    attachFilterEvents(data);
}

// ============================================================
// attach event listeners to filter buttons
// ============================================================
function attachFilterEvents(data) {
    const filterButtons = document.querySelectorAll('.filter-btn');
    
    function handleFilterClick(e) {
        const btn = e.currentTarget;
        filterButtons.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        currentFilter = btn.getAttribute('data-filter');
        applyFiltersAndSearch(data);
        
        // clear year input when clicking filter buttons
        const yearInput = document.getElementById('yearInput');
        const clearYearBtn = document.getElementById('clearYearBtn');
        if (yearInput) yearInput.value = '';
        if (clearYearBtn) clearYearBtn.classList.add('hidden');
    }
    
    filterButtons.forEach(btn => {
        btn.removeEventListener('click', handleFilterClick);
        btn.addEventListener('click', handleFilterClick);
    });
}

// ============================================================
// setup year input search
// ============================================================
function setupYearInput(data) {
    const yearInput = document.getElementById('yearInput');
    const yearGoBtn = document.getElementById('yearGoBtn');
    const clearYearBtn = document.getElementById('clearYearBtn');
    
    if (!yearInput || !yearGoBtn) return;
    
    // remove existing listeners by replacing with new elements
    const newYearInput = document.createElement('input');
    newYearInput.type = 'number';
    newYearInput.id = 'yearInput';
    newYearInput.placeholder = 'e.g., 2021';
    newYearInput.min = '2000';
    newYearInput.max = '2030';
    newYearInput.value = yearInput.value;
    newYearInput.className = yearInput.className;
    yearInput.parentNode.replaceChild(newYearInput, yearInput);
    
    const newYearGoBtn = document.createElement('button');
    newYearGoBtn.id = 'yearGoBtn';
    newYearGoBtn.className = 'cyber-btn small';
    newYearGoBtn.textContent = 'Go';
    yearGoBtn.parentNode.replaceChild(newYearGoBtn, yearGoBtn);
    
    // go button click
    newYearGoBtn.addEventListener('click', function() {
        const year = newYearInput.value.trim();
        
        if (year && /^\d{4}$/.test(year)) {
            const filterButtons = document.querySelectorAll('.filter-btn');
            filterButtons.forEach(btn => btn.classList.remove('active'));
            
            currentFilter = year;
            applyFiltersAndSearch(data);
            
            if (clearYearBtn) {
                clearYearBtn.classList.remove('hidden');
            }
        } else if (year) {
            if (typeof window.showWarningAlert === 'function') {
                window.showWarningAlert('invalid year', 'please enter a valid 4-digit year (e.g., 2021)');
            } else {
                alert('please enter a valid 4-digit year');
            }
        }
    });
    
    // enter key
    newYearInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            newYearGoBtn.click();
        }
    });
    
    // clear button
    if (clearYearBtn) {
        const newClearYearBtn = clearYearBtn.cloneNode(true);
        clearYearBtn.parentNode.replaceChild(newClearYearBtn, clearYearBtn);
        
        newClearYearBtn.addEventListener('click', function() {
            newYearInput.value = '';
            newClearYearBtn.classList.add('hidden');
            
            const allBtn = document.querySelector('.filter-btn[data-filter="all"]');
            if (allBtn) {
                allBtn.click();
            }
        });
    }
}

// ============================================================
// update last updated date automatically
// ============================================================
function updateLastUpdated() {
    const lastUpdatedElement = document.getElementById('last-updated');
    if (!lastUpdatedElement) return;
    
    const now = new Date();
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    const formattedDate = now.toLocaleDateString('en-US', options);
    lastUpdatedElement.textContent = formattedDate;
}

// ============================================================
// loading indicator helpers
// ============================================================
function showLoading(show) {
    const indicator = document.getElementById('loading-indicator');
    if (indicator) {
        if (show) indicator.classList.remove('hidden');
        else indicator.classList.add('hidden');
    }
}

function updateTotalCount(count) {
    const totalElement = document.getElementById('total-count');
    if (totalElement) totalElement.textContent = count;
}

// ============================================================
// apply filters and search
// ============================================================
function applyFiltersAndSearch(data) {
    const searchInput = document.getElementById('search');
    const query = searchInput ? searchInput.value.toLowerCase() : '';
    const noResults = document.getElementById('no-results');
    const clearYearBtn = document.getElementById('clearYearBtn');
    
    let filtered = [...data];
    
    // apply year filter
    if (currentFilter !== 'all') {
        filtered = filtered.filter(item => item.year.toString() === currentFilter);
        if (clearYearBtn && currentFilter !== 'all') {
            clearYearBtn.classList.remove('hidden');
        } else if (clearYearBtn) {
            clearYearBtn.classList.add('hidden');
        }
    } else {
        if (clearYearBtn) clearYearBtn.classList.add('hidden');
    }
    
    // apply search filter
    if (query) {
        filtered = filtered.filter(item => item.company.toLowerCase().includes(query));
    }
    
    // render results
    renderBreaches(filtered);
    
    // show/hide no results with animation
    if (noResults) {
        if (filtered.length === 0) {
            noResults.classList.remove('hidden');
            noResults.classList.add('visible');
        } else {
            noResults.classList.remove('visible');
            noResults.classList.add('hidden');
        }
    }
}

// ============================================================
// handle search input
// ============================================================
function setupSearchHandler(data) {
    const searchInput = document.getElementById('search');
    if (!searchInput) return;
    
    // remove existing listener
    const newSearchInput = searchInput.cloneNode(true);
    searchInput.parentNode.replaceChild(newSearchInput, searchInput);
    
    newSearchInput.addEventListener('input', () => {
        applyFiltersAndSearch(data);
    });
}

// ============================================================
// setup reset button
// ============================================================
function setupResetButton(data) {
    const resetBtn = document.getElementById('resetSearch');
    if (!resetBtn) return;
    
    const newResetBtn = resetBtn.cloneNode(true);
    resetBtn.parentNode.replaceChild(newResetBtn, resetBtn);
    
    newResetBtn.addEventListener('click', () => {
        // clear search
        const searchInput = document.getElementById('search');
        if (searchInput) searchInput.value = '';
        
        // clear year input
        const yearInput = document.getElementById('yearInput');
        if (yearInput) yearInput.value = '';
        
        // reset to all filter
        const allBtn = document.querySelector('.filter-btn[data-filter="all"]');
        if (allBtn) allBtn.click();
        
        // clear clear button
        const clearYearBtn = document.getElementById('clearYearBtn');
        if (clearYearBtn) clearYearBtn.classList.add('hidden');
        
        applyFiltersAndSearch(data);
    });
}

// ============================================================
// setup clear search button
// ============================================================
function setupClearSearchButton(data) {
    const clearBtn = document.getElementById('clearSearch');
    const searchInput = document.getElementById('search');
    if (!clearBtn || !searchInput) return;
    
    const newClearBtn = clearBtn.cloneNode(true);
    clearBtn.parentNode.replaceChild(newClearBtn, clearBtn);
    
    newClearBtn.addEventListener('click', () => {
        searchInput.value = '';
        newClearBtn.classList.add('hidden');
        applyFiltersAndSearch(data);
    });
    
    searchInput.addEventListener('input', () => {
        if (searchInput.value.length > 0) {
            newClearBtn.classList.remove('hidden');
        } else {
            newClearBtn.classList.add('hidden');
        }
    });
}

// ============================================================
// initialize database page
// ============================================================
async function init() {
    console.log('database initializing...');
    showLoading(true);
    
    // update last updated date automatically
    updateLastUpdated();
    
    const data = await getBreaches();
    currentData = data;
    updateTotalCount(data.length);
    
    // initial render
    renderBreaches(data);
    
    // setup all handlers
    generateYearFilters(data);
    setupYearInput(data);
    setupSearchHandler(data);
    setupResetButton(data);
    setupClearSearchButton(data);
    
    showLoading(false);
    console.log('database initialized');
}

// make init available globally for spa transitions
window.initDatabase = init;

// initialize
init();