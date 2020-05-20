var express = require('express');
var router = express.Router();


var registerUser = require('../../../app/controller/authentication/register/register.controller');
router.post('/register', registerUser.saveRegisterDetail);



module.exports = router;










   
    
    