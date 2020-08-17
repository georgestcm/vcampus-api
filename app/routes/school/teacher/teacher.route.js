var express = require('express');
var router = express.Router();


var addTeacher = require('../../../controller/school/teacher/teacher.controller');
router.post('/create_new_teacher', addTeacher.saveTeacherDetail);
router.get('/get_all_teachers', addTeacher.getAllTeacher);
router.put('/add_teacher_to_school', addTeacher.addTeacherToSchool);
router.get('/getAllTeacherForAdmin', addTeacher.getAllTeacherForAdmin);
module.exports = router;