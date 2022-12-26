javascript: (function () {
	const overlay = document.createElement('div');

	function showToast(message) {
		const toast = document.createElement('div');
		Object.assign(toast.style, {
			position: 'fixed',
			top: '25px',
			right: '25px',
			padding: '10px 20px',
			borderRadius: '3px',
			backgroundColor: message === 'Already in list!' ? 'red' : '#28a745',
			color: 'white',
			fontSize: '16px',
			zIndex: 9999,
		});
		toast.innerText = message;
		document.body.append(toast);

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

	function clickListener(event) {
		const element = getElement(event);
		const text = element.textContent;
		const prodName = text.split('(')[0];
		fetch(`https://3gbqvz7aa1.execute-api.us-east-2.amazonaws.com/addToTruck/add`, {
			method: 'post',
			mode: 'no-cors',
			body: JSON.stringify({ product: prodName }),
		});
		showToast('Added to list!');

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
