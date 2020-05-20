var express = require('express');
var router = express.Router();


var addTeacher = require('../../../controller/school/teacher/teacher.controller');
router.post('', addTeacher.saveTeacherDetail);

module.exports = router;