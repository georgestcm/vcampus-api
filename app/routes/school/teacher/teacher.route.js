var express = require('express');
var router = express.Router();


var addTeacher = require('D:/VCampus-BackendApi/vcampus-api/app/controller/school/teacher/teacher.controller');
router.post('/create_new_teacher', addTeacher.saveTeacherDetail);

module.exports = router;