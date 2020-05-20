var express = require('express');
var router = express.Router();


var registerUser = require('D:/VCampus/vcampus-api/app/controller/authentication/register/register.controller.js');
router.post('/register', registerUser.saveRegisterDetail);



module.exports = router;










   
    
    