var express = require('express');
var router = express.Router();


var exam = require('../../../controller/school/exam/exam.controller');

 router.post('/post_exam', exam.saveExam);
// router.get('/get_exam/:examId', exam.findOneExam);
 router.put('/update_exam/:examId', exam.updateExam);
 router.delete('/delete_exam/:examId', exam.deleteExam);

module.exports = router;

