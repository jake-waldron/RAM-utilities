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
	const cashInput = document.querySelector('#Tendered_Amount');

	return { orderTotal, availableCredit, paymentForm, paymentInput, cashInput };
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
	checkboxContainer.classList.add('form-group', 'pull-right', 'checkbox');
	checkboxContainer.appendChild(checkbox);
	checkboxContainer.appendChild(useCreditLabel);

	// const paymentContainer = document.querySelector('.cashPanel').parentElement;
	const paymentContainer = document.querySelector('.cashPanel').nextElementSibling.querySelector('.input-group');
	checkboxContainer.style.position = 'absolute';
	checkboxContainer.style.left = 'calc(100% + 6px)';
	checkboxContainer.style.width = '100%';
	// checkboxContainer.style.top = '10px';
	paymentContainer.appendChild(checkboxContainer);

	return { checkbox, checkboxContainer };
}

// Sets up listeners for payment dropdown. Toggles element visablity if cash is selected. Runs reset function if changed to/form cash
function onPaymentTypeChange(elementsToToggle, runOnTypeChange) {
	let paymentType;
	let lastPaymentType;
	// Listener for payment dropdown button
	document.querySelector('#PaymentTypeSelectBox').addEventListener(
		'click',
		() => {
			// console.log('added listeners');

			const options = document.querySelectorAll('div[role="option"]');

			// Listeners for each option
			Array.from(options).forEach((option) => {
				option.addEventListener('click', () => {
					// console.log('payment changed');
					lastPaymentType = paymentType;
					paymentType = option.textContent;
					if (paymentType === 'Cash' || (lastPaymentType === 'Cash' && paymentType !== 'Cash')) {
						runOnTypeChange();
					}
					elementsToToggle.forEach((elementObj) => {
						const { element, isCashDisplayValue, isNotCashDisplayValue } = elementObj;
						element.style.display = paymentType === 'Cash' ? isCashDisplayValue : isNotCashDisplayValue;
					});
				});
			});
		},
		{ once: true }
	);
}

function handlePrepayment() {
	const { orderTotal, availableCredit, paymentForm, paymentInput, cashInput } = getInitialElements();

	if (availableCredit && orderTotal > availableCredit && paymentForm) {
		const paymentNeeded = orderTotal - availableCredit;

		// Display current credit and amount due(hidden unless cash payment)
		const currentCreditDisplay = createBalanceDisplay('Current Credit', availableCredit, 'info');
		const amountDueDisplay = createBalanceDisplay('Amount Due', paymentNeeded, 'danger');
		amountDueDisplay.style.display = 'none'; // only shown when cash payment selected
		addToBalanceDisplay([currentCreditDisplay, amountDueDisplay]);

		// Set default values to use availble credit
		let amountToApply = paymentNeeded;
		const payInFullButton = document.querySelector('#PayFullAmount');
		const payInFullButtonText = payInFullButton.querySelector('span');
		payInFullButtonText.textContent = 'Pay Remaining Balance';
		paymentInput.max = `${paymentNeeded}`;
		cashInput.dataset.orderbalance = paymentNeeded;

		// Show toggle for not using credit / pay in full
		const { checkbox, checkboxContainer } = addUseCreditToggle();

		// Reset to run on changes
		function reset() {
			// console.log('resetting input value!');
			paymentInput.value = '';
			document.querySelector('#ChangeDueContainer').style.display = 'none';
		}

		// Handle display toggle of elements if cash selected
		const elementsToToggle = [
			// {
			// 	element: checkboxContainer,
			// 	isCashDisplayValue: 'none',
			// 	isNotCashDisplayValue: 'block',
			// },
			{
				element: amountDueDisplay,
				isCashDisplayValue: 'block',
				isNotCashDisplayValue: 'none',
			},
		];

		onPaymentTypeChange(elementsToToggle, reset);

		// Set input values based on using credit or paying in full

		checkbox.addEventListener('change', () => {
			if (!checkbox.checked) {
				// Use credit
				paymentInput.max = paymentNeeded;
				amountToApply = paymentNeeded;
				cashInput.dataset.orderbalance = paymentNeeded;
				payInFullButtonText.textContent = 'Pay Remaining Balance';
				reset();
			} else {
				// Pay full amount
				paymentInput.max = orderTotal;
				amountToApply = orderTotal;
				cashInput.dataset.orderbalance = orderTotal;
				payInFullButtonText.textContent = 'Pay in Full';
				reset();
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
		// Fix spacing on change due
		const changeDue = document.querySelector('#ChangeDueContainer');
		changeDue.style.marginTop = '24px';

		handlePrepayment();
	}
});

// Ideally it would check if there was an open backorder and if the available credit matched that total, then not show the use credit option

// TODO : Change amount due display on checkbox change

// TODO: Wrap h2 with div using below technique
// Add div around balance display container with display: flex and justify-content: end
// 			- create new div element
// 			- add class/styles
// 			- add new div with h2 to new element
// 			- use replaceChild(newChild, oldChild) to replace old h2 with div-wrapped h2
// wrap current balance display text in div
// add current credit and amout due in second div, add margin-left: 16px to give some spacing
// m-t-none on current credit
// show amount due on all payment types (it's helpful to see the amount due even if you're not paying in cash)

// current 'pull-right' div -> remove class, change styles to flex and justify-end

// I just have to change the pull-right styles to flex and then wrap the new displays with a div with marginleft 16px and it should work. make sure to add m-t-none to class on new displays and add bottom margin
