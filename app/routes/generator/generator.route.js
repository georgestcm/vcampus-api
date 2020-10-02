var express = require('express');
var router = express.Router();


var generator = require('../../../app/controller/generator/generator.controller');
router.post('/generate_course_code', generator.generateCode);
router.get('/get_all_course_code', generator.getAllCourseCode);
router.put('/student_course_enrollment', generator.studentCourseEnrollment);
router.get('/get_all_enrolled_course/:studentId', generator.getAllEnrolledCourse);
module.exports = router;