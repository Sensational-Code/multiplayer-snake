const randomIntBetween = require('./helpers.js').randomIntBetween;

class Candy {
	constructor(board) {
		this.board = board;

		return this;
	}

	findNewSpot(excludedBlocks) {
		this.x = randomIntBetween(0, this.board.width-1);
		this.y = randomIntBetween(0, this.board.height-1);

		for (var i = 0; i < excludedBlocks.length; ++i) {
			var block = excludedBlocks[i];
			if (this.x === block.x && this.y === block.y) {
				this.findNewSpot(this.board.width, this.board.height, excludedBlocks);
			}
		}

		return this;
	}
}

module.exports = Candy;