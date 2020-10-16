var express = require('express');
var router = express.Router();


var question = require('../../../controller/school/multiplechoice_question/multiplechoice_question.controller');

 router.post('/post_question', question.saveQuestion);
 router.get('/get_question/:questionId', question.findOneQuestion);
 router.get('/get_question', question.findAll);
  router.put('/update_question/:questionId', question.updateQuestion);
  router.delete('/delete_question/:questionId', question.deleteQuestion);
  router.get('/get_questions_by_school/:schoolId',question.findAllBySchoolId);
  router.get('/get_questions_by_course_and_type/:courseId/:type',question.findAllByCourseAndType);

module.exports = router;

