var express = require('express');
var router = express.Router();

var SchoolData = require('../../controller/school/school.controller');
router.post('/save_school_data', SchoolData.saveSchoolDetail);
router.get('/get_schools_by_teacherId',SchoolData.getAllSchoolByTeacherId);
router.get('/get_all_schools',SchoolData.getAllSchool);
router.get('/get_all_schools_for_admin',SchoolData.getAllSchoolForAdmin);
router.get('/get_all_students/:schoolId',SchoolData.getAllStudents);
router.put('/updateSchoolDetail',SchoolData.updateSchoolDetail);

module.exports = router;