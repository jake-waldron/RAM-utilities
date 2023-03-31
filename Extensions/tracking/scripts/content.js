const locations = [
	'RAM CHICAGO',
	'RAM CHARLOTTE',
	'RAM ALLENTOWN',
	'RAM DETROIT',
	'RAM ATLANTA',
	'SMOOTH-ON',
	'RAM DALLAS',
	'RAM LOS ANGELES',
	'RAM DENVER',
	'RAM ORLANDO',
	'RAM SEATTLE',
	'RAM PHOENIX',
	'RAM NEW MEXICO',
];

async function getAndAddTracking() {
	const iframe = document.querySelector('iframe');
	const iframeWindow = iframe.contentWindow;
	const orderPK = window.location.href.match(/(?<=orderPK=)\d+/);
	const response = await fetch(`https://amp.reynoldsam.com/Order/ViewShipments?orderPK=${orderPK}`);
	const responseText = await response.text();
	const parser = new DOMParser();
	const doc = parser.parseFromString(responseText, 'text/html');
	const trackingNumbers = Array.from(doc.querySelectorAll('a[title="View the selected Shipment"]')).map(
		(link) => link.textContent
	);
	iframeWindow.document.body.prepend(`Tracking : ${trackingNumbers.join(', ')}`);
}

const customerHeading = document.querySelector('h3');
if (customerHeading.textContent.startsWith('Customer:')) {
	const acctName = customerHeading.querySelector('a').textContent;

	if (locations.includes(acctName)) {
		getAndAddTracking();
	}
}
