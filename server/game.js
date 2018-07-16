const Gameboard = require('./gameboard.js');
const Candy = require('./candy.js');

class Game {
	constructor() {
		this.board = new Gameboard();

		return this;
	}
}

module.exports = {Game: Game};