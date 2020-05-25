const express = require('express')
const router = express.Router();
const mongoose = require('mongoose')
const jwt = require('jsonwebtoken')
const User = require('../../models/user')
const bcrypt = require('bcrypt');
const saltRounds = 10;

// Create and Save a new Note
exports.saveSchoolDetail = (req,res)=>{
    let schoolData = req.body;
   
    User.updateMany({_id:schoolData.school_id},{
      $set:{
        school: {
          school_name:schoolData.school_name,
          principal_first_name:schoolData.principal_first_name,
          principal_last_name: schoolData.principal_last_name,
          description:schoolData.description,
          registration_valid: true
        }
        
      }
   
    },function(err,result){
      if(err){
        res.status(401).send(err)
      } else {
        bcrypt.genSalt(saltRounds, function(err, salt) {
             bcrypt.hash(schoolData.password, salt, function(err, hash) {
               schoolData.password = hash;
               User.updateMany({_id:schoolData.school_id},{
                 $set:{
                   password:hash
                 }
               },function(err,result){
                 if(err){
                   console.log(err)
                 } else {
                   res.status(200).send(result)
                 }
               })
             });
   
         })
   
      }
   
    })
   
   };