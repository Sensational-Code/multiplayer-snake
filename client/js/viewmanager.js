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
		this.homeView = document.getElementById('home-view');
		this.playerName = document.getElementById('player-name');
		this.playButton = document.getElementById('play-button');
		this.createButton = document.getElementById('create-button');
		this.joinButton = document.getElementById('join-button');
		this.joinInput = document.getElementById('join-input');

		this.lobbyView = document.getElementById('lobby-view');
		this.playerListContainer = document.getElementById('player-list-container');
		this.playerListElem = document.getElementById('player-list');
		this.startGameButton = document.getElementById('start-game-button');

		this.gameView = document.getElementById('game-view');
	},

	showHomeView: function() {
		this.homeView.style.display = '';
		this.lobbyView.style.display = 'none';
		this.gameView.style.display = 'none';
	},

	showLobbyView: function() {
		this.homeView.style.display = 'none';
		this.lobbyView.style.display = '';
		this.gameView.style.display = 'none';
	},

	showGameView: function() {
		this.homeView.style.display = 'none';
		this.gameView.style.display = '';
		this.lobbyView.style.display = 'none';
	},

	updateLobbyData: function(data) {
		var playerListElem = this.playerListElem;

		playerListElem.innerHTML = '';
		for (var playerIndex in data.players) {
			var player = data.players[playerIndex];
			var playerElem = document.createElement('h2');
			playerElem.innerHTML = player.name + (player.isHost ? ' (host)' : '');
			playerElem.style.color = player.color;
			playerListElem.appendChild(playerElem);
		}
	}
}