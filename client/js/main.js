var viewManager = new ViewManager();

window.addEventListener('load', function(event) {
	init();
});

function init() {
	var game = new SnakeGame();
	viewManager.init();
	var urlParams = helpers.getAllUrlParams(window.location.href);
	var socket = io.connect();
	var roomID = urlParams.lobby;

	if (roomID) {
		socket.on('connect', function() {
			console.log('io connected.');
			socket.emit('join_room', roomID);
		});

		socket.on('lobby_joined', function(data) {
			console.log('LOBBY JOINED => ' + data);
			console.log(data);
			game.updateData(data);

			// if the game is in progress, just add this player straight into to the game
			if (data.inGame) {
				viewManager.showGameView();
				game.init(socket);
			}
			else {
				viewManager.showLobbyView();
			}

			viewManager.startGameButton.onclick = function() {
				socket.emit('lobby_start');
			}

			socket.on('game_start', function() {
				console.log('Game start!');
				viewManager.showGameView();
				game.init(socket);
			});

			socket.on('game_end', function() {
				console.log('Game end!');
				viewManager.showLobbyView();
			});
		});

		socket.on('lobby_not_exist', function(data) {
			console.log('LOBBY DOES NOT EXIST');
			document.write('This lobby doesn\'t exist');
			setTimeout(function() {
				window.location = '/'
			}, 1500);
		});

		socket.on('update_game', function(data) {
			viewManager.updateLobbyData(data);
			game.updateData(data);
		});
	}
}