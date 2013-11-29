
(function($) {

	$('#messageForm').hide();

	// On récupère le template en js puis on le supprime
	var msgtpl = $('#msg_tpl').html();
	$('#msg_tpl').remove();


	var socket = io.connect('http://localhost:5000');
	var room = "abc123";


	$('#loginForm').submit(function(event) {
		event.preventDefault();

		var username = $('#username').val();
		var password = $('#password').val();
		var room     = $('#room').val();

		username = (username ? username : 'Xorya');
		password = (password ? password : '12345');
		room     = (room ? room : 'public');

		socket.emit('login', {
			username: username,
			password: password,
			room:     room
		});
	});


	// Qd utilisateur se co.
	socket.on('logged', function() {
		$('#loginForm').fadeOut();
		$('#messageForm').fadeIn();

		$('#message').focus();
	});

	socket.on('new_user', function(user) {


		if (user) {
			$('#users').append('<p id="' + user.id + '">' + user.username + '</p>');
			$('#messages').append('<p class="text-success"><strong>' + user.username + '</strong> vient de se connecter !</p>');
		}

		console.log('User is undefined !');
	});


	socket.on('logout_user', function(user) {
		$('#' + user.id).remove();
		$('#messages').append('<p class="text-danger"><strong>' + user.username + '</strong> vient de se déconnecter !</p>');
	});









	//
	//
	//
	//
	//
	//


	$('#messageForm').submit(function(event) {
		event.preventDefault();

		socket.emit('new_message', {message: $('#message').val()});

		$('#message').val('');
		$('#message').focus();
	});



	socket.on('new_message', function(message) {
		$('#messages').append('<div class="message">' + Mustache.render(msgtpl, message) + '</div>');

		//$('#messages').animate({ scrollTop: $('#messages').prop('scrollHeight') }, 100);
		$('#messages').animate({ scrollTop: 0 }, 100);


		
	});

})(jQuery);

