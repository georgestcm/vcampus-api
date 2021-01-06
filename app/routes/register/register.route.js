var express = require('express');
var router = express.Router();


var registerUser = require('../../../app/controller/authentication/register/register.controller');
router.post('/register', registerUser.saveRegisterDetail);
router.post('/update_profile', registerUser.updateUserProfile);



module.exports = router;










   
    
    