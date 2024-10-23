/*
This is the script that runs in the popup window. 
It communicates with the background script using a port to fetch the event log. 
It also displays the event log in the popup window and provides a button to clear the log.
*/

// Description: This script is executed when the popup is opened
let port = chrome.runtime.connect({ name: "my_Port" });

// Handle disconnection of the port
  port.onDisconnect.addListener(() => {
  console.warn("Port disconnected");
  port = null;
});

// Fetch event log from background script
port.onMessage.addListener((msg) => {
  console.log("Received message from background script:", msg);
  if (msg.eventLog) {
    const eventList = document.getElementById('eventList');
    msg.eventLog.forEach(event => {
      const listItem = document.createElement('li');
      listItem.textContent = `${event.timestamp}: ${event.activity_name} on ${event.domain}`;
      eventList.appendChild(listItem);
    });
  }
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

// Function to send event data through the long-lived connection
function sendEvent(activity_name) {
  if (port) {
    const eventDetails = {
      timestamp: new Date().toISOString(),
      activity_name: activity_name,
      domain: window.location.hostname
    };

    // Send the event details through the long-lived connection
    try {
      port.postMessage(eventDetails);
    } catch (error_message) {
      console.error("Failed to send message:", error_message);
    }
  } else {
    console.error("Port is disconnected");
  }
}

// Add event listeners for mouse clicks, key presses, and scrolling
document.addEventListener('click', () => sendEvent('click'));
document.addEventListener('keyup', () => sendEvent('keyup'));
// document.addEventListener('scroll', () => sendEvent('scroll')); //Removed, because it causes too much noise 

console.log("----------------- END OF POPUP.JS -----------------");