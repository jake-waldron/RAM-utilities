function getInitialElements() {
	const orderTotal = getOrderTotal();
	const availableCredit = getAvailableCredit();
	const paymentForm = document.querySelector('#AddPaymentForm');

	const paymentInput = document.querySelector('input[id=Payment_Amount]');

	return { orderTotal, availableCredit, paymentForm, paymentInput };
}

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

function createCreditDisplay(availableCredit) {
	const creditDisplay = document.createElement('h2');
	creditDisplay.textContent = `Current Credit: `;
	creditDisplay.classList.add('text-right', 'm-t', 'none');
	const creditAmount = document.createElement('span');
	creditAmount.textContent = `$${availableCredit.toFixed(2)}`;
	creditAmount.classList.add('text-info', 'font-bold');
	creditDisplay.appendChild(creditAmount);
	return creditDisplay;
}

//TODO : Add "Don't use prepayment" button
function handlePrepayment() {
	const { orderTotal, availableCredit, paymentForm, paymentInput } = getInitialElements();

	if (availableCredit && orderTotal > availableCredit && paymentForm) {
		// Modal Elements
		const balanceDisplay = document.querySelector('#SiteModalContent .pull-right');
		const paymentNeeded = orderTotal - availableCredit;

		const creditDisplay = createCreditDisplay(availableCredit);
		balanceDisplay.appendChild(creditDisplay);

		const payInFullButton = document.querySelector('#PayFullAmount');
		const payInFullButtonText = payInFullButton.querySelector('span');
		payInFullButtonText.textContent = 'Pay Remaining Balance';
		payInFullButton.addEventListener('click', () => {
			paymentInput.max = `${paymentNeeded}`;
			paymentInput.value = `${paymentNeeded}`;
		});
	}
}

// This will only be called when the add payment page loads
chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
	if (request.message === 'add payment loaded') {
		handlePrepayment();
	}
});
