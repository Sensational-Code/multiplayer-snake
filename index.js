const express = require('express');
const app = express();
const server = require('http').createServer(app);
const io = require('socket.io')(server);

const LobbyManager = require('./server/lobbymanager.js')(io);
const Lobby = require('./server/lobby.js');


app.get('/', function (request, response) {
	response.sendFile(__dirname + '/client/index.html');
});

app.use('/client/', express.static(__dirname + '/client/'));


function createLobby() {
	var lobby = LobbyManager.createLobby();
	joinLobby.bind(this, lobby.id)();
}

function joinLobby(id) {
	var lobby = LobbyManager.getLobby(id);
	if (!lobby) {
		this.emit('lobby-not-exist');
		return;
	}

	lobby.addPlayer(this.id);
	this.join(id);

	this.emit('lobby-joined', {
		players: lobby.players,
		inGame: lobby.inGame
	});

	this.lobby = lobby;

	io.sockets.in(id).emit('update-game', {
		players: lobby.players,
		candy: lobby.game.candy,
		inGame: lobby.inGame
	});

	this.on('disconnect', disconnect);

	this.on('lobby-start', lobbyStart);

	this.on('new-direction', newDirection);
}

function joinAnyLobby() {
	// If there aren't any lobbies to join, create a new one
	if (LobbyManager.lobbyCount < 1) {
		let lobby = LobbyManager.createLobby();
		this.emit('found-lobby', lobby.id);
	} else {
		let bestLobby = null;
		// Loop through each lobby to find the lobby that is the most full
		for (prop in LobbyManager.lobbies) {
			let lobby = LobbyManager.lobbies[prop];
			// If the lobby has space and is more full
			if (lobby.playerSpace > 0 && lobby.playerSpace < (!!bestLobby ? bestLobby.playerSpace : Infinity)) {
				bestLobby = lobby;
			}
		}
		// If we didn't find a suitable lobby, create a new one
		if (!bestLobby) {
			bestLobby = LobbyManager.createLobby();
		}
		this.emit('found-lobby', bestLobby.id);
	}
}

function disconnect() {
	var lobby = this.lobby;
	lobby.removePlayer(this.id);
	if (lobby.playerCount < 1) {
		console.log(`Lobby ${lobby.id} is empty`);
		LobbyManager.removeLobby(lobby.id);
	} else {
		io.sockets.in(lobby.id).emit('update-game', {
			players: lobby.players,
			candy: lobby.game.candy,
			inGame: lobby.inGame
		});
		if (!lobby.hasEnoughPlayers) {
			lobby.stop();
			io.sockets.in(lobby.id).emit('game-end');
		}
	}
}

function lobbyStart() {
	var lobby = this.lobby;
	if (lobby.hasEnoughPlayers) {
		lobby.start();
		io.sockets.in(lobby.id).emit('game-start');
	}
}

function newDirection(direction) {
	var lobby = this.lobby;
	lobby.players[this.id].direction = direction;
	io.sockets.in(this.lobby.id).emit('update-game', {
		players: lobby.players,
		candy: lobby.game.candy,
		inGame: lobby.inGame
	});
}


io.sockets.on('connection', function(socket) {

	socket.on('create-lobby', createLobby);

	socket.on('join-any-lobby', joinAnyLobby);

	socket.on('join-lobby', joinLobby);

});

// connection request
// wait for "join-lobby" request
	// if game is full, respond with "lobby-full" and don't add
	// if game is in progress, assign them as a spectator
	// otherwise, add them
	// send them a success response so player renders the lobby page
	// wait for "start-game" request
		// if the request was from the host, start the game
		// if not, ignore it or send a response saying only the host can start the game

// disconnect request
// check if the player was in a lobby
	// if yes, remove them from it
	// if the player was the host, check if there is anyone else in the lobby
		// if yes, then assign a new player to be host
		// if not, delete the lobby

// start game
// generate and send snake locations, make sure they don't overlap
// spawn one candy, make sure it doesn't overlap any snake
// create a game loop for the lobby
	// update the direction and position

// input/direction-change request
// verify that the direction is valid (number that is either 1, -1, 2, or -2)
// verify that the new direction is valid
	// if yes, update the "new" direction
	// if not, don't do anything/send wrong way response

var port = 4444;
server.listen(port, function() {
	console.log('Server started on port ' + port + '!');
});