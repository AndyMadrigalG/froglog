// Establish a long-lived connection to the background script
const port = chrome.runtime.connect();

// Function to send event data through the long-lived connection
function logEvent(activity_name) {
  const eventDetails = {
    timestamp: new Date().toISOString(),
    activity_name: activity_name,
    domain: window.location.hostname
  };

  // Send the event details through the long-lived connection
  port.postMessage(eventDetails);
}

// Event Listeners
document.addEventListener('mouseup', () => logEvent('clickUp'));
document.addEventListener('keyup', () => logEvent('keyup'));
// document.addEventListener('scroll', () => logEvent('scroll')); //Removed, because it causes too much noise 
