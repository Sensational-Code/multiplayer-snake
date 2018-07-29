const randomColor = require('randomcolor');

class Player {
	constructor(id, name) {
		this.id = id;
		this.name = name || 'Guest';
		this.blocks = [{ x: 0, y: 0 }];
		this.length = 1;
		this.direction = 0;
		this.color = randomColor();
	}
}

module.exports = Player;