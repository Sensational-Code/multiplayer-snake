function Snake(x, y, gameboard) {
	this.blocks = [{
		x: x || 0,
		y: y || 0
	}];

	this.board = gameboard;
	this.direction = 0; // 0: stop, -1: left, 1: right, -2: up, 2: down
	this.newDirection = 0;
	this.length = 1;
	this.dead = false;

	this.playerID = null;

	return this;
}

Snake.prototype = {
	update: function() {
		if (!this.dead) {
			// If the new direction is the opposite of the current direction, don't do anything,
			// we dont want the snake to run into itself
			if (this.length > 1 && this.newDirection === -this.direction) {
				console.log('Can\'t move into yourself.');
			}
			else {
				this.direction = this.newDirection;
			}

			var newBlock = {
				x: this.blocks[0].x, 
				y: this.blocks[0].y
			};

			if (Math.abs(this.direction) === 1) {
				newBlock.x += this.direction;
			}
			else if (Math.abs(this.direction) === 2) {
				newBlock.y += (this.direction/2);
			}

			// If the snake collides with the walls
			if (newBlock.x < 0 || newBlock.x > this.board.width-1 || newBlock.y < 0 || newBlock.y > this.board.height-1) {
				this.dead = true;
				return; // freeze the snake in place, no need to continue
			}

			// Add a new block at the front of the snake, remove last tail block
			this.blocks.unshift(newBlock);
			this.blocks = this.blocks.slice(0, this.length);

			// Check if the snakes head collided with any its blocks
			for (var i = 1; i < this.blocks.length; ++i) {
				var block = this.blocks[i];
				if (newBlock.x === block.x && newBlock.y === block.y) {
					this.dead = true;
				}
			}
		}
	},

	render: function(context) {
		var boardX = this.board.x,
				boardY = this.board.y,
				blockSize = this.board.blockSize;

		var green = 0;
		context.fillStyle = 'rgb(151, 225, ' + green + ')';
		for (var i = 0; i < this.blocks.length; ++i) {
			green += 20;
			if (green > 150) green = 0;

			var block = this.blocks[i];
			context.fillStyle = 'rgb(151, 225, ' + green + ')';
			helpers.fillRoundedRect(context, block.x * blockSize + boardX, block.y * blockSize + boardY, blockSize, blockSize, 8);
		}
	}
}