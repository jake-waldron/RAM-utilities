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

function getInitialElements() {
	const orderTotal = getOrderTotal();
	const availableCredit = getAvailableCredit();
	const paymentForm = document.querySelector('#AddPaymentForm');

	const paymentInput = document.querySelector('input[id=Payment_Amount]');

	return { orderTotal, availableCredit, paymentForm, paymentInput };
}

function addCurrentCreditDisplay(availableCredit) {
	const balanceDisplay = document.querySelector('#SiteModalContent .pull-right');

	const creditDisplay = document.createElement('h2');
	creditDisplay.textContent = `Current Credit: `;
	creditDisplay.classList.add('text-right', 'm-t', 'none');
	const creditAmount = document.createElement('span');
	creditAmount.textContent = `$${availableCredit.toFixed(2)}`;
	creditAmount.classList.add('text-info', 'font-bold');
	creditDisplay.appendChild(creditAmount);
	balanceDisplay.appendChild(creditDisplay);
}

function addUseCreditToggle() {
	// Add checkbox toggle for not using prepayment
	const checkbox = document.createElement('input');
	checkbox.type = 'checkbox';
	checkbox.id = 'prepayment-checkbox';
	checkbox.checked = false;

	const useCreditLabel = document.createElement('label');
	useCreditLabel.textContent = "Don't Use Available Credit";
	useCreditLabel.htmlFor = 'prepayment-checkbox';
	useCreditLabel.classList.add('m-l-sm');

	const checkboxContainer = document.createElement('div');
	checkboxContainer.classList.add('form-group', 'pull-right');
	checkboxContainer.appendChild(checkbox);
	checkboxContainer.appendChild(useCreditLabel);

	const paymentContainer = document.querySelector('.cashPanel').parentElement;
	paymentContainer.appendChild(checkboxContainer);

	return { checkbox, checkboxContainer };
}

function hideIfCashSelected(element) {
	let paymentType;
	document.querySelector('#PaymentTypeSelectBox').addEventListener(
		'click',
		() => {
			// console.log('added listeners');
			const options = document.querySelectorAll('div[role="option"]');
			Array.from(options).forEach((option) => {
				option.addEventListener('click', () => {
					// console.log('payment changed');
					paymentType = option.textContent;
					element.style.display = paymentType === 'Cash' ? 'none' : 'block';
				});
			}),
				{ once: true };
		},
		{ once: true }
	);
}

//TODO : Add "Don't use prepayment" button
function handlePrepayment() {
	const { orderTotal, availableCredit, paymentForm, paymentInput } = getInitialElements();

	if (availableCredit && orderTotal > availableCredit && paymentForm) {
		const paymentNeeded = orderTotal - availableCredit;

		addCurrentCreditDisplay(availableCredit);

		// Set default values to use availble credit
		let amountToApply = paymentNeeded;
		let maxPaymentAmount = paymentNeeded;
		const payInFullButton = document.querySelector('#PayFullAmount');
		const payInFullButtonText = payInFullButton.querySelector('span');
		payInFullButtonText.textContent = 'Pay Remaining Balance';
		paymentInput.max = `${maxPaymentAmount}`;

		// Show toggle for not using credit / pay in full
		const { checkbox, checkboxContainer } = addUseCreditToggle();
		hideIfCashSelected(checkboxContainer);

		// Handle values based on using credit or paying in full
		checkbox.addEventListener('change', () => {
			if (!checkbox.checked) {
				// Use credit
				maxPaymentAmount = paymentNeeded;
				amountToApply = paymentNeeded;
				payInFullButtonText.textContent = 'Pay Remaining Balance';
				paymentInput.value = '';
			} else {
				// Pay full amount
				maxPaymentAmount = orderTotal;
				amountToApply = orderTotal;
				payInFullButtonText.textContent = 'Pay in Full';
				paymentInput.value = '';
			}
		});

		payInFullButton.addEventListener('click', () => {
			paymentInput.max = `${maxPaymentAmount}`;
			paymentInput.value = `${amountToApply}`;
		});
	}
}

// This will only be called when the add payment page loads
chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
	if (request.message === 'add payment loaded') {
		handlePrepayment();
	}
});
