var express = require('express');
var router = express.Router();


var schoolLogin = require('D:/VCampus/vcampus-api/app/controller/school/Auth/school-login/school-login.controller');
router.post('/register_school_login', schoolLogin.schoolLogin);



module.exports = router;