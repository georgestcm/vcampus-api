var express = require('express');
var router = express.Router();


var generator = require('../../../app/controller/generator/generator.controller');
router.post('/generate_course_code', generator.generateCode);
router.get('/get_all_course_code', generator.getAllCourseCode);
module.exports = router;