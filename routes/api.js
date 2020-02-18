const express = require('express')
const under = require("underscore")
const router = express.Router();
const mongoose = require('mongoose')
const jwt = require('jsonwebtoken')
const User = require('../models/user')
const bcrypt = require('bcrypt');
const saltRounds = 10;
//const db = "mongodb+srv://georges:1234@cluster0-rm0vl.mongodb.net/users?retryWrites=true&w=majority"
mongoose.set('useFindAndModify', false);
const db = "mongodb+srv://georges:vcampus2020@cluster0-fuxau.mongodb.net/vcampus?retryWrites=true&w=majority"


mongoose.connect(db,{useNewUrlParser: true},(err)=>{
if(err){
  console.log('The error is'+err)
} else {
  console.log('the databasee is connected')
}
})


router.get('/',(req,res)=>{
  res.send('api ready vcampus')

})

router.post('/register',(req,res)=>{
let userData = req.body;
User.find({
  email: userData.email
},function(err,result){
 if(err){
    console.log(err)
 } else if(under._.isEmpty(result)){
   console.log(result)
   User.find({
     username: userData.username
   },function(err,result2){
     if(err){
       console.log(err+"error")
     } else if (under._.isEmpty(result2)) {
       bcrypt.genSalt(saltRounds, function(err, salt) {
            bcrypt.hash(userData.password, salt, function(err, hash) {
              userData.password = hash;
              let user = new User(userData)
              user.save((error,registerUser)=>{
                if(error){
                  console.log(error)
                } else {
                  let payload = {
                    subject: registerUser._id
                  }
                  let token = jwt.sign(payload,"secretKey")
                  res.status(200).send({token,registerUser})
                }
              })
            });
        })
     } else {
       res.status(401).send('Username is already in use')
     }
   })
 } else {
   res.status(401).send('Email is already in use')
   }
})
})


router.post('/login',(req,res)=>{
  let userData = req.body;
  console.log(userData)
  User.findOne({
    username: userData.username
  },function(error,user){
    if(error){
      console.log(error)
    } else {
      if(!user){
        res.status(401).send('username not found')
      } else {
        bcrypt.compare(userData.password, user.password).then(function(resp) {
          if(resp === false){
            res.status(401).send('Invalid password')
          } else {
              if((user.roles.indexOf(userData.role_request) > -1)){
                let payload = {
                  subject: user._id
                }
                let token = jwt.sign(payload,"secretKey")
                let role = userData.role_request
                res.status(200).send({token,user,role})
              } else {
                res.status(401).send('You are not authorized to login with the selected role')
              }


          }
});

      }
    }

  })

})


module.exports = router;
