/*
    When chrome extension icon is clicked, append a button to
    the DOM that when clicked sends an alert 'Hello World!'
*/
chrome.action.onClicked.addListener((tab) => {
    chrome.scripting.executeScript({
        target: {
            tabId: tab.id || 0
        },
        func: () => {
            const myButton = document.createElement('button');
            myButton.textContent = 'Say Hi!';
            myButton.onclick = () => {
                alert('Hello World!');
            };
            document.body.appendChild(myButton);
        }
    }).then(() => {
        console.log('Button appended to DOM');
    }).catch((err) => {
        console.error(err);
    });
});
export {};
