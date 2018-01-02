var app = require('express')();
var http = require('http').Server(app);
// var roomname = 'DEFAULT_ROOM'
app.get('/', function(req, res){
  res.sendFile(__dirname + '/index.html');
});
