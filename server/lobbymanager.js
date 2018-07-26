const crypto = require('crypto');
const Lobby = require('./lobby.js');

class LobbyManager {
	constructor(io) {
		this.lobbies = {};
		this.io = io;
	}

	createLobby() {
		var id = crypto.randomBytes(3).toString('hex');
		this.lobbies[id] = new Lobby(id, this.io);
		console.log('Created lobby ' + id);
		return this.lobbies[id];
	}

	removeLobby(id) {
		console.log('Removed lobby ' + id);
		delete this.lobbies[id];
	}

	getLobby(id) {
		return this.lobbies[id];
	}
};

module.exports = function(io) {
	return new LobbyManager(io);
}