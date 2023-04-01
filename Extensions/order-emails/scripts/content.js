// const email = emailSection.textContent;

function getEmails(heading) {
	const h3s = Array.from(document.querySelectorAll('h3'));

	const sectionHeading = h3s.find((h3) => h3.textContent === heading);

	const section = sectionHeading.nextElementSibling;

	const emailSection = section.querySelector('.col-lg-6:nth-of-type(2) > dl > dd:last-of-type > p');
	const emailList = emailSection.textContent.split('\n').filter((email) => email !== '');
	return emailList;
}

const billingEmails = getEmails('Billing');
const shippingEmails = getEmails('Shipping');

const multipleEmails = billingEmails.length > 1 || shippingEmails.length > 1;

if (multipleEmails) {
	const editButton = document.querySelector('#EditHiddenHeaderInfo');
	editButton.click();
	const billToEmails = document.querySelector('#Order_BillToEmail');
	const shipToEmails = document.querySelector('#Order_ShipToEmail');

	// const initialValues = {
	// 	billToEmails: billToEmails.value,
	// 	shipToEmails: shipToEmails.value,
	// };

	const [billToDisplay, shipToDisplay] = Array.from(document.querySelectorAll('.bootstrap-multiemail'));

	const billing = {
		initialValues: billToEmails.value,
		display: billToDisplay,
		emailInput: billToEmails,
		type: 'billing',
	};

	const shipping = {
		initialValues: shipToEmails.value,
		display: shipToDisplay,
		emailInput: shipToEmails,
		type: 'shipping',
	};

	setupEmailEdit(billing);
	setupEmailEdit(shipping);

	function setupEmailEdit({ initialValues, display, emailInput, type }) {
		const button = document.createElement('button');
		button.textContent = 'Edit Emails';
		button.classList.add('btn');
		button.classList.add('btn-primary');
		button.classList.add('btn-xs');
		button.style.margin = '0 8px 0 8px';

		display.insertAdjacentElement('beforebegin', button);
		button.addEventListener('click', (e) => {
			e.preventDefault();
			clearAndAddForm(type, display, emailInput);

			const resetButton = document.createElement('button');
			resetButton.id = `reset${type}`;
			resetButton.textContent = 'Reset Emails';
			resetButton.classList.add('btn');
			resetButton.classList.add('btn-warning');
			resetButton.classList.add('btn-xs');
			resetButton.style.margin = '0 0 0 8px';

			if (!document.querySelector(`#reset${type}`)) {
				button.insertAdjacentElement('afterend', resetButton);
			}

			resetButton.addEventListener('click', (e) => {
				e.preventDefault();
				display.innerHTML = '';
				emailInput.value = initialValues;
				const emails = initialValues.split(',');
				emails.forEach((email) => {
					addTag(email, display);
				});
				resetButton.remove();
			});
		});
	}
}

function clearAndAddForm(type, display, billToEmails) {
	display.innerHTML = '';

	const emailForm = createEmailCheckboxForm(type, billToEmails, display);

	display.appendChild(emailForm);
}

function createEmailCheckboxForm(type, emailInput, display) {
	const emails = emailInput.value.split(',');
	const form = document.createElement('form');
	Object.assign(form.style, {
		display: 'flex',
		flexDirection: 'column',
		alignItems: 'flex-start',
		paddingLeft: '32px',
	});
	emails.forEach((email) => {
		const optionDiv = document.createElement('div');

		const checkbox = document.createElement('input');
		checkbox.type = 'checkbox';
		checkbox.value = email;
		checkbox.id = `${type}${email}`;
		checkbox.name = 'email';
		const label = document.createElement('label');
		label.htmlFor = `${type}${email}`;
		label.textContent = email;
		optionDiv.appendChild(checkbox);
		optionDiv.appendChild(label);
		form.appendChild(optionDiv);
	});
	const submitButton = document.createElement('button');
	submitButton.classList.add('btn');
	submitButton.classList.add('btn-primary');
	submitButton.classList.add('btn-sm');
	submitButton.textContent = 'Save Emails';
	form.appendChild(submitButton);

	form.addEventListener('submit', (e) => {
		e.preventDefault();
		const checkedEmails = Array.from(e.target.querySelectorAll('input:checked')).map((input) => input.value);
		checkedEmails.forEach((email) => {
			const outsideSpan = document.createElement('span');
			outsideSpan.classList.add('tag');
			outsideSpan.classList.add('valid');
			outsideSpan.textContent = email;
			const removeSpan = document.createElement('span');
			removeSpan.dataset.role = 'remove';
			outsideSpan.appendChild(removeSpan);
			display.appendChild(outsideSpan);
		});
		const emailString = checkedEmails.join(',');
		emailInput.value = emailString;
		form.remove();
	});

	return form;
}

function addTag(email, display) {
	const outsideSpan = document.createElement('span');
	outsideSpan.classList.add('tag');
	outsideSpan.classList.add('valid');
	outsideSpan.textContent = email;
	const removeSpan = document.createElement('span');
	removeSpan.dataset.role = 'remove';
	outsideSpan.appendChild(removeSpan);
	display.appendChild(outsideSpan);
}
