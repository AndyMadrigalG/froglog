// Establish a long-lived connection to the background script
let port = chrome.runtime.connect({ name: "myPort" });

port.onDisconnect.addListener(() => {
  console.warn("Port disconnected");
  port = null;
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

// Event Listeners
document.addEventListener('mouseup', () => sendEvent('clickUp'));
document.addEventListener('keyup', () => sendEvent('keyup'));
// document.addEventListener('scroll', () => sendEvent('scroll')); //Removed, because it causes too much noise 
