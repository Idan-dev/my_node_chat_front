const email = document.getElementById('email');
const password = document.getElementById('password');
const pseudo = document.getElementById('pseudo');
const login = document.getElementById('form');
let response;

const sendRequest = new XMLHttpRequest;

sendRequest.onreadystatechange = function () {
	if (this.readyState === XMLHttpRequest.DONE && this.status === 200) {
		response = JSON.parse(this.responseText);
		console.log(response);
		document.cookie = "username=" + response.username;
		console.log(response.username);
		window.location.replace('./index.html');
	} else if (this.readyState === XMLHttpRequest.DONE && this.status === 401) {
		response = JSON.parse(this.responseText);
		let errorHandler = response.error;
		alert(errorHandler);
	}
};

login.addEventListener('submit', (event) => {
	event.preventDefault();
	let userEmail = email.value;
	let userPassword = password.value;
	let username = pseudo.value;
	sendRequest.open('POST', 'http://localhost:3000/chat/login');
	sendRequest.setRequestHeader('Content-type', 'application/json');
	sendRequest.send(JSON.stringify({ email: userEmail, password: userPassword, username: username }));
	console.log('Requête envoyée');
});

let state = sendRequest.readyState;