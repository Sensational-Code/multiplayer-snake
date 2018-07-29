const Gameboard = require('./gameboard.js');
const Candy = require('./candy.js');
const Game = require('./game.js');
const Player = require('./player.js');
const helpers = require('./helpers.js');

class Lobby {
	constructor(id, io) {
		this.id = id;
		this.io = io;

		this.config = {
			minPlayers: 2,
			maxPlayers: 5
		};

		this.playerCount = 0;
		this.playerSpace = this.config.maxPlayers;
		this.hasEnoughPlayers = false;

		this.players = {};
		this.game = new Game();
		this.game.players = this.players;

		this.interval = null;
		this.inGame = false;

		return this;
	}

	addPlayer(player) {
		this.players[player.id] = player;
		this.playerCount += 1;
		this.playerSpace = this.config.maxPlayers - this.playerCount;

		if (this.playerCount === 1) {
			player.isHost = true;
		}
		console.log(`Player ${player.id} (${player.isHost ? 'host' : 'player'}) joined lobby ${this.id}`);

		if (this.playerCount >= this.config.minPlayers) {
			this.hasEnoughPlayers = true;
		} else if (this.playerSpace < 1) {
				console.log(`Lobby ${this.id} is full.`);
		}
	}

	removePlayer(playerID) {
		let playerWasHost = this.players[playerID].isHost;
		delete this.players[playerID];
		this.playerCount -= 1;
		this.playerSpace = this.config.maxPlayers - this.playerCount;
		console.log('Player ' + playerID + ' left lobby ' + this.id);

		if (this.playerCount >= 1 && playerWasHost) {
			let nextPlayer = this.players[Object.keys(this.players)[0]];
			nextPlayer.isHost = true;
			console.log(`Player ${nextPlayer.id} was changed to host of lobby ${this.id}`);
		}

		if (this.playerCount < this.config.minPlayers) {
			this.hasEnoughPlayers = false;
		}
	}

	startGame() {
		this.inGame = true;
		this.game.replaceCandy();
		this.interval = setInterval(this.update.bind(this), 80);
	}

	stopGame() {
		this.inGame = false;
		clearInterval(this.interval);
	}

	update() {
		this.game.update();
		this.io.sockets.in(this.id).emit('update-game', {
			players: this.players,
			candy: this.game.candy,
			inGame: this.inGame
		});
	}
}

module.exports = Lobby;