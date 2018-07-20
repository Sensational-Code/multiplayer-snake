function Candy(x, y, gameboard) {
	this.x = x || 0;
	this.y = y || 0;
	this.board = gameboard;

	return this;
}

Candy.prototype = {
	findNewSpot: function(excludedBlocks) {
		this.x = helpers.randomIntBetween(0, this.board.width-1);
		this.y = helpers.randomIntBetween(0, this.board.height-1);

		for (var i = 0; i < excludedBlocks.length; ++i) {
			var block = excludedBlocks[i];
			if (this.x === block.x && this.y === block.y) {
				this.findNewSpot(this.board.width, this.board.height, excludedBlocks);
			}
		}

		return this;
	},

	render: function(context) {
		var boardX = this.board.x,
				boardY = this.board.y,
				blockSize = this.board.blockSize;

		context.fillStyle = '#FF5154';
		helpers.fillRoundedRect(context, this.x * blockSize + boardX, this.y * blockSize + boardY, blockSize, blockSize, 12);
	}
}