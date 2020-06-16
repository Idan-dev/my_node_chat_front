const socket = io();
const input = document.getElementById('m');
const form = document.querySelector('form');
const messages = document.getElementById('messages');
console.log(document.cookie);
let decodingCookie = document.cookie.split('=');
let userId = decodingCookie[1];
console.log(userId);
const writing = document.getElementById('change');

socket.emit('new user', userId);

socket.on('error id', (caseNumber) => {
	switch (caseNumber) {
		case 1:
		userId = prompt("Username already taken. Choose another one!");
		socket.emit('new user', userId);
		break;

		case 2:
		userId = prompt("Please, do not use special caracters (like >,./)");
		socket.emit('new user', userId);
		break;

		default:
		userId = prompt("Couldn't get you, please try again");
		socket.emit('new user', userId);
	}
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