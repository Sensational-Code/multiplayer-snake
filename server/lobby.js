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

	addPlayer(playerID) {
		let player = new Player();
		player.blocks[0].x = helpers.randomIntBetween(0, this.game.board.width-1);
		player.blocks[0].y = helpers.randomIntBetween(0, this.game.board.height-1);
		this.players[playerID] = player;
		this.playerCount += 1;
		this.playerSpace = this.config.maxPlayers - this.playerCount;
		console.log('Player ' + playerID + ' joined lobby ' + this.id);

		if (this.playerCount >= this.config.minPlayers) {
			this.hasEnoughPlayers = true;
		} else if (this.playerSpace < 1) {
				console.log(`Lobby ${this.id} is full.`);
		}
	}

	removePlayer(playerID) {
		delete this.players[playerID];
		this.playerCount -= 1;
		this.playerSpace = this.config.maxPlayers - this.playerCount;
		console.log('Player ' + playerID + ' left lobby ' + this.id);

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