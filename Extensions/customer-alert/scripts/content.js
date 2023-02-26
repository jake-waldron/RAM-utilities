function showAlert(billingNotes, parentElement) {
	if (billingNotes?.includes('**ALERT**')) {
		const alertText = billingNotes.split('**ALERT**')[1];
		const div = document.createElement('div');
		div.id = 'customer-alert';
		div.textContent = alertText;
		Object.assign(div.style, {
			backgroundColor: 'red',
			color: 'white',
			fontSize: '2rem',
			fontWeight: 'bold',
			padding: '16px',
			marginBottom: '24px',
			textAlign: 'center',
		});
		if (!document.getElementById('customer-alert')) {
			parentElement.prepend(div);
		}
	}
}

// Handles the customer view page
if (
	document.URL.startsWith('https://amp.reynoldsam.com/Customer/View') ||
	document.URL.startsWith('https://ram-bam-us-web-qa.azurewebsites.net/Customer/View')
) {
	const billingNotes = Array.from(document.querySelectorAll('.multiline')).at(-2).textContent;
	const container = document.querySelector('.ibox-content');

	showAlert(billingNotes, container);
}

// Handles the customer search page, gets the message from background.js when the customer preview loads
chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
	if (request.message === 'customer preview loaded') {
		const previewContainer = document.querySelector('#detailPreview');
		if (previewContainer) {
			const billingNotes = Array.from(document.querySelectorAll('.multiline')).at(-1)?.textContent;

			showAlert(billingNotes, previewContainer);
		}
	}
});
