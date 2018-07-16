function Candy(x, y, gameboard) {
	this.x = x || 0;
	this.y = y || 0;
	this.board = gameboard;

	return this;
}

Candy.prototype = {
	findNewSpot: function(excludedBlocks) {
		this.x = randomIntBetween(0, this.board.width-1);
		this.y = randomIntBetween(0, this.board.height-1);

		for (var i = 0; i < excludedBlocks.length; ++i) {
			var block = excludedBlocks[i];
			if (this.x === block.x && this.y === block.y) {
				this.findNewSpot(this.board.width, this.board.height, excludedBlocks);
			}
		}

		return this;
	},

	render: function(context) {
		var blockSize = this.board.blockSize;
		context.fillStyle = '#FF5154';
		fillRoundedRect(context, this.x * blockSize, this.y * blockSize, blockSize, blockSize, 12);
	}
}