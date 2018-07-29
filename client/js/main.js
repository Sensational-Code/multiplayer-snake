var viewManager = new ViewManager();

window.addEventListener('load', function(event) {
	init();
});

function init() {
	var game = new SnakeGame();
	var urlParams = helpers.getAllUrlParams(window.location.href);
	var socket = io.connect();
	var roomID = urlParams.lobby;

	viewManager.init();

	if (roomID) {
		joinLobby(roomID);
	}

	function joinAnyLobby() {
		socket.emit('join-any-lobby', {});
		socket.on('found-lobby', function(id) {
			joinLobby(id);
		});
	}

	function createLobby() {
		socket.emit('create-lobby', {});
		socket.on('connect', function() {
			console.log('io connected.');
		});

		socket.on('lobby-joined', handleLobbyJoined);

		socket.on('lobby-not-exist', function(data) {
			console.log('LOBBY DOES NOT EXIST');
			document.write('This lobby doesn\'t exist');
			setTimeout(function() {
				window.location = '/'
			}, 1500);
		});

		socket.on('update-game', function(data) {
			console.log('update game')
			viewManager.updateLobbyData(data);
			game.updateData(data);
		});
	}

	function joinLobby(id) {
		socket.emit('join-lobby', id);
		socket.on('connect', function() {
			console.log('io connected.');
		});

		socket.on('lobby-joined', handleLobbyJoined);

		socket.on('lobby-not-exist', function(data) {
			console.log('LOBBY DOES NOT EXIST');
			document.write('This lobby doesn\'t exist');
			setTimeout(function() {
				window.location = '/'
			}, 1500);
		});

		socket.on('update-game', function(data) {
			console.log('update game')
			viewManager.updateLobbyData(data);
			game.updateData(data);
		});
	}

	viewManager.playButton.onclick = joinAnyLobby;
	viewManager.createButton.onclick = createLobby;
	viewManager.joinButton.onclick = function(event) {
		joinLobby(viewManager.joinInput.value);
	}

	function handleGameStart(data) {
		console.log('Game start!');
		viewManager.showGameView();
		game.init(socket);
	}
	function handleGameEnd(data) {
		console.log('Game end!');
		viewManager.showLobbyView();
	}

	function handleLobbyJoined(data) {
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
			viewManager.updateLobbyData(data);
		}

		viewManager.startGameButton.onclick = function() {
			socket.emit('lobby-start');
		}

		socket.on('game-start', handleGameStart);
		socket.on('game-end', handleGameEnd);
	}
}