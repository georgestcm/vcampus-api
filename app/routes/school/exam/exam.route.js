var express = require('express');
var router = express.Router();


var exam = require('../../../controller/school/exam/exam.controller');

 router.post('/post_exam', exam.saveExam);
 router.get('/get_exam/:examId', exam.findOneExam);
 router.get('/get_exam_by_school/:schoolId', exam.findAllBySchool);
 router.put('/update_exam/:examId', exam.updateExam);
 router.delete('/delete_exam/:examId', exam.deleteExam);
 router.get('/get_exam_by_course/:courseId', exam.findAllByCourse);

module.exports = router;

