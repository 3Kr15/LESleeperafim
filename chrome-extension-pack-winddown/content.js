
//Event listener for activating it.
window.addEventListener("message", (event) => {
    if (event.source !== window) return; // Only accept messages from same page

    if (event.data.type === "SLEEPWELL_START_BLOCKING") {
        chrome.runtime.sendMessage({ action: "SLEEPWELL_START_BLOCKING" });
    }

    if (event.data.type === "SLEEPWELL_STOP_BLOCKING") {
        chrome.runtime.sendMessage({ action: "SLEEPWELL_STOP_BLOCKING" });
    }
});
