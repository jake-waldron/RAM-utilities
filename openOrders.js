javascript: (function () {
	const overlay = document.createElement('div');
	const instructions = document.createElement('div');
	const links = [];

	function showInstructions() {
		Object.assign(instructions.style, {
			width: '400px',
			textAlign: 'center',
			position: 'fixed',
			bottom: '50px',
			left: 'calc(50% - 200px)',
			padding: '10px 20px',
			borderRadius: '3px',
			backgroundColor: 'hsla(0, 0%, 20%, 0.5)',
			color: 'white',
			fontSize: '16px',
			zIndex: 9999,
		});
		instructions.innerText = 'Click on order numbers. Press enter to open.';
		document.body.append(instructions);
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

	function moveListener(event) {
		const element = getElement(event);
		if (!element) return;
		const position = element.getBoundingClientRect();
		Object.assign(overlay.style, {
			background: 'rgba(0, 128, 255, 0.25)',
			outline: '1px solid rgba(0, 128, 255, 0.5)',
			top: `${position.top}px`,
			left: `${position.left}px`,
			width: `${position.width}px`,
			height: `${position.height}px`,
		});
	}

	function clickListener(event) {
		const element = getElement(event);
		const link = element.href;
		const linkText = element.textContent;
		element.textContent = '✅' + linkText;
		links.push(link);
		console.log(links);
	}

	function escListener(event) {
		if (event.key === 'Escape') {
			removeEverything();
		}
	}

	function enterListener(event) {
		if (event.key === 'Enter') {
			openOrders();
		}
	}

	function openOrders() {
		links.forEach((link) => window.open(link, '_blank'));
		removeEverything();
	}

	function removeEverything() {
		overlay.removeEventListener('click', clickListener);
		document.removeEventListener('mousemove', moveListener);
		document.removeEventListener('keydown', enterListener);

		overlay.remove();
		instructions.remove();
	}

	showInstructions();
	document.addEventListener('keydown', escListener);
	document.addEventListener('mousemove', moveListener);
	overlay.addEventListener('click', clickListener);
	document.addEventListener('keydown', enterListener);
})();
