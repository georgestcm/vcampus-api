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
router.get("/course/findMediaByUserId/:userId",course.findMediaByUserId);
router.get("/course/findCoursesByCourseName/:searchText",course.findCoursesByCourseName);
router.get("/course/getCoursesByCurriculum/:curriculumId",course.findCoursesBySchoolId);
router.post("/course/shareCourseWithTeacher", course.shareCourseWithTeacher);

router.post("/course/saveInvite", course.saveInvite);
router.post("/course/editInviteStatus", course.editInviteStatus);
router.get("/course/getInvite/:teacherId",course.getInvite);
router.delete("/course/deleteInvite/:inviteId", course.deleteInvite);

router.get("/course/getCoursesV2/:schoolId/:userId",course.getCoursesV2);

module.exports = router;
