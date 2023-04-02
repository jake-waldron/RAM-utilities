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

	const [billToDisplay, shipToDisplay] = Array.from(document.querySelectorAll('.bootstrap-multiemail'));

	const billing = {
		initialValues: billToEmails.value,
		display: billToDisplay,
		emailContainer: billToEmails,
		type: 'billing',
		input: billToDisplay.querySelector('input'),
	};

	const shipping = {
		initialValues: shipToEmails.value,
		display: shipToDisplay,
		emailContainer: shipToEmails,
		type: 'shipping',
		input: shipToDisplay.querySelector('input'),
	};

	console.log(billing.input);
	setupEmailEdit(billing);
	setupEmailEdit(shipping);

	function setupEmailEdit(emailSection) {
		const { initialValues, display, emailContainer, type, input } = emailSection;
		const button = document.createElement('button');
		button.textContent = 'Edit Emails';
		button.classList.add('btn');
		button.classList.add('btn-primary');
		button.classList.add('btn-xs');
		button.style.margin = '0 8px 0 8px';

		display.insertAdjacentElement('beforebegin', button);

		// EDIT BUTTON CLICK
		button.addEventListener('click', (e) => {
			e.preventDefault();
			if (!document.querySelector(`#${type}Form`)) {
				clearAndAddForm(emailSection);
				hideInput(input);
			}

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

			// RESET BUTTON CLICK
			resetButton.addEventListener('click', (e) => {
				e.preventDefault();
				const form = document.querySelector(`#${type}Form`);
				if (form) {
					form.remove();
				}
				clearEmailDisplay(display);
				emailContainer.value = initialValues;
				const emails = initialValues.split(',');
				emails.forEach((email) => {
					addTag(email, display, input);
				});
				resetButton.remove();
				showInput(input);
			});
		});
	}
}

function clearAndAddForm(emailSection) {
	const { display } = emailSection;
	// display.innerHTML = '';
	clearEmailDisplay(display);

	const emailForm = createEmailCheckboxForm(emailSection);

	display.appendChild(emailForm);
}

function clearEmailDisplay(display) {
	// display.innerHTML = '';
	const tags = Array.from(display.querySelectorAll('.tag'));
	tags.forEach((tag) => tag.remove());
}

function hideInput(input) {
	console.log(input);
	input.classList.add('hidden');
}

function showInput(input) {
	input.classList.remove('hidden');
}

function createEmailCheckboxForm(emailSection) {
	const { type, emailContainer, display, input } = emailSection;
	const emails = emailContainer.value.split(',');
	const form = document.createElement('form');
	form.id = `${type}Form`;
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

	// SAVE EMAILS BUTTON CLICK
	form.addEventListener('submit', (e) => {
		e.preventDefault();
		const checkedEmails = Array.from(e.target.querySelectorAll('input:checked')).map((input) => input.value);
		checkedEmails.forEach((email) => {
			addTag(email, display, input);
		});
		const emailString = checkedEmails.join(',');
		emailContainer.value = emailString;
		form.remove();
		showInput(input);
	});

	return form;
}

function addTag(email, display, input) {
	const outsideSpan = document.createElement('span');
	outsideSpan.classList.add('tag');
	outsideSpan.classList.add('valid');
	outsideSpan.textContent = email;
	input.insertAdjacentElement('beforebegin', outsideSpan);
}
