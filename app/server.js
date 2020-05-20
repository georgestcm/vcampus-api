const express = require('express')
const bodyParser = require('body-parser')
const cors = require('cors')
const app = express()
app.use(cors())
const mongoose = require('mongoose');
const dbConfig = require('../app/core/config/db.config');
const router = express.Router();

//const PORT = process.env.PORT || 3000;
app.listen(process.env.PORT || 3000,function(){
  console.log('server has been started')
})

app.use(bodyParser.json({limit: "500mb"}));
app.use(bodyParser.urlencoded({limit: "500mb", extended: true, parameterLimit:50000}));
//const dbConfig = require('./config/database.config.js');

mongoose.Promise = global.Promise;

// Connecting to the database
mongoose.connect(dbConfig.url, {
    useNewUrlParser: true
}).then(() => {
    console.log("Successfully connected to the database");    
}).catch(err => {
    console.log('Could not connect to the database. Exiting now...', err);
    process.exit();
});

app.get('/', (req, res) => {
  res.json("api ready vcampus");
});


//for add/register new user
const user=require('./routes/register/register.route');
app.use('/api/register',user);

//for login user
const loginUser=require('./routes/login/login.route');
app.use('/api/login',loginUser);

//for add curriculum
const curriculum=require('./routes/school/curriculum/curriculum.route');
app.use('/api',curriculum);

//for school login
const schoolLogin=require('../app/routes/school/Auth/school-login/school-login.route');
app.use('/api/register_school_login',schoolLogin);

//for add school teacher
const schoolTeacher=require('./routes/school/teacher/teacher.route');
app.use('/api/create_new_teacher',schoolTeacher);

//for add school 
const school=require('./routes/school/school.route');
app.use('/api/save_school_data',school);

//add-update-get-delete course
const course=require('./routes/school/course/course.route');
app.use('/api',course);
