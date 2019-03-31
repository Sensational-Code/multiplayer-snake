const crypto = require('crypto');
const Lobby = require('./lobby.js');

class LobbyManager {
	constructor(io) {
		this.lobbyCount = 0;
		this.lobbies = {};
		this.io = io;
	}

	createLobby() {
		var id = crypto.randomBytes(3).toString('hex');
		this.lobbies[id] = new Lobby(id, this.io);
		this.lobbyCount += 1;
		console.log('Created lobby ' + id);
		return this.lobbies[id];
	}

	removeLobby(id) {
		delete this.lobbies[id];
		this.lobbyCount -= 1;
		console.log('Removed lobby ' + id);
	}

	getLobby(id) {
		return this.lobbies[id];
	}
};

module.exports = LobbyManager;
