// ============================================================
// BREACH DATA SERVICE
// Centralized service for breach data operations
// Provides filtering, caching, and utility functions
// ============================================================
import { getBreaches } from "./fetchBreaches.js";

let cachedData = null;

// ============================================================
// Load and Cache Data
// ============================================================
export async function loadBreachData() {
    if (!cachedData) {
        cachedData = await getBreaches();
    }
    return cachedData;
}

// ============================================================
// Filter Functions
// ============================================================
export function filterByCompany(data, query) {
    if (!query) return data;
    return data.filter(item => 
        item.company.toLowerCase().includes(query.toLowerCase())
    );
}

export function filterByYear(data, year) {
    if (year === 'all') return data;
    return data.filter(item => item.year.toString() === year);
}

// ============================================================
// Utility Functions
// ============================================================
export function getUniqueYears(data) {
    const years = new Set(data.map(item => item.year));
    return Array.from(years).sort().reverse();
}

export function getTotalRecords(data) {
    return data.reduce((total, item) => {
        const num = parseInt(item.records) || 0;
        return total + num;
    }, 0);
}