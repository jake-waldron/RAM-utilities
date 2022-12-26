javascript: (function () {
	const toast = document.createElement('div');
	Object.assign(toast.style, {
		position: 'fixed',
		top: '25px',
		right: '25px',
		padding: '10px 20px',
		borderRadius: '3px',
		backgroundColor: '#28a745',
		color: 'white',
		fontSize: '16px',
	});
	toast.innerText = 'Added to list!';
	document.body.append(toast);

	setTimeout(() => {
		toast.parentNode.removeChild(toast);
	}, 1000);
})();
