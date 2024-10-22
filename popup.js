let port = chrome.runtime.connect({ name: "myPort" });

port.postMessage({ action: "getEventLog" });

// Fetch event log from background script
port.onMessage.addListener((msg) => {
  if (msg.eventLog) {
    const eventList = document.getElementById('eventList');
    msg.eventLog.forEach(event => {
      const listItem = document.createElement('li');
      listItem.textContent = `${event.timestamp}: ${event.activity_name} on ${event.domain}`;
      eventList.appendChild(listItem);
    });
  }
});