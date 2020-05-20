var express = require('express');
var router = express.Router();


var school_Login = require('../../../../controller/school/Auth/school-login/school-login.controller');
router.post('', school_Login.schoolLogin);



module.exports = router;