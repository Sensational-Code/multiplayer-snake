const Lobby = require('./../lobby.js');
const Player = require('./../player.js');

class LobbyController {

	constructor(io) {
		this.io = io;
		this.lobbyManager = require('./../lobbymanager.js')(io);

		io.sockets.on('connection', (socket) => {

			socket.player = new Player(socket.id);

			console.log(`New connection with id ${socket.id}`);

			socket.on('create-lobby', (data) => this.createLobby(socket, data));

			socket.on('join-any-lobby', (data) => this.joinAnyLobby(socket, data));

			socket.on('join-lobby', (data) => this.joinLobby(socket, data));

		});
	}

	createLobby(socket, data) {

		if (!data) {
			console.error('No data! Invalid create-lobby request!');
			return;
		}

		// Check if this player is already in a lobby
		if (socket.lobby) {
			this.disconnect(socket);
		}

		var lobby = this.lobbyManager.createLobby();
		data.id = lobby.id;
		this.joinLobby(socket, data);
	}

	joinLobby(socket, data) {

		if (!data) {
			console.error('No data! Invalid join-lobby request!');
			return;
		}

		let { id, playerName } = data;
		var lobby = this.lobbyManager.getLobby(id);
		if (!lobby) {
			socket.emit('lobby-not-exist');
			return;
		}

		if (playerName) {
			socket.player.name = playerName;
		}
		lobby.addPlayer(socket.player);
		socket.join(id);

		socket.emit('lobby-joined', {
			players: lobby.players,
			inGame: lobby.inGame,
			lobbyID: id
		});

		socket.lobby = lobby;

		this.io.sockets.in(id).emit('update-game', {
			players: lobby.players,
			candy: lobby.game.candy,
			inGame: lobby.inGame
		});

		socket.on('disconnect', (data) => this.disconnect(socket, data));

		socket.on('lobby-start', (data) => this.lobbyStart(socket, data));

		socket.on('new-direction', (data) => this.newDirection(socket, data));
	}

	joinAnyLobby(socket, data) {
		// If there aren't any lobbies to join, create a new one
		if (this.lobbyManager.lobbyCount < 1) {
			let lobby = this.lobbyManager.createLobby();
			socket.emit('found-lobby', lobby.id);
		} else {
			let bestLobby = null;
			// Loop through each lobby to find the lobby that is the most full
			for (let prop in this.lobbyManager.lobbies) {
				let lobby = this.lobbyManager.lobbies[prop];
				// If the lobby has space and is more full
				if (lobby.playerSpace > 0 && lobby.playerSpace < (!!bestLobby ? bestLobby.playerSpace : Infinity)) {
					bestLobby = lobby;
				}
			}
			// If we didn't find a suitable lobby, create a new one
			if (!bestLobby) {
				bestLobby = this.lobbyManager.createLobby();
			}
			socket.emit('found-lobby', bestLobby.id);
		}
	}

	disconnect(socket, data) {
		var lobby = socket.lobby;
		lobby.removePlayer(socket.id);
		if (lobby.playerCount < 1) {
			console.log(`Lobby ${lobby.id} is empty`);
			this.lobbyManager.removeLobby(lobby.id);
		} else {
			this.io.sockets.in(lobby.id).emit('update-game', {
				players: lobby.players,
				candy: lobby.game.candy,
				inGame: lobby.inGame
			});
			if (!lobby.hasEnoughPlayers) {
				lobby.stopGame();
				this.io.sockets.in(lobby.id).emit('game-end', {
					players: lobby.players,
					candy: lobby.game.candy,
					lobbyID: lobby.id
				});
			}
		}
	}

	lobbyStart(socket, data) {
		var lobby = socket.lobby;
		if (socket.player.isHost && lobby.hasEnoughPlayers) {
			lobby.startGame();
			this.io.sockets.in(lobby.id).emit('game-start');
		}
	}

	newDirection(socket, direction) {
		var lobby = socket.lobby;
		lobby.players[socket.id].direction = direction;
		this.io.sockets.in(socket.lobby.id).emit('update-game', {
			players: lobby.players,
			candy: lobby.game.candy,
			inGame: lobby.inGame
		});
	}
}

module.exports = LobbyController;
