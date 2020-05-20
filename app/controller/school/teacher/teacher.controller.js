const express = require('express')
const router = express.Router();
const mongoose = require('mongoose')
const jwt = require('jsonwebtoken')
const User = require('D:/VCampus/vcampus-api/app/models/user.js')
const bcrypt = require('bcrypt');
const saltRounds = 10;

//const User = require('models/user.js');

// Create and Save a new Note
exports.saveTeacherDetail = (req,res)=>{
    let dataTeacher = req.body;
    let currentSchoolId= req.query.school_id;
    User.findOne({username:dataTeacher.username},function(err,teacher){
      if(err){
        console.log(err)
      } else {
        if(teacher){
          res.status(404).send({msg:"Username already in use"})
        } else {
          bcrypt.genSalt(saltRounds, function(err, salt) {
               bcrypt.hash(dataTeacher.password, salt, function(err, hash) {
                 dataTeacher.password = hash;
                 let user = new User(dataTeacher)
                 user.save((error,registerTeacher)=>{
                   if(err){
                     console.log(err)
                   } else {
                     User.updateMany({_id:currentSchoolId},{
                       $push:{
                         "school.teacher": {
                             _id: registerTeacher._id
                         }
                       }
                     },function(err,data){
                       if(err){
                         console.log(err)
                       } else {
                         User.update({_id:registerTeacher._id},{
                           $push:{
                             "teacher.schools": {
                                 _id: currentSchoolId
                             }
                           }
                         },function(err,data){
                           if(err)
                              console.log(err)
                              else
                              res.status(200).send({msg:'New teacher has been added'})
                         })
                       }
                     })
                   }
                 })
               });
           })
        }
      }
    })
  };