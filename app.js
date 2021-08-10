// SETTING UP EXPRESS FOR FILE COMMUNICAITON
var express = require('express');
var app = express();
var serv = require('http').Server(app);

app.get('/', function(req, res) {
    res.sendFile(__dirname + '/index.html');
});
app.use('/client/',express.static(__dirname + '/client'));

serv.listen(2000, '192.168.0.2'); // localhost:2000
console.log('server started');

// list of connections
var SOCKET_LIST = {};
var PLAYER_LIST = {};

// WHEN PLAYER CONNECTS TO SERVER
var io = require('socket.io')(serv, {});
io.sockets.on('connection', function(socket){
    socket.id = Math.random();
    // make sure this id is unique
    while(SOCKET_LIST[socket.id] != null) {
        socket.id = Math.random();
    }
    SOCKET_LIST[socket.id] = socket;

    console.log('player connected with id = ' + socket.id);
    socket.emit('connected', socket.id);

    // receiving stats of player
    socket.on('updatePlayer', function(player) {
        PLAYER_LIST[player.id] = player;
    });

    socket.onclose = function() {
        console.log('player left');
        delete SOCKET_LIST[socket.id];
        delete PLAYER_LIST[socket.id];
    }
});


// sending player data to each client
setInterval(function() {
    pack = [];
    for(var i in PLAYER_LIST) {
        var player = PLAYER_LIST[i];
        pack.push(player);
    }
    for(var i in SOCKET_LIST) {
        var socket = SOCKET_LIST[i];
        // sending player list to each client (socket)
        socket.emit('playerList', pack);
    }
}, 1000/60);
