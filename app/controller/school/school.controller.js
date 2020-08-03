const express = require('express')
const router = express.Router();
const mongoose = require('mongoose')
const jwt = require('jsonwebtoken')
const User = require('../../models/user')
const bcrypt = require('bcrypt');
const { isNull } = require('underscore');
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

   exports.getAllSchoolByTeacherId = async (req,res)=>{
    var teacherId = req.query.teacherId;
     try {
       const result = await User.find({ roles: { "$in": 3}, "school.teacher._id": { "$in": teacherId}});
       res.send(result);
     } catch (error) {
       console.log("error:", error);
       res.send({
         message: "Error retrieving schools.",
         error,
       });
     }
    };

    exports.getAllSchool = async (req,res)=>{
       try {
         const result = await User.find({ roles: { "$in": 3}})
         .select("_id school.school_name");
         const data = result.filter(a=>a.school.school_name != null);
         res.send(data);
       } catch (error) {
         console.log("error:", error);
         res.send({
           message: "Error retrieving schools.",
           error,
         });
       }
      };