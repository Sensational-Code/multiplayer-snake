const express = require('express');
const app = express();
const server = require('http').createServer(app);
const io = require('socket.io')(server);

const Lobby = require('./server/lobby.js');

app.get('/', function (request, response) {
	if (request.query.lobby) {
		response.sendFile(__dirname + '/client/index.html');
	} else {
		response.sendFile(__dirname + '/views/home.html');
	}
});

app.use('/client/', express.static(__dirname + '/client/'));


// no create room for now, just have one room and only have people join it
var lobbies = {
	'abc123': new Lobby('abc123', io)
};

io.sockets.on('connection', function(socket) {

    socket.on('join_room', function(roomID) {
    		var lobby = lobbies[roomID];
    		if (!lobby) {
    			socket.emit('lobby_not_exist');
    			return;
    		}

  			lobby.addPlayer(socket.id);
  			socket.emit('lobby_joined', {players: lobby.players});

        socket.join(roomID);
        io.sockets.in(roomID).emit('update_game', {
        	players: lobby.players,
        	candy: lobby.candy
        });

        socket.on('disconnect', function() {
    			lobby.removePlayer(socket.id);
    			io.sockets.in(roomID).emit('update_game', {
	        	players: lobby.players,
	        	candy: lobby.candy
	        });
				});

				socket.on('lobby_start', function() {
    			if (Object.keys(lobby.players).length >= lobby.config.minPlayers) {
  					lobby.start();
  					io.sockets.in(roomID).emit('game_start');
  				}
				});

        socket.on('new_direction', function(direction) {
        	lobby.players[socket.id].direction = direction;
       		io.sockets.in(roomID).emit('update_game', {
	        	players: lobby.players,
	        	candy: lobby.candy
	        });
        });
    });

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