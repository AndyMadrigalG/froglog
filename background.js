// Array to store events
let eventLog = [];

// Helper function to push events to the eventLog
function pushEvent(activity_name, domain) {
  json_activity = {
    timestamp: new Date().toISOString(),
    activity_name: activity_name,
    domain: domain
  };
  console.log("||",json_activity,"||"); // Log the event to the console for testing purposes
  eventLog.push(json_activity);
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
  let removedIds = "tabId closed: " + tabId + " and windowId closed: "+ removeInfo.windowId;
  pushEvent("tabClosed", removedIds); // tab url needs to be added here instead of removedIds
});

// Handle long-lived connections from content script
chrome.runtime.onConnect.addListener((port) => {
  port.onMessage.addListener((message) => {
    if (message.action === "getEventLog" && port.name === "myPort"){
      if (message.activity_name) {
        pushEvent(message.activity_name, message.domain);
      }
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
  return eventLog;
}