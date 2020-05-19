const express = require('express')
const under = require("underscore")
const router = express.Router();
const mongoose = require('mongoose')
const jwt = require('jsonwebtoken')
const User = require('D:/VCampus-BackendApi/vcampus-api/app/models/user.js')
const bcrypt = require('bcrypt');
const saltRounds = 10;

//const User = require('models/user.js');

// Create and Save a new Note
exports.saveRegisterDetail = (req,res)=>{
    let userData = req.body;
    User.find({
      email: userData.username
    },function(err,result){
     if(err){
        console.log(err)
     } else if(under._.isEmpty(result)){
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
    };