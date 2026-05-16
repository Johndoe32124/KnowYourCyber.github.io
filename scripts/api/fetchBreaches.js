// ============================================================
// FETCH BREACHES DATA
// Loads breach data from the JSON API with error handling
// ============================================================
import { API_URL } from "./apiConfig.js";

export async function getBreaches() {
    try {
        const response = await fetch(API_URL);
        if (!response.ok) throw new Error("Failed to load API data");
        return await response.json();
    } catch (error) {
        console.error("API Error:", error);
        return [];
    }
}