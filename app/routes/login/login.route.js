var express = require('express');
var router = express.Router();


var loginUser = require('../../../app/controller/authentication/login/log.controller');
router.post('', loginUser.loginUserDetail);

module.exports = router;