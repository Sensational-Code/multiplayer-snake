const randomColor = require('randomcolor');
const capitalize = require('capitalize');
const nameGenerator = require('project-name-generator');

class Player {
	constructor(id, name) {
		this.id = id;
		this.name = name || capitalize.words(nameGenerator().spaced);
		this.isHost = false;
		this.blocks = [{ x: 0, y: 0 }];
		this.length = 1;
		this.direction = 0;
		this.color = randomColor();
	}
}

module.exports = Player;