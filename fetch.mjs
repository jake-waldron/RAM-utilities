const res = await fetch(`https://jakezty6ylg5wdqcvvxd5mdlwm0kofbm.lambda-url.us-east-2.on.aws/add`, {
	method: 'post',
	mode: 'no-cors',
	headers: {
		Accept: '*/*',
	},
	body: JSON.stringify({ product: 'Something new!' }),
});
console.log({ res });
const body = await res.json();
console.log('lets see what we got back');
console.log(body);
