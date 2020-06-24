const socket = io();
const input = document.getElementById('m');
const form = document.querySelector('form');
const messages = document.getElementById('messages');
const writing = document.getElementById('change');
let userId;

async function retrieveUsername (cookie) {
	console.log('Current: ' + cookie);
	let decodingCookie = cookie.split('=');
	userId = decodingCookie[1];
	console.log(userId);
	cookie += ' ; expires=Thu, 01 Jan 1970 00:00:00 UTC;';
	console.log('Deleted: ' + cookie);
	return userId
}

async function sendNewUsername () {
	let newUser = await retrieveUsername(document.cookie);
	console.log('Tentative asynchrone ' + newUser);
	socket.emit('new user', newUser);
}

sendNewUsername();

window.addEventListener('beforeunload', (event) => {
	document.cookie = 'username=' + userId;
	console.log(document.cookie);
});


socket.on('username issue', (error) => {
	alert(error);
	window.location.replace('./authentification.html');
});

socket.on('notification', (user) => {
	const li = document.createElement('li');
	li.textContent = user + ' is connected';
	messages.appendChild(li);
});

socket.on('disconnection', (user) => {
	const li = document.createElement('li');
	li.textContent = user + ' disconnected';
	messages.appendChild(li);
});

form.addEventListener('submit',(event) => {
	event.preventDefault();
	socket.emit('chat message', input.value);
	input.value = '';
});

socket.on('chat message', (message) => {
	const li = document.createElement('li');
	li.textContent = message;
	messages.appendChild(li);
	writing.textContent = '';
});

socket.on('chat retrieval', (message) => {
	console.log(message);
	for (let i = 0; i < message.length; i++) {
		let pseudo;

		if (message[i].sender === undefined) {
			pseudo = 'Anonymous';
		} else {
			pseudo = message[i].sender;
		}

		let oldMessages = message[i].message;

		const li = document.createElement('li');
		li.textContent = pseudo + ' : ' + oldMessages;
		messages.appendChild(li);
	}
	console.log(message.length);
});

let timeOut;

input.addEventListener('input', () => {
	socket.emit('typing');
});

socket.on('typing', (message) => {
	clearTimeout(timeOut);
	writing.textContent = message;
	timeOut = setTimeout(() => {writing.textContent = ''}, 3000);
});