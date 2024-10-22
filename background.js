// Array to store events
let eventLog = [];

// Helper function to push events to the eventLog
function pushEvent(activity_name, domain) {
  eventLog.push({
    timestamp: new Date().toISOString(),
    activity_name: activity_name,
    domain: domain
  });
}

// Tab Events
chrome.tabs.onCreated.addListener((tab) => {
  chrome.tabs.get(tab.id, (tabInfo) => {
    pushEvent("tabOpen", tabInfo.url);
  });
});

chrome.tabs.onActivated.addListener((activeInfo) => {
  chrome.tabs.get(activeInfo.tabId, (tabInfo) => {
    pushEvent("tabSwitch", tabInfo.url);
  });
});

chrome.tabs.onRemoved.addListener((tabId, removeInfo) => {
  let removedIds = concat("|| tabId closed: ", tabId, " and windowId closed: ", removeInfo.windowId, " ||");
  console.log(removedIds);
  pushEvent("tabClosed", removedIds); //tab url needs to be added here instead of tabId
});

// Handle long-lived connections from content script
chrome.runtime.onConnect.addListener((port) => {
  console.assert(port.name === "myPort");
  port.onMessage.addListener((message) => {
    if (message.activity_name) {
      pushEvent(message.activity_name, message.domain);
    }
  });
});

// Expose the eventLog if requested
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === "getEventLog") {
    sendResponse(eventLog);
  }
});

function getEventLog() {
  // Example function to get event log
  return eventLog;
}