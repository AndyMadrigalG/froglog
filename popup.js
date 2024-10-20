// Fetch event log from background script
chrome.runtime.sendMessage({ action: "getEventLog" }, (eventLog) => {
  const eventList = document.getElementById('eventList');
  eventLog.forEach(event => {
    const listItem = document.createElement('li');
    listItem.textContent = `${event.timestamp}: ${event.activity_name} on ${event.domain}`;
    eventList.appendChild(listItem);
  });
});
