/*
  This file runs in the popup window. It communicates with the background script using a port to fetch the event log. 
  It also displays the event log in the popup window and provides a button to clear the log.
*/

// Description: This script is executed when the popup is opened
let port = chrome.runtime.connect({ name: "my_Port" });

// Handle disconnection of the port
port.onDisconnect.addListener(() => {
  console.warn("Port disconnected");
});

// Fetch events from the last hour
port.postMessage({ action: "getLastHourHistory" }, (response) => {
  console.log("Events from the last hour:", response);
});

// Request the event log from the background script
port.postMessage({ action: "getEventLog" });

// Clear the event log
document.getElementById('clearLogBtn').addEventListener('click', () => {
  port.postMessage({ action: "clearEventLog" });
  location.reload();
});

// Print the browsing history from the last hour
document.getElementById('printHistoryBtn').addEventListener('click', () => {
  console.log("Fetching browsing history from the last hour...");
  port.postMessage({ action: "getLastHourHistory" });
});

// Print the event log
document.getElementById('printLogBtn').addEventListener('click', () => {
  console.log("Fetching event log...");
  port.postMessage({ action: "getEventLog" });
});

console.log("----------------- END OF POPUP.JS -----------------");