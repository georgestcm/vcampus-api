var express = require('express');
var router = express.Router();

var sectionData = require('../../controller/school/section/section.controller');
router.post('saveSection', sectionData.saveSection);

module.exports = router;