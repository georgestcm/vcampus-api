var express = require('express');
var router = express.Router();


var generator = require('../../../app/controller/generator/generator.controller');
router.post('generate', generator.generateCode);
router.get('/test', generator.test);
module.exports = router;