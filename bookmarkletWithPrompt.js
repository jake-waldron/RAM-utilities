javascript: (function () {
	const overlay = document.createElement('div');
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
			backgroundColor: toastMessage === 'Added to list' ? '#28a745' : 'red',
		});
		setTimeout(() => {
			toast.parentNode.removeChild(toast);
		}, 2000);
	}

	function moveListener(event) {
		const element = getElement(event);
		if (!element) return;
		const position = element.getBoundingClientRect();
		Object.assign(overlay.style, {
			background: 'rgba(0, 128, 255, 0.25)',
			outline: '1px solid rgba(0, 128, 255, 0.5)',
			top: '' + position.top + 'px',
			left: '' + position.left + 'px',
			width: '' + position.width + 'px',
			height: '' + position.height + 'px',
		});
	}

	async function clickListener(event) {
		const element = getElement(event);
		const text = element.textContent;
		const prodName = text.split('(')[0];
		const note = window.prompt('Add a note to this item: ');
		showToast();
		fetch(`https://3gbqvz7aa1.execute-api.us-east-2.amazonaws.com/addToTruck/add`, {
			method: 'post',
			mode: 'cors',
			body: JSON.stringify({ product: prodName, note }),
		})
			.then((res) => {
				return res.json();
			})
			.then((data) => {
				toastMessage = data.message;
			})
			.catch((error) => {
				toastMessage = 'Error. Try again';
			})
			.finally(() => {
				toast.innerText = toastMessage;
				removeToast();
			});

		overlay.removeEventListener('click', clickListener);
		document.removeEventListener('mousemove', moveListener);
		document.body.removeChild(overlay);
	}

	Object.assign(overlay.style, {
		position: 'fixed',
		top: 0,
		left: 0,
		width: '100vw',
		height: '100vh',
		zIndex: 99999999,
		background: 'transparent',
		cursor: 'crosshair',
	});
	document.body.append(overlay);
	function getElement(event) {
		overlay.style.pointerEvents = 'none';
		const element = document.elementFromPoint(event.clientX, event.clientY);
		overlay.style.pointerEvents = 'auto';
		return element;
	}
	document.addEventListener('mousemove', moveListener);
	overlay.addEventListener('click', clickListener);
})();
