var express = require('express');
var router = express.Router();


var SchoolData = require('D:/VCampus/vcampus-api/app/controller/school/school.controller');
router.post('/save_school_data', SchoolData.saveSchoolDetail);



module.exports = router;