var express = require('express');
var router = express.Router();


var addTeacher = require('../../../controller/school/teacher/teacher.controller');
router.post('/create_new_teacher', addTeacher.saveTeacherDetail);

module.exports = router;