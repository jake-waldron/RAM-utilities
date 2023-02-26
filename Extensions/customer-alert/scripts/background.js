const pattern = 'https://*/Customer/SearchItemDetail*';
function sendMessage(requestDetails) {
	// send message to content.js
	chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
		chrome.tabs.sendMessage(tabs[0].id, {
			message: 'customer preview loaded',
		});
	});
}

// Listens for request for customer SearchItemDetail to load, then sends message to content.js
chrome.webRequest.onCompleted.addListener(sendMessage, { urls: [pattern] });
