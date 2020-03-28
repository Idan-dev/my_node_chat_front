document.addEventListener('DOMContentLoaded', () => {
	const socket = io();
	const input = document.getElementById('m');
	document.querySelector('form').addEventListener('submit',(event) => {
		event.preventDefault();
		socket.emit('chat message', input.value);
		input.value = '';
	});
	socket.on('chat message', (message) => {
		const li = document.createElement('li');
		li.textContent = message;
		document.querySelector('#messages').appendChild(li);
	});
});



/*
$(function () {
	var socket = io();
	$('form').submit(function(e){
				e.preventDefault(); // prevents page reloading
				socket.emit('chat message', $('#m').val());
				$('#m').val('');
				return false;
			});
	socket.on('chat message', function(msg){
		$('#messages').append($('<li>').text(msg));
	});
});
*/