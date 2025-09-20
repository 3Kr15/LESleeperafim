import { ALLOWED_SITES } from "./config.js";

// Helper to extract domain
export const getDomain = (url) => {
    try {
        if (!url.startsWith("http")) {
            return null; // skip chrome://, about:, extension://, etc.
        }
        return new URL(url).hostname;
    } catch {
        return null;
    }
};

// Helper function for determine true/false for access
export const isAllowed = (url) => {
    try {
        const domain = new URL(url).hostname.toLowerCase();
        return ALLOWED_SITES.some(allowed => new RegExp(`(^|\\.)${allowed}$`).test(domain));
    } catch {
        return false;
    }
};


// Helper function to save elapsed time
export const recordTime = (activeDomain, lastActiveTime, siteUsage) => {
    if (activeDomain && lastActiveTime) {
        const now = Date.now();
        const elapsed = now - lastActiveTime;
        if (!siteUsage[activeDomain]) siteUsage[activeDomain] = 0;
        siteUsage[activeDomain] += elapsed;
        lastActiveTime = now;

        chrome.storage.local.set({ siteUsage });
        console.log(`${activeDomain} → ${siteUsage[activeDomain] / 1000}s`);
    }
}