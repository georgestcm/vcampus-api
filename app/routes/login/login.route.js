var express = require('express');
var router = express.Router();


var loginUser = require('D:/VCampus-BackendApi/vcampus-api/app/controller/authentication/login/log.controller');
router.post('/login', loginUser.loginUserDetail);

module.exports = router;