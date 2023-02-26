const billNotes = Array.from(document.querySelectorAll('.multiline')).at(-2).textContent;
if (billNotes.includes('**ALERT**')) {
	const alertText = billNotes.split('**ALERT**')[1];
	alert(alertText);
}
