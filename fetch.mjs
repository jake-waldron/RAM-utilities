const res = await fetch(`https://hapxr2quzvdrtx2tkcqaxyozru0ttkqn.lambda-url.us-east-2.on.aws/`, {
	method: 'post',
	mode: 'no-cors',
	headers: {
		Accept: '*/*',
	},
	body: JSON.stringify({ okay: "let's try this!" }),
});
const body = await res.json();
console.log('lets see what we got back');
console.log(body);
