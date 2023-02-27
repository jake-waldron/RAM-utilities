function getOrderTotal() {
	const totalSpan = document.querySelector('.Totals_OrderTotal');
	const total = totalSpan.textContent.slice(1);
	return parseFloat(total);
}

function getAvailableCredit() {
	const availableCreditElement = document.querySelector('#AvailableCreditAmount');
	if (availableCreditElement) {
		const availableCredit = availableCreditElement.textContent.slice(1);
		return parseFloat(availableCredit);
	}
}

function createPrepaymentDisplay(availableCredit) {
	const prepaymentDisplay = document.createElement('h2');
	prepaymentDisplay.textContent = `Prepayments: `;
	prepaymentDisplay.classList.add('text-right', 'm-t', 'none');
	const prepaymentAmount = document.createElement('span');
	prepaymentAmount.textContent = `$${availableCredit}`;
	prepaymentAmount.classList.add('text-info', 'font-bold');
	prepaymentDisplay.appendChild(prepaymentAmount);
	return prepaymentDisplay;
}

function handlePrepayment() {
	const orderTotal = getOrderTotal();
	const availableCredit = getAvailableCredit();
	const paymentForm = document.querySelector('#AddPaymentForm');

	const paymentInput = document.querySelector('input[id=Payment_Amount]');

	if (availableCredit && orderTotal > availableCredit && paymentForm) {
		const balanceDisplay = document.querySelector('#SiteModalContent .pull-right');
		const paymentNeeded = orderTotal - availableCredit;

		const prepaymentDisplay = createPrepaymentDisplay(availableCredit);
		balanceDisplay.prepend(prepaymentDisplay);
	}
}

// This will only be called when the add payment page loads
chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
	if (request.message === 'add payment loaded') {
		handlePrepayment();
	}
});
