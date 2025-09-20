//Function imports
import { getDomain, recordTime, isAllowed } from "./lib/utils.js";


// Object to hold usage stats
let siteUsage = {};
let activeTabId = null;
let activeDomain = null;
let lastActiveTime = null;
let trackingEnabled = false;

// Function to send usage to Node.js server
const sendUsageToServer = async (siteUsage) => {
    try {
        const response = await fetch('http://localhost:44223/api/usage', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(siteUsage)
        });
        const result = await response.json();
        console.log('Server responded:', result); // ✅ logs { status: 'ok' }
    } catch (err) {
        console.error('Failed to send usage:', err);
    }
};

// Periodic saving every 10s
setInterval(() => {
    // Save locally first
    recordTime(activeDomain, lastActiveTime, siteUsage);
    chrome.storage.local.set({ siteUsage });

    // Send data to server
    sendUsageToServer(siteUsage);
}, 10000); // every 10s

// When any navigation starts
chrome.webNavigation.onBeforeNavigate.addListener((details) => {
    const url = details.url;

    // Ignore Chrome internal pages (extensions://, chrome://)
    if (
        url.startsWith("chrome://") ||
        url.startsWith("chrome-extension://") ||
        url === "about:blank" ||
        url === "chrome://newtab/"
    ) {
        return;
    }

    //Only block when enabled for the msg 
    if (trackingEnabled && !isAllowed(url)) {
        console.log(trackingEnabled);
        chrome.tabs.update(details.tabId, {
            url: chrome.runtime.getURL("./public/blocked.html")
        });
    }
});

chrome.runtime.onMessage.addListener((msg, sender, sendResponse) => {
    if (msg.action === "SLEEPWELL_START_BLOCKING") {
        trackingEnabled = true;
        console.log("Tracking enabled!");
    }
    if (msg.action === "SLEEPWELL_STOP_BLOCKING") {
        trackingEnabled = false;
        console.log("Tracking disabled!");
    }
});


// When tab is activated
chrome.tabs.onActivated.addListener(async (activeInfo) => {
    recordTime(activeDomain, lastActiveTime, siteUsage); // save time spent on previous domain
    try {
        const tab = await chrome.tabs.get(activeInfo.tabId);
        activeDomain = getDomain(tab.url);
        activeTabId = activeInfo.tabId;
        lastActiveTime = Date.now();
    } catch (e) {
        console.warn("Failed to get tab:", e);
    }
});

// When tab updates (URL changes)
chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
    if (tabId === activeTabId && changeInfo.url) {
        recordTime(activeDomain, lastActiveTime, siteUsage);
        activeDomain = getDomain(changeInfo.url);
        lastActiveTime = Date.now();
    }
});

// When window focus changes
chrome.windows.onFocusChanged.addListener((windowId) => {
    recordTime(activeDomain, lastActiveTime, siteUsage);
    if (windowId === chrome.windows.WINDOW_ID_NONE) {
        activeDomain = null; // user left Chrome
    } else {
        lastActiveTime = Date.now();
    }
});