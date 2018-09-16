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
				if (this.page === 'lobby-view') {
					if (this.players[socket.id].isHost) {
						this.$refs.startGameButton.disabled = false;
					}
					if (data.lobbyID) {
						this.$refs.lobbyLink.value = window.location.href + '?lobby=' + data.lobbyID;
					}
				}
			},

			startLobby: function() {
				socket.emit('lobby-start');
			},

			copyLobbyLink: function() {
				this.$refs.lobbyLink.select();
				document.execCommand('copy');
			}
		}
	});

	var socket = io.connect();
	socket.on('disconnect', function() {
		alert('Server connection lost!');
		app.page = 'home-view';
	});

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
			console.log('update game');
			app.updateLobbyData(data);
			game.updateData(data);
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
			});
		}

		socket.on('game-start', handleGameStart);
		socket.on('game-end', handleGameEnd);
	}
}