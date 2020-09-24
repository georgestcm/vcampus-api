//require the express module
const express = require("express");
const app = express();
const router = express.Router();
const bodyParser = require("body-parser");
const chatRouter = require("./route");
const mongoose = require("mongoose");
mongoose.Promise = require("bluebird");
const http = require("http").Server(app);
var server   = require('http').Server(app);
var io       = require('socket.io')(server);

app.use(bodyParser.json());
app.use("/api/chats", chatRouter);

app.listen(process.env.PORT || 4000, function () {
  console.log("server has been started 4000");
});
app.get("/", (req, res) => {
  res.json("api ready for chat");
});

const chatModel = require("../models/chat/chat.model");
const  connect  = require("./db");

io.on('connection', (socket) => {
  console.log('a user connected');
});

io.sockets.on('connection', async (socket) => { 
try{
  console.log("connected!");
      socket.on('username',  (username) => {      
        socket.username = username;
        console.log(socket.username);
        io.emit('is_online',  + socket.username + ' join the chat..</i>');
    });
      socket.on('disconnect',  (username) => {
          io.emit('is_offline',  + socket.username + ' left the chat..</i>');
      })

    socket.on('chat_message', async  (chat)=> {                      
        socket.broadcast.emit("received", { Message: chat });
          
        connect.then( async (db) => {          
            let chatMessage = new chatModel({           
              Message: chat.Message,
              To:chat.ToId,
              From:chat.FromId
            });             
          const chatDetails = await chatMessage.save();          
          const chatuser= await chatModel.find({ _id:chatDetails._id }).populate({
                  path: "From",
                  model: "user",
                  select: "username",
                }).populate({
                  path: "To",
                  model: "user",
                  select: "username",
                }).exec();           
          io.emit('chat_message',   chatuser );         
        });
    });
  }
   catch (error) {
      console.log("err:", error);
      res.status(500).send({
        message: "Error retrieving group with id " + req.params.chatId,
      });
  }
});

