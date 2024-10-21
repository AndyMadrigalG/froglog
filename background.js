// Array to store events
const eventLog = [];

// Helper function to log events
function logEvent(activity_name, domain) {
  eventLog.push({
    timestamp: new Date().toISOString(),
    activity_name: activity_name,
    domain: domain
  });
}

// Tab Events
chrome.tabs.onCreated.addListener((tab) => {
  chrome.tabs.get(tab.id, (tabInfo) => {
    logEvent("tabOpen", tabInfo.url);
  });
});

chrome.tabs.onActivated.addListener((activeInfo) => {
  chrome.tabs.get(activeInfo.tabId, (tab) => {
    logEvent("tabSwitch", tab.url);
  });
});

chrome.tabs.onRemoved.addListener((tabId, removeInfo) => {
  logEvent("tabClosed", tab.url);
});

// Handle long-lived connections from content script
chrome.runtime.onConnect.addListener((port) => {
  port.onMessage.addListener((message) => {
    if (message.activity_name) {
      logEvent(message.activity_name, message.domain);
    }
  });
});

// Expose the eventLog if requested
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === "getEventLog") {
    sendResponse(eventLog);
  }
});
