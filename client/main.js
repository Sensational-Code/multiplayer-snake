var viewManager = new ViewManager();

window.onload = function() {
	init();
}

function init() {
	var game = new SnakeGame();
	viewManager.init();

	window.onkeydown = function(event) {
		game.snake.newDirection = {
			37: -1, // left arrow
			39: 1, // right arrow
			38: -2, // up arrow
			40: 2, // down arrow,
			32: 3 // spacebar (to stop) - temp
		}[event.keyCode] || game.snake.newDirection;

		game.socket.emit('new_direction', game.snake.newDirection);
	}

	var urlParams = getAllUrlParams(window.location.href);
	var socket = io.connect();
	game.socket = socket;
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
				game.init();
			});

			socket.on('game_end', function() {
				console.log('Game end!');
				viewManager.showLobbyView();
				game.init();
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