const pseudo = document.getElementById('pseudo');
const login = document.getElementById('form');
let response;

const sendRequest = new XMLHttpRequest;

sendRequest.onreadystatechange = function () {
	if (this.readyState === XMLHttpRequest.DONE && this.status === 200) {
		response = JSON.parse(this.responseText);
		console.log(response.user.name);
		//window.location.replace('./index.html');
	}
};

login.addEventListener('submit', (event) => {
	event.preventDefault();
	let userId = pseudo.value
	sendRequest.open('POST', 'http://localhost:3000/chat/login');
	sendRequest.setRequestHeader('Content-type', 'application/json');
	sendRequest.send(JSON.stringify({name: userId}));
	console.log('Requête envoyée');
	console.log(JSON.stringify({name: userId }));
});

let state = sendRequest.readyState;