var express = require('express');
var router = express.Router();


var curriculum = require('D:/VCampus-BackendApi/vcampus-api/app/controller/school/curriculum/curriculum.controller.js');
router.post('/post_curriculum_list', curriculum.saveCurriculum);
router.get('/get_curriculum_list', curriculum.getCurriculum);


module.exports = router;