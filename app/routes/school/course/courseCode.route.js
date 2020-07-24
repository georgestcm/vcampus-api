var express = require("express");
var router = express.Router();

var courseCode = require("../../../controller/school/courseCode/courseCode.controller");

router.post("/courseCode/save", courseCode.saveCourseCode);
router.get("/courseCode/get/:id", courseCode.getCourseCodeById);
router.get("/courseCode/getall", courseCode.getAllCourseCode);
router.put("/courseCode/update/:id", courseCode.updateCourseCode);
router.delete("/courseCode/delete/:id", courseCode.deleteCourseCode);

module.exports = router;
