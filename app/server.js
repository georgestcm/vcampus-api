const express = require("express");
const bodyParser = require("body-parser");
cors = require("cors");
const app = express();
const mongoose = require("mongoose");
const dbConfig = require("../app/core/config/db.config");
const router = express.Router();
var morgan = require('morgan')

//cors policy
app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Methods", "GET, PUT, POST, DELETE");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");
  next();
});
app.use(morgan('tiny'));
app.use(express.static('public'));
const PORT = process.env.PORT || 3000;
app.listen(PORT, function () {
  console.log("server has been started at "+PORT);
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

app.use(cors());

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