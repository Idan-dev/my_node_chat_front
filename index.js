const socket = io();
const input = document.getElementById('m');
const form = document.querySelector('form');

form.addEventListener('submit',(event) => {
	event.preventDefault();
	socket.emit('chat message', input.value);
	input.value = '';
});

socket.on('chat message', (message) => {
	const li = document.createElement('li');
	li.textContent = message;
	document.querySelector('#messages').appendChild(li);
});