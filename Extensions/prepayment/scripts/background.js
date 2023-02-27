function sendMessage() {
	chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
		chrome.tabs.sendMessage(tabs[0].id, {
			message: 'add payment loaded',
		});
	});
}

// Listens for request for customer SearchItemDetail to load, then sends message to content.js
chrome.webRequest.onCompleted.addListener(sendMessage, { urls: ['https://*/Order/AddPayment*'] });
