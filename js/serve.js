var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var roompasses = {};
function valid(roomname,key){
  return roompasses[roomname][0] == key;
}
// var roomname = 'DEFAULT_ROOM'
app.get('/', function(req, res){
  res.sendFile(__dirname + '/index.html');
});
