const express = require('express');
const app = express();
const server = require('http').createServer(app);
const io = require('socket.io')(server);

const LobbyController = require('./server/controllers/lobbycontroller.js');
let lobbyController = new LobbyController(io);


app.get('/', function (request, response) {
	response.sendFile(__dirname + '/client/index.html');
});

app.use('/client/', express.static(__dirname + '/client/'));


const PORT = process.env.PORT || 4444;
server.listen(PORT, function() {
	console.log(`Server started on port ${PORT}!`);
});
