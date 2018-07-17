function ViewManager() {
	this.lobbyView = null;
	this.playerListContainer = null;
	this.playerListElem = null;
	this.startGameButton = null;

	this.gameView = null;

	return this;
}

ViewManager.prototype = {
	init: function() {
		this.lobbyView = document.getElementById('lobby-view');
		this.playerListContainer = document.getElementById('player-list-container');
		this.playerListElem = document.getElementById('player-list');
		this.startGameButton = document.getElementById('start-game-button');

		this.gameView = document.getElementById('game-view');
	},

	hideLobbyView: function() {
		this.lobbyView.style.display = 'none';
	},

	showLobbyView: function() {
		this.lobbyView.style.display = '';
	},

	hideGameView: function() {
		this.gameView.style.display = 'none';
	},

	showGameView: function() {
		this.gameView.style.display = '';
	},

	updateLobbyData: function(data) {
		var playerListElem = this.playerListElem;

		playerListElem.innerHTML = '';
		for (var playerIndex in data.players) {
			var player = data.players[playerIndex];
			var playerElem = document.createElement('h2');
			playerElem.innerHTML = playerIndex;
			playerElem.style.color = player.color;
			playerListElem.appendChild(playerElem);
		}
	}
}