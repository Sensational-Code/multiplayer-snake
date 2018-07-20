function Gameboard() {
	// Make sure the width and height are even numbers so the snake can spawn in the middle
	// In blocks
	this.width = 24;
	this.height = 24;

	// In pixels
	this.x = 0;
	this.y = 0;

	this.blockSize = 22;

	return this;
}

Gameboard.prototype = {
	render: function(context) {
		context.fillStyle = '#FFFFFF';
		context.fillRect(this.x, this.y, this.width * this.blockSize, this.height * this.blockSize);
	}
}