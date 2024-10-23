/*
  This file is responsible for handling the background tasks of the extension.
*/

// Array to store events
let eventLog = [];
// Array to store user history
let userhistory = [];

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
    if (message.action === "getEventLog" && port.name === "my_Port"){
      if (message.activity_name) {
        pushEvent(message.activity_name, message.domain);
      }
    }
  });
});

// Handle messages from the popup
chrome.runtime.onMessage.addListener((request, sendResponse) => {
  if (request.action === "getEventLog") {
    printEventLog();
    sendResponse(eventLog);
  } else if (request.action === "getLastHourEvents") {
    //printEventLog();
    sendResponse(getLastHourEvents());
  } else if (request.action === "clearEventLog") {
    eventLog = [];
    sendResponse({ status: "Event log cleared" });
  } else if (request.action === "getLastHourHistory") {
    printUserHistory();
    sendResponse(getLastHourEvents());
    getLastHourHistory(sendResponse);
    return true; // Indicate that the response will be sent asynchronously
  }
});

// Function to get browsing history from the last hour
chrome.runtime.sendMessage({ action: "getLastHourHistory" }, (response) => {
  console.log("Browsing history from the last hour:", response);
});

// Function to get events from the last hour
function getLastHourEvents() {
  let oneHourAgo = new Date(Date.now() - 60 * 60 * 1000); // 60s * 60m * 1000ms
  console.log("One hour ago:", oneHourAgo);
  return eventLog.filter(event => new Date(event.timestamp) >= oneHourAgo);
}

// Function to get browsing history from the last hour
function getLastHourHistory(sendResponse) {
  let oneHourAgo = new Date(Date.now() - 60 * 60 * 1000);
  console.log("One hour ago:", oneHourAgo.getTime());
  chrome.history.search({ text: "", startTime: oneHourAgo.getTime() }, (historyItems) => {
    sendResponse(historyItems);
  });
}

function getEventLog() {
  return eventLog;
}

function getUserHistory() {
  return userhistory;
}

function printEventLog() {
  console.log(eventLog);
}

function printUserHistory() {
  console.log(userhistory);
}
console.log("----------------- END OF BACKGROUND.JS -----------------");