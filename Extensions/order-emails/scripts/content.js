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
	let billToEmails = document.querySelector('#Order_BillToEmail');
	let shipToEmails = document.querySelector('#Order_ShipToEmail');

	const emailDisplays = Array.from(document.querySelectorAll('.bootstrap-multiemail'));
	emailDisplays.forEach((emailDisplay) => {
		emailDisplay.innerHTML = '';
	});

	const [billToDisplay, shipToDisplay] = emailDisplays;

	const billToEmailForm = createEmailCheckboxForm('billing', billToEmails, billToDisplay);
	const shipToEmailForm = createEmailCheckboxForm('shipping', shipToEmails, shipToDisplay);

	billToDisplay.appendChild(billToEmailForm);
	shipToDisplay.appendChild(shipToEmailForm);
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
