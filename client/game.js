function SnakeGame() {
	this.board = new Gameboard();
	this.snake = new Snake(this.board.width/2 - 1, this.board.height/2 - 1, this.board);
	this.candies = [];

	this.canvas = document.createElement('canvas');
	this.canvas.width = this.board.width * this.board.blockSize;
	this.canvas.height = this.board.height * this.board.blockSize;
	this.canvas.style.border = '22px solid #91A6FF';
	this.context = this.canvas.getContext('2d');

	return this;
}

SnakeGame.prototype = {
	init: function() {
		setInterval(this.update.bind(this), 80);
		document.body.appendChild(this.canvas);
	},

	reset: function() {
		this.snake = new Snake(this.board.width/2 - 1, this.board.height/2 - 1, this.board);
		this.candies = [];
	},

	updateSnakes: function(data) {
		this.data = data;
		if (data.candy) {
			this.candies[0] = new Candy(data.candy.x, data.candy.y, this.board);
		}
		this.update();
	},

	update: function() {
		this.render();
	},

	render: function() {
		this.context.fillStyle = '#FFFFFF';
		this.context.fillRect(0, 0, this.canvas.width, this.canvas.height);

		var blockSize = this.board.blockSize;

		for (playerID in this.data.players) {
			//console.log(this.data.players[player]);
			var player = this.data.players[playerID];
			this.context.fillStyle = 'rgb(151, 225, 178)';
			for (var i = 0; i < player.blocks.length; ++i) {
				var block = player.blocks[i];
				this.context.fillStyle = player.color;
				fillRoundedRect(this.context, block.x * blockSize, block.y * blockSize, blockSize, blockSize, 8);
			}
		}
		
		for (var i = 0; i < this.candies.length; ++i) {
			var candy = this.candies[i];
			candy.render(this.context);
		}
	}
}