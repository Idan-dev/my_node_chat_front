const socket = io();
const input = document.getElementById('m');
const form = document.querySelector('form');
const messages = document.getElementById('messages');
const writing = document.getElementById('change');
let userId;
let email;

async function retrieveUsername (cookie) {
	console.log('Current: ' + cookie);
	let decodingCookie = cookie.split(';');
	console.log('Decoding: ' + decodingCookie);
	const regexUserId = /(?=username)\w+=\w+/g;
	const regexEmail = /(?=email)\w+=\w+(\.*\w*)*@\w+.\w+/g;
	const isUserId = (element) => regexUserId.test(element);
	const isEmail = (element) => regexEmail.test(element);
	let decodingUserId;
	let decodingEmail;
	if (decodingCookie.findIndex(isUserId) !== -1) {
		console.log('username found in cookie');
		console.log(decodingCookie.findIndex(isUserId));
		decodingUserId = decodingCookie[decodingCookie.findIndex(isUserId)].split('=');
	}

	if (decodingCookie.findIndex(isEmail) !== -1) {
		console.log('email found in cookie');
		console.log(decodingCookie.findIndex(isUserId));
		decodingEmail = decodingCookie[decodingCookie.findIndex(isEmail)].split('=');
	}

	userId = decodingUserId[1];
	email = decodingEmail[1];

	if (userId === undefined || email === undefined) {
		return false;
	}

	console.log('Should be username: ' + userId);
	console.log('Should be email: ' + email);
	let newUser = {
		userId: userId,
		email: email
	};
	cookie += ' ; expires=Thu, 01 Jan 1970 00:00:00 UTC;';
	console.log('Deleted: ' + cookie);
	return newUser;
};

async function sendNewUsername () {
	let newUser = await retrieveUsername(document.cookie);
	if (newUser === false) {
		alert("Couldn't get either, or both, your email or your username");
		return false;
	}
	console.log('Tentative asynchrone ' + newUser);
	socket.emit('new user', newUser);
};

sendNewUsername();

window.addEventListener('beforeunload', (event) => {
	document.cookie = 'username=' + userId;
	document.cookie = 'email=' + email;
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