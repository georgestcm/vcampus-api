var app = require('express')();
var http = require('http').createServer(app);
var io = require('socket.io')(http);

app.get('/', (req, res) => {
  //res.sendFile(__dirname + '/index.html');
  res.json("api ready for chat");
});

io.on('connection', (socket) => {
    console.log('a user connected');

    socket.broadcast.emit('hi');
    
    socket.on('send message', (msg) => {
        console.log('message: ' + msg);
      });

      socket.on('set-name',  (username) => {      
        socket.username = username;
        console.log(socket.username);
        io.emit('user-changed',{ username : username , event : 'joined'})
        //io.emit('is_online',  + socket.username + ' join the chat..</i>');
    });

    socket.on('disconnect', () => {
      console.log('user disconnected');
      io.emit('user-changed', {user : socket.username, event : 'left'})
    });

    socket.on('send-message', (message)=>{
      io.emit('message',{ msg : message.text, user : socket.username, createdOn : new Date()})
    });

  });

http.listen(4000, () => {
  console.log('listening on *:4000');
});