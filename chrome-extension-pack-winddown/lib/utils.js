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
export const recordTime = async (activeDomain, lastActiveTime, siteUsage) => {
    if (!activeDomain || !lastActiveTime) return;

    const now = Date.now();
    const today = new Date().toISOString().slice(0, 10); // "YYYY-MM-DD"
    console.log(siteUsage); //Debugging

    // Get lastTrackedDate from storage
    const { lastTrackedDate } = await chrome.storage.local.get("lastTrackedDate");

    // Reset if new day
    if (lastTrackedDate !== today) {
        siteUsage = {}; // clear usage
        await chrome.storage.local.set({ siteUsage, lastTrackedDate: today });
        console.log("New day detected");
    }

    // Record elapsed time
    const elapsed = now - lastActiveTime;
    if (!siteUsage[activeDomain]) siteUsage[activeDomain] = 0;
    siteUsage[activeDomain] += elapsed;

    // Save updated usage
    await chrome.storage.local.set({ siteUsage });
    console.log(`${activeDomain} → ${Math.round(siteUsage[activeDomain] / 1000)}s`);
};