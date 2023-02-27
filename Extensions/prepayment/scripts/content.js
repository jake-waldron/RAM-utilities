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

function createBalanceDisplay(label, amount, textStyle) {
	const balanceDisplay = document.createElement('h2');
	balanceDisplay.textContent = `${label}: `;
	balanceDisplay.classList.add('text-right', 'm-t', 'none');
	const balanceAmount = document.createElement('span');
	balanceAmount.textContent = `$${amount.toFixed(2)}`;
	balanceAmount.classList.add(`text-${textStyle}`, 'font-bold');
	balanceDisplay.appendChild(balanceAmount);

	return balanceDisplay;
}

function addToBalanceDisplay(newElements) {
	const balanceDisplay = document.querySelector('#SiteModalContent .pull-right');
	newElements.forEach((element) => {
		balanceDisplay.appendChild(element);
	});
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
	checkboxContainer.id = 'checkbox-container';
	checkboxContainer.classList.add('form-group', 'pull-right');
	checkboxContainer.appendChild(checkbox);
	checkboxContainer.appendChild(useCreditLabel);

	// const paymentContainer = document.querySelector('.cashPanel').parentElement;
	const paymentContainer = document.querySelector('.cashPanel').nextElementSibling.querySelector('.input-group');
	checkboxContainer.style.position = 'absolute';
	checkboxContainer.style.left = 'calc(100% + 16px)';
	checkboxContainer.style.width = '100%';
	checkboxContainer.style.top = '10px';
	paymentContainer.appendChild(checkboxContainer);

	return { checkbox, checkboxContainer };
}

function toggleVisibilityIfCashSelected(elementsToToggle, functionToRun) {
	let paymentType;
	document.querySelector('#PaymentTypeSelectBox').addEventListener(
		'click',
		() => {
			console.log('added listeners');
			const options = document.querySelectorAll('div[role="option"]');
			Array.from(options).forEach((option) => {
				option.addEventListener('click', () => {
					console.log('payment changed');
					paymentType = option.textContent;
					functionToRun();
					elementsToToggle.forEach((elementObj) => {
						const { element, isCashDisplayValue, isNotCashDisplayValue } = elementObj;
						element.style.display = paymentType === 'Cash' ? isCashDisplayValue : isNotCashDisplayValue;
					});
				});
			}),
				{ once: true };
		},
		{ once: true }
	);
}

function handlePrepayment() {
	const { orderTotal, availableCredit, paymentForm, paymentInput } = getInitialElements();

	if (availableCredit && orderTotal > availableCredit && paymentForm) {
		const paymentNeeded = orderTotal - availableCredit;

		// Display current credit and amount due(hidden unless cash payment)
		const currentCreditDisplay = createBalanceDisplay('Current Credit', availableCredit, 'info');
		const amountDueDisplay = createBalanceDisplay('Amount Due', paymentNeeded, 'danger');
		amountDueDisplay.style.display = 'none';
		addToBalanceDisplay([currentCreditDisplay, amountDueDisplay]);

		// Set default values to use availble credit
		let amountToApply = paymentNeeded;
		const payInFullButton = document.querySelector('#PayFullAmount');
		const payInFullButtonText = payInFullButton.querySelector('span');
		payInFullButtonText.textContent = 'Pay Remaining Balance';
		paymentInput.max = `${paymentNeeded}`;

		// Show toggle for not using credit / pay in full
		const { checkbox, checkboxContainer } = addUseCreditToggle();

		const resetInputValue = () => {
			console.log('resetting input value!');
			paymentInput.value = '';
		};

		// Handle display toggle of elements if cash selected
		const elementsToToggle = [
			{
				element: checkboxContainer,
				isCashDisplayValue: 'none',
				isNotCashDisplayValue: 'block',
			},
			{
				element: amountDueDisplay,
				isCashDisplayValue: 'block',
				isNotCashDisplayValue: 'none',
			},
		];
		toggleVisibilityIfCashSelected(elementsToToggle, resetInputValue);

		// Set input values based on using credit or paying in full
		checkbox.addEventListener('change', () => {
			if (!checkbox.checked) {
				// Use credit
				paymentInput.max = paymentNeeded;
				amountToApply = paymentNeeded;
				payInFullButtonText.textContent = 'Pay Remaining Balance';
				paymentInput.value = '';
			} else {
				// Pay full amount
				paymentInput.max = orderTotal;
				amountToApply = orderTotal;
				payInFullButtonText.textContent = 'Pay in Full';
				paymentInput.value = '';
			}
		});

		payInFullButton.addEventListener('click', () => {
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
