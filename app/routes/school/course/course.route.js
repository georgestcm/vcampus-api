var express = require("express");
var router = express.Router();

var course = require("../../../controller/school/course/course.controller");

router.post("/post_course", course.saveCourse);
router.get("/get_course/:courseId", course.findCourseById);
router.get("/get_courses", course.findCourses);
router.put("/update_course/:courseId", course.updateCourse);
router.delete("/delete_course/:courseId", course.deleteCourse);

module.exports = router;
