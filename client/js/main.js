window.addEventListener('load', function(event) {
	init();
});

function init() {

	var app = new Vue({
		el: '#app',
		data: {
			page: 'home-view',
			playerName: null,
			players: [],
			joinLobbyText: ''
		},
		methods: {
			joinAnyLobby: function() {
				var self = this;
				socket.emit('join-any-lobby', {});
				socket.on('found-lobby', function(id) {
					self.joinLobby(id);
				});
			},

			createLobby: function() {
				var playerName = this.playerName;
				socket.emit('create-lobby', {
					playerName: playerName
				});
				onLobbyJoined();
			},

			joinLobby: function(id) {
				var playerName = this.playerName;
				socket.emit('join-lobby', {
					playerName: playerName,
					id: id
				});
				onLobbyJoined();
			},
			
			updateLobbyData: function(data) {
				this.players = data.players;
			},

			startLobby: function() {
				socket.emit('lobby-start');
			},

			copyLobbyLink: function() {
				this.$refs.lobbyLink.select();
				document.execCommand("copy");
			}
		}
	});

	var socket = io.connect();
	var game = new SnakeGame();

	var urlParams = helpers.getAllUrlParams(window.location.href);
	var lobbyId = urlParams.lobby;

	if (lobbyId) {
		app.joinLobby(lobbyId);
	}

	function onLobbyJoined() {
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
			app.updateLobbyData(data);
			game.updateData(data);
			if (data.players[socket.id].isHost) {
				app.$refs.startGameButton.disabled = false;
			}
		});
	}

	function handleGameStart(data) {
		console.log('Game start!');
		app.page = 'game-view';
		game.init(socket);
	}

	function handleGameEnd(data) {
		console.log('Game end!');
		app.page = 'lobby-view';
		Vue.nextTick(function () {
			app.updateLobbyData(data);
			app.$refs.lobbyLink.value = window.location.href + '?lobby=' + data.lobbyID;
		});
	}

	function handleLobbyJoined(data) {
		console.log('LOBBY JOINED => ' + data);
		console.log(data);
		game.updateData(data);

		// if the game is in progress, just add this player straight into to the game
		if (data.inGame) {
			app.page = 'game-view';
			game.init(socket);
		}
		else {
			app.page = 'lobby-view';
			Vue.nextTick(function () {
				app.updateLobbyData(data);
				app.$refs.lobbyLink.value = window.location.href + '?lobby=' + data.lobbyID;
			});
		}

		socket.on('game-start', handleGameStart);
		socket.on('game-end', handleGameEnd);
	}
}