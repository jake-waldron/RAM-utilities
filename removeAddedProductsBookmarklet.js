javascript: (function () {
	const links = Array.from(document.querySelectorAll('a'));
	const products = links.filter((link) => link.title === 'View product').map((link) => link.textContent.split('(')[0]);
	console.log(products);
	fetch(`https://3gbqvz7aa1.execute-api.us-east-2.amazonaws.com/addToTruck/update`, {
		method: 'post',
		mode: 'cors',
		body: JSON.stringify({ products }),
	})
		.then((res) => {
			return res.json();
		})
		.then((data) => {
			console.log(data);
		})
		.catch((error) => {
			console.log(error);
		});
})();
