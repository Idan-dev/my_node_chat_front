const email = document.getElementById('email');
const password = document.getElementById('password');
const login = document.getElementById('form');
let response;

const sendRequest = new XMLHttpRequest;

sendRequest.onreadystatechange = function () {
	if (this.readyState === XMLHttpRequest.DONE && this.status === 201) {
		response = JSON.parse(this.responseText);
		console.log(response);
		window.location.replace('./authentification.html');
	} 
};

login.addEventListener('submit', (event) => {
	event.preventDefault();
	let userEmail = email.value;
	let userPassword = password.value;
	sendRequest.open('POST', 'http://localhost:3000/chat/signup');
	sendRequest.setRequestHeader('Content-type', 'application/json');
	sendRequest.send(JSON.stringify({email: userEmail, password: userPassword }));
	console.log('Demande envoyée');
});

let state = sendRequest.readyState;