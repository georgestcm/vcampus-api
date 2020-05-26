

// Import all our dependencies
var express  = require('express');
var app      = express();
var server   = require('http').Server(app);
var io       = require('socket.io')(server);
var path = require('path');
// tell express where to serve static files from
app.use(express.static(__dirname + '/app'));


server.listen(9992);
console.log('It\'s going down in 9992');


// allow CORS
app.all('*', function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-type,Accept,X-Access-Token,X-Key');
  if (req.method == 'OPTIONS') {
    res.status(200).end();
  } else {
    next();
  }
});

app.get('/', function(req, res) {
  //send the index.html in our app directory
  res.sendFile("index.html",{ root : __dirname});

});


//Listen for connection
io.on('connection', function(socket) {
  socket.on('chat message', function(msg){
    io.emit('chat message', msg);
  });

});