
//Event listener for activating it.
window.addEventListener("message", (event) => {
  if (event.source !== window) return; // Only accept from same window
  if (event.data.type === "START_TRACKING") {
    chrome.runtime.sendMessage({ action: "START_TRACKING" });
  }
  if (event.data.type === "STOP_TRACKING") {
    chrome.runtime.sendMessage({ action: "STOP_TRACKING" });
  }
});


