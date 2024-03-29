const express = require("express");
const bodyParser = require("body-parser");
cors = require("cors");
const app = express();
const mongoose = require("mongoose");
const dbConfig = require("../app/core/config/db.config");
const router = express.Router();
var morgan = require('morgan');
var http = require('http').createServer(app);
var io = require('socket.io')(http);
const groupModel = require("./models/chat/group.model");
const WebSocket = require('ws');

//cors policy
// app.use(function (req, res, next) {
//   res.header("Access-Control-Allow-Origin", "*");
//   res.header("Access-Control-Allow-Methods", "GET, PUT, POST, DELETE");
//   res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");
//   next();
// });

// var corsOptions = {
//   origin: 'https://vcampus-api.herokuapp.com/',
//   optionsSuccessStatus: 200 // For legacy browser support
//  // methods: "GET, PUT, POST, DELETE"
// }

app.use(cors({
  methods: ['GET','POST','DELETE','UPDATE','PUT','PATCH']
}));

//app.use(cors(corsOptions));

//app.options('*', cors()) 

app.use(morgan('tiny'));
app.use(express.static('public'));
const PORT = process.env.PORT || 3000;
// app.listen(PORT, function () {
//   console.log("server has been started at "+PORT);
// });
http.listen(PORT, () => {
  console.log('listening on *:'+PORT);
});

app.use(bodyParser.json());
app.use(
  bodyParser.urlencoded({
    limit: "500mb",
    extended: false,
    parameterLimit: 50000,
  })
);

mongoose.Promise = global.Promise;

// Connecting to the database
mongoose
  .connect(dbConfig.url, {
    useNewUrlParser: true,
  })
  .then(() => {
    console.log("Successfully connected to the database");
  })
  .catch((err) => {
    console.log("Could not connect to the database. Exiting now...", err);
    process.exit();
  });

app.get("/", (req, res) => {
  res.json("api ready vcampus");
});

//app.use(cors());

//for add/register new user
const user = require("./routes/register/register.route");
app.use("/api", user);

//for login user
const loginUser = require("./routes/login/login.route");
app.use("/api/login", loginUser);

//for add curriculum
const curriculum = require("./routes/school/curriculum/curriculum.route");
app.use("/api", curriculum);

//for school login
const schoolLogin = require("../app/routes/school/Auth/school-login/school-login.route");
app.use("/api/register_school_login", schoolLogin);

//for add school teacher
const schoolTeacher = require("./routes/school/teacher/teacher.route");
app.use("/api", schoolTeacher);

//for add school
const school = require("./routes/school/school.route");
app.use("/api", school);

//add-update-get-delete course
const course = require("./routes/school/course/course.route");
app.use("/api", course);

//add-update-get-delete exam
const exam = require("./routes/school/exam/exam.route");
app.use("/api", exam);

//add-update-get-delete question
const question = require("./routes/school/multiplechoice_question/multiplechoice_question.route");
app.use("/api", question);

//add-update-get-delete chat
const chat = require("./routes/chat/chat.route");
app.use("/api", chat);

//add-update-get-delete group
const group = require("./routes/chat/Group/group.route");
app.use("/api", group);

//add-update-get-delete groupmember
const groupmember = require("./routes/chat/Group/groupmember.route");
app.use("/api", groupmember);

//add-update-get-delete course
const courseCode = require("./routes/school/course/courseCode.route");
app.use("/api", courseCode);

//Code Generator
const codeGenerator = require("./routes/generator/generator.route");
app.use("/api", codeGenerator);

//Meeting
const meeting = require("./routes/meeting/meeting.route");
app.use("/api", meeting);

//Socket IO
app.get('/socket', (req, res) => {
  res.json("api ready for chat");
});

io.on('connection', (socket) => {
    console.log('a user connected');

      socket.on('send-message', (message)=>{
        //console.log(message);
        io.emit('message',{ msg : message.text, user : socket.username, createdOn : new Date()})
        //io.sockets.in('user1@example.com').emit('new_msg', {msg: 'hello'});
      });

      socket.on('send-group-message', (message)=>{
        //console.log(message);
        io.to(socket.username).emit('group-message',{ msg : message.text, user : socket.username, sentBy : message.sentBy, createdOn : new Date()})
        //Save Data in DB
        //io.emit('message',{ msg : message.text, user : socket.username, createdOn : new Date()})

        try {
          groupModel.findOne({ _id: message.groupId }).then(
            (group) => {
              if (group) {
                const json = {SentBy : message.loggedInUserId, Message : message.text};
                console.log(json);
                group.Chats.push(json);
                group.save();
                //console.log("saved");
              }
            },
            (err) => {
              console.log(err);
            }
          );
        } catch (error) {
          console.log("error", error);
        }

      });

      socket.on('group-join',  (groupId) => {  
        //console.log(groupId);    
        socket.username = groupId;
        //console.log(socket.username);
        socket.join(socket.username);
        io.emit('user-changed',{ user : socket.username , event : 'joined'})
        //io.emit('is_online',  + socket.username + ' join the chat..</i>');
    });

      socket.on('set-name',  (username) => {      
        socket.username = username;
        //console.log(socket.username);
        socket.join(username);
        io.emit('user-changed',{ user : username , event : 'joined'})
        //io.emit('is_online',  + socket.username + ' join the chat..</i>');
    });

    socket.on('disconnect', () => {
      console.log('user disconnected');
      io.emit('user-changed', {user : socket.username, event : 'left'})
    });

  });

  //******************** WebSocket ***************************
  const wss = new WebSocket.Server({ port: 8081 }, (req) => {
    console.log("Signalling server is now listening on port 8081");
});

wss.broadcast = (ws, data) => {
  wss.clients.forEach((client) => {
      if (client !== ws && client.readyState === WebSocket.OPEN) {
          client.send(data);
      }
  });
};

wss.on('connection', (ws, req) => {
  console.log(`Client connected. Total connected clients: ${wss.clients.size}`);
  console.log(req.socket.remoteAddress);

  ws.on('message', message => {
      // msg = JSON.parse(message);
      console.log(message + "\n\n");
      wss.broadcast(ws, message);
  });
  ws.on('close', ws=> {
      console.log(`Client disconnected. Total connected clients: ${wss.clients.size}`);
  })

  ws.on('error', error => {
      console.log(`Client error. Total connected clients: ${wss.clients.size}`);
  });
});

//*********************************** WebSocket Ended***************** */