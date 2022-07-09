var express = require('express');
var router = express.Router();

var SchoolData = require('../../controller/school/school.controller');
router.post('/save_school_data', SchoolData.saveSchoolDetail);
router.get('/get_schools_by_teacherId',SchoolData.getAllSchoolByTeacherId);
router.get('/get_all_schools',SchoolData.getAllSchool);
router.get('/get_all_schools_for_admin',SchoolData.getAllSchoolForAdmin);
router.get('/get_all_students/:schoolId',SchoolData.getAllStudents);
router.put('/updateSchoolDetail',SchoolData.updateSchoolDetail);
router.get('/getAllAdminStaff',SchoolData.getAllAdminStaff);
router.get('/getAllSchoolStaff',SchoolData.getAllSchoolStaff);
router.put('/updateStaffDetail',SchoolData.updateStaffDetail);
router.delete('/deleteUserPermanent/:id',SchoolData.deleteUserPermanent);
router.get('/student_list',SchoolData.studentList);
router.post('/save_curriculam',SchoolData.saveCurriculam);
router.get('/get_curriculam',SchoolData.getAllCurriculam);
router.get('/get_curriculam_by_school/:schoolId',SchoolData.getAllCurriculamBySchoolId);
module.exports = router;