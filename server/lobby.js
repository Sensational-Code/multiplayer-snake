const randomColor = require('randomcolor');
const Gameboard = require('./gameboard.js');
const Candy = require('./candy.js');
const Game = require('./game.js').Game;
const helpers = require('./helpers.js');

class Lobby {
	constructor(id, io) {
		this.id = id;
		this.players = {};
		this.io = io;

		this.game = new Game();
		this.board = new Gameboard();
		this.candy = null;
		this.interval = null;
		this.inGame = false;

		this.config = {
			minPlayers: 2,
			maxPlayers: 5
		};

		return this;
	}

	replaceCandy() {
		// Make sure the new candy doesn't spawn on any player
		let allPlayerBlocks = [];
		for (let playerIndex in this.players) {
			let player = this.players[playerIndex];
			allPlayerBlocks.concat(player.blocks);
		}
		this.candy = new Candy(this.board).findNewSpot(allPlayerBlocks);
	}

	addPlayer(playerID) {
		this.players[playerID] = {
			blocks: [{
				x: helpers.randomIntBetween(0, this.board.width-1),
				y: helpers.randomIntBetween(0, this.board.height-1)
			}],
			length: 1,
			direction: 0,
			color: randomColor()
		};
		console.log('Player ' + playerID + ' joined lobby ' + this.id);
	}

	removePlayer(playerID) {
		console.log('Player ' + playerID + ' left lobby ' + this.id);
		delete this.players[playerID];
	}

	start() {
		this.inGame = true;
		this.replaceCandy();
		this.interval = setInterval(this.update.bind(this), 80);
	}

	stop() {
		this.inGame = false;
		clearInterval(this.interval);
	}

	update() {
		for (let playerIndex in this.players) {
			var player = this.players[playerIndex];

			var direction = player.direction;
			var newBlock = {
				x: player.blocks[0].x, 
				y: player.blocks[0].y
			};

	  	if (Math.abs(direction) === 1) {
				newBlock.x += direction;
			}
			else if (Math.abs(direction) === 2) {
				newBlock.y += (direction/2);
			}

			// make this player longer when they eat a candy
			// a problem is if 2 players get to it at the same time...
			if (player.blocks[0].x === this.candy.x && player.blocks[0].y === this.candy.y) {
				player.length += 1;
				this.replaceCandy();
			}

			// check if the head collides with any other snakes, DEAD
			// check if the block the snake it collided with it also it's head

			// create a list of new blocks for all players
			// then compare the new blocks for collisions and assign deaths

			player.blocks.unshift(newBlock);
			player.blocks = player.blocks.slice(0, player.length);
		}

		this.io.sockets.in(this.id).emit('update_game', {
			players: this.players,
			candy: this.candy
		});
	}
}

module.exports = Lobby;