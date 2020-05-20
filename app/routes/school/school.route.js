var express = require('express');
var router = express.Router();


var SchoolData = require('../../controller/school/school.controller');
router.post('/save_school_data', SchoolData.saveSchoolDetail);



module.exports = router;