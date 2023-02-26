javascript: (function () {
	if (document.URL.startsWith('https://amp.reynoldsam.com/Order/SendInvoice')) {
		const iframeContent = document.querySelector('iframe').contentWindow.document;
		const emailLines = Array.from(iframeContent.querySelectorAll('p'));
		const dearLine = emailLines[0];
		const contactLine = emailLines[2];
		dearLine.remove();
		contactLine.textContent = contactLine.textContent.replace('Jake Waldron', 'us');

		const orderBalance = document.querySelector('#orderBalance')?.value;
		const paymentAmount = document.querySelector('#Request_UnappliedPayments_0__ApplyToOrderAmount')?.max;
		const secondPayment = document.querySelector('#Request_UnappliedPayments_1__ApplyToOrderAmount');
		if (orderBalance && paymentAmount) {
			if (secondPayment || orderBalance !== paymentAmount) {
				return window.alert('You should look at this first.');
			}
			document.querySelector('#ApplyPrepayment')?.click();
			document.querySelector('#SubmitButton').click();
		}
	}
})();
