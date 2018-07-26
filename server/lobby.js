const randomColor = require('randomcolor');
const Gameboard = require('./gameboard.js');
const Candy = require('./candy.js');
const Game = require('./game.js');
const helpers = require('./helpers.js');

class Lobby {
	constructor(id, io) {
		this.id = id;
		this.io = io;

		this.players = {};
		this.game = new Game();
		this.game.players = this.players;

		this.interval = null;
		this.inGame = false;

		this.config = {
			minPlayers: 2,
			maxPlayers: 5
		};

		return this;
	}

	addPlayer(playerID) {
		this.players[playerID] = {
			blocks: [{
				x: helpers.randomIntBetween(0, this.game.board.width-1),
				y: helpers.randomIntBetween(0, this.game.board.height-1)
			}],
			length: 1,
			direction: 0,
			color: randomColor()
		};
		this.playerSpace = this.config.maxPlayers - Object.keys(this.players).length;
		console.log('Player ' + playerID + ' joined lobby ' + this.id);
		if (this.playerSpace < 1) {
				console.log(`Lobby ${this.id} is full.`);
		}
	}

	removePlayer(playerID) {
		delete this.players[playerID];
		this.playerSpace = this.config.maxPlayers - Object.keys(this.players).length;
		console.log('Player ' + playerID + ' left lobby ' + this.id);
	}

	start() {
		this.inGame = true;
		this.game.replaceCandy();
		this.interval = setInterval(this.update.bind(this), 80);
	}

	stop() {
		this.inGame = false;
		clearInterval(this.interval);
	}

	update() {
		this.game.update();
		this.io.sockets.in(this.id).emit('update_game', {
			players: this.players,
			candy: this.game.candy,
			inGame: this.inGame
		});
	}
}

module.exports = Lobby;