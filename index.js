const socket = io();
const input = document.getElementById('m');
const form = document.querySelector('form');
const messages = document.getElementById('messages');
const userId = prompt("Quel est votre nom aujourd'hui?");
const writing = document.getElementById('change');

socket.emit('new user', userId);

socket.on('notification', (user) => {
	const li = document.createElement('li');
	li.textContent = user + ' is connected';
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