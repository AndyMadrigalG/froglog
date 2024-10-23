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