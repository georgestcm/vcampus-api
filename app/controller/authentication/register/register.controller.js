const express = require('express')
const under = require("underscore")
const router = express.Router();
const mongoose = require('mongoose')
const jwt = require('jsonwebtoken')
const User = require('../../../models/user')
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
                      //res.status(200).send({success : true, message : `username ${registerUser.username} has been added with default password.`})
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


    // Update profile
exports.updateUserProfile =  (req, res) => {
    let userData = req.body;
    try {
    User.findOne({
      username: userData.username
    },function(err,user){
     if(err){
        console.log(err)
        res.status(401).send({success : false , msg : err});
     } 
     else
     {
       if(userData.action=='Change Password'){
        bcrypt.compare(userData.password, user.password).then(function(resp) {
            if(resp === false){
              res.status(401).send('Current password does not match, please try again');
            } else {
              bcrypt.genSalt(saltRounds, function(err, salt) {
                console.log(userData.confirm_password);
                bcrypt.hash(userData.confirm_password, salt, function(err, hash) {
                  
                   User.updateOne({_id: userData._id}, { $set:{password : hash}},function(err,docs){
                      if(err){
                        res.status(401).send({success : false , msg : "Couldn't update your password right now, please try again later"});
                      }else{
                        res.status(200).send({success : true, msg :'Password changed successfully'})
                      }
                  });
                   
                })
              })
            }
          })
        } else if(userData.action =='Update Profile'){
          User.updateOne({_id: userData._id}, {$set :{first_name :userData.first_name, last_name : userData.last_name, email :userData.email}},function(err,docs){
              if(err){
                res.status(401).send({success : false , msg : "Couldn't update your profile right now, please try again later."});                
              }else{
                res.status(200).send({success : true, msg :'Profile updated successfully'});
              }
          });
          
        }
        else if(userData.action =='Update School Profile'){
          User.updateOne({_id: userData._id}, {$set :{"school.principal_first_name" :userData.first_name, "school.principal_first_name" : userData.last_name, email :userData.email}},function(err,docs){
              if(err){
                res.status(401).send({success : false , msg : "Couldn't update your profile right now, please try again later."});                
              }else{
                res.status(200).send({success : true, msg :'Profile updated successfully'});
              }
          });
          
        }
        }
      })
    } catch (error) {
      console.log(error);
      res.send(error);
    }
    };
    