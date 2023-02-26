const billingNotes = Array.from(document.querySelectorAll('.multiline')).at(-2).textContent;
const container = document.querySelector('.ibox-content');

if (billingNotes.includes('**ALERT**')) {
	const alertText = billingNotes.split('**ALERT**')[1];
	const div = document.createElement('div');

	div.textContent = alertText;
	Object.assign(div.style, {
		backgroundColor: 'red',
		color: 'white',
		fontSize: '2rem',
		fontWeight: 'bold',
		padding: '16px',
		marginBottom: '24px',
		textAlign: 'center',
	});
	container.prepend(div);
}
