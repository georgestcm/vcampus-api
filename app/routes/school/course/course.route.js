var express = require('express');
var router = express.Router();


var course = require('D:/VCampus-BackendApi/vcampus-api/app/controller/school/course/course.controller');

router.post('/post_course', course.saveCourse);
router.get('/get_course/:courseId', course.findOneCourse);
router.put('/update_course/:courseId', course.updateCourse);
router.delete('/delete_course/:courseId', course.deleteCourse);


module.exports = router;