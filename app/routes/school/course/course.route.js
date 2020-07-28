var express = require("express");
var router = express.Router();

var course = require("../../../controller/school/course/course.controller");

router.post("/course/save", course.saveCourse);
router.get("/course/get/:courseId", course.findCourseById);
router.get("/course/getall", course.findCourses);
router.put("/course/update/:courseId", course.updateCourse);
router.delete("/course/delete/:courseId", course.deleteCourse);
router.post("/course/uploadDocs", course.uploadDocs);
router.get("/course/readFile/:filename", course.readDocs);
router.put("/course/addCode",course.addCodeToCourse);
router.get("/course/getCoursesByCode/:code",course.findCoursesByCode);
router.get("/course/getCoursesBySchoolId/:schoolId",course.findCoursesBySchoolId);

module.exports = router;
