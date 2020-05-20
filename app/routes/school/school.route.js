var express = require('express');
var router = express.Router();


var SchoolData = require('../../controller/school/school.controller');
router.post('', SchoolData.saveSchoolDetail);



module.exports = router;