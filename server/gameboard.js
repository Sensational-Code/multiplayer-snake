class Gameboard {
	constructor() {
		// Make sure the width and height are even numbers so the snake can spawn in the middle
		this.width = 24;
		this.height = 24;

		return this;
	}
}

module.exports = Gameboard;