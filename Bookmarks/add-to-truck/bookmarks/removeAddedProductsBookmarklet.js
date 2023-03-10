javascript: (function () {
	const links = Array.from(document.querySelectorAll('a'));
	const products = links.filter((link) => link.title === 'View product').map((link) => link.textContent.split('(')[0]);
	const toast = document.createElement('div');
	let toastMessage = 'Loading...';

	function showToast() {
		Object.assign(toast.style, {
			position: 'fixed',
			top: '25px',
			right: '25px',
			padding: '10px 20px',
			borderRadius: '3px',
			backgroundColor: 'grey',
			color: 'white',
			fontSize: '16px',
			zIndex: 9999,
		});
		toast.innerText = toastMessage;
		document.body.append(toast);
	}
	function removeToast() {
		Object.assign(toast.style, {
			backgroundColor: toastMessage === 'List updated' ? '#28a745' : '#dd3b22',
		});
		setTimeout(() => {
			toast.parentNode.removeChild(toast);
		}, 2000);
	}

	showToast();
	fetch(`https://3gbqvz7aa1.execute-api.us-east-2.amazonaws.com/addToTruck/update`, {
		method: 'post',
		mode: 'cors',
		body: JSON.stringify({ products }),
	})
		.then((res) => {
			return res.json();
		})
		.then((data) => {
			toastMessage = data.message;
		})
		.catch((error) => {
			toastMessage = 'Error';
			console.log(error);
		})
		.finally(() => {
			toast.innerText = toastMessage;
			removeToast();
		});
})();
