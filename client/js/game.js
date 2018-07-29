function SnakeGame() {
	this.board = new Gameboard();
	this.board.x = this.board.blockSize;
	this.board.y = this.board.blockSize;

	this.snake = new Snake(this.board.width/2 - 1, this.board.height/2 - 1, this.board);
	this.candies = [];

	this.canvas = document.getElementById('game-canvas');
	this.canvas.width = (this.board.width+2) * this.board.blockSize;
	this.canvas.height = (this.board.height+2) * this.board.blockSize;
	this.context = this.canvas.getContext('2d');

	this.socket = null;

	return this;
}

SnakeGame.prototype = {
	init: function(socket) {
		this.socket = socket;
		setInterval(this.update.bind(this), 80);
		this.addListeners();
	},

	addListeners: function() {
		window.addEventListener('keydown', this.handleKeyDown.bind(this));
	},

	handleKeyDown: function(event) {
		this.snake.newDirection = {
			37: -1, // left arrow
			39: 1, // right arrow
			38: -2, // up arrow
			40: 2, // down arrow
			32: 3 // spacebar (to stop) - temp
		}[event.keyCode] || this.snake.newDirection;

		console.log(this.socket);
		
		this.socket.emit('new-direction', this.snake.newDirection);
	},

	reset: function() {
		this.snake = new Snake(this.board.width/2 - 1, this.board.height/2 - 1, this.board);
		this.candies = [];
	},

	updateData: function(data) {
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
		this.context.fillStyle = '#91A6FF';
		this.context.fillRect(0, 0, this.canvas.width, this.canvas.height);

		this.board.render(this.context);

		for (var i = 0; i < this.candies.length; ++i) {
			var candy = this.candies[i];
			candy.render(this.context);
		}

		var boardX = this.board.x,
				boardY = this.board.y,
				blockSize = this.board.blockSize;

		for (playerID in this.data.players) {
			var player = this.data.players[playerID];

			this.context.fillStyle = 'rgb(151, 225, 178)';
			for (var i = 0; i < player.blocks.length; ++i) {
				var block = player.blocks[i];
				this.context.fillStyle = player.color;
				helpers.fillRoundedRect(this.context, block.x * blockSize + boardX, block.y * blockSize + boardY, blockSize, blockSize, 8);
			}

			this.context.font = '15px Courier New';
			this.context.fillStyle = 'black';
			var textWidth = this.context.measureText(player.name).width;
			this.context.fillText(player.name, (player.blocks[0].x * blockSize + boardX) + blockSize/2 - textWidth/2, player.blocks[0].y * blockSize + boardY - 5);
		}
	}
}