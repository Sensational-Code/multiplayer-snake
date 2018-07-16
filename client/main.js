var game = new SnakeGame();

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

window.onload = function() {
	init();
}

function init() {
	var urlParams = getAllUrlParams(window.location.href);
	var socket = io.connect();
	game.socket = socket;
	var roomID = urlParams.lobby;

	var playerListContainer = document.getElementById('player-list-container');
	var playerListElem = document.getElementById('player-list');

	if (roomID) {
		socket.on('connect', function() {
			console.log('io connected.');
			socket.emit('join_room', roomID);
		});

		socket.on('lobby_joined', function(data) {
			console.log('LOBBY JOINED => ' + data);
			console.log(data);
			game.data = data;

			var startGameButton = document.getElementById('start-game-button');
			startGameButton.onclick = function() {
				socket.emit('lobby_start');
			}

			socket.on('game_start', function() {
				startGameButton.innerHTML = 'Restart game';
				game.init();
			});
		});

		socket.on('lobby_not_exist', function(data) {
			console.log('LOBBY DOES NOT EXIST');
		});

		socket.on('update_game', function(data) {
			playerListElem.innerHTML = '';
			for (var playerIndex in data.players) {
				var player = data.players[playerIndex];
				var playerElem = document.createElement('h2');
				playerElem.innerHTML = playerIndex;
				playerElem.style.color = player.color;
				playerListElem.appendChild(playerElem);
			}
			game.updateSnakes(data);
		});
	}
}