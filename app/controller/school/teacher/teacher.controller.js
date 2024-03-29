const express = require('express')
const router = express.Router();
const mongoose = require('mongoose')
const jwt = require('jsonwebtoken')
const User = require('../../../models/user')
const bcrypt = require('bcrypt');
const user = require('../../../models/user');
const saltRounds = 10;

//const User = require('models/user.js');

// Create and Save a new Note
exports.saveTeacherDetail = (req,res)=>{
  try {
    
  
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
                   if(error){
                     console.log(error)
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
                         console.log("POINT3");
                       } else {
                         console.log("teacherInSchool.schools");
                         User.update({_id:registerTeacher._id},{
                           $push:{
                             "teacherInSchool.schools": {
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
  } catch (error) {
    res.status(405).send({msg:error})
  }
  };

  exports.getAllTeacher = async (req,res)=>{
   var username = req.query.username;
    try {
      const result = await User.find({ roles: { "$in": 5}, username: username  });
      res.send(result);
    } catch (error) {
      console.log("error:", error);
      res.send({
        message: "Error retrieving teachers.",
        error,
      });
    }
  }

  exports.getAllTeacherForAdmin = async (req,res)=>{
     try {
       const result = await User.find({ roles: { "$in": 5} });
       res.send(result);
     } catch (error) {
       console.log("error:", error);
       res.send({
         message: "Error retrieving teachers.",
         error,
       });
     }
   }

   exports.getAllTeachersBySchool = async (req,res)=>{
    var schoolId = req.params.schoolId;
   
     try {
       const result = await User.findOne({ _id: schoolId  })
       .populate("school.teacher._id")
       .select("school.teacher");
       res.status(200).json(result);
     } catch (error) {
       console.log("error:", error);
       res.send({
         message: "Error retrieving teachers.",
         error,
       });
     }
   }

  exports.addTeacherToSchool = async (req,res) =>{
    var teacherId = req.body.teacherId;
    var schoolId = req.body.schoolId;
    User.findOne({_id: schoolId, "school.teacher._id":{"$in" : teacherId}},function(err,teacher){
      if(err){
        console.log(err)
      } else if(teacher){
          res.status(405).send({msg:"Teacher already assigned for this school."})
        }
        else{
          User.update({_id:schoolId},{
            $push:{
              "school.teacher": {
                  _id: teacherId
              }
            }
          },function(err,data){
            if(err){
              res.status(200).send({msg:err})
            } else {
              User.update({_id:teacherId},{
                $push:{
                  "teacherInSchool.schools": {
                      _id: schoolId
                  }
                }
              },function(err,data){
                if(err){
                  res.status(405).send({msg:err});
                }else{
                  res.status(200).send({msg:'New teacher has been added'});
                }
              });
              
            }
          });
        }
    });
       
  }

  exports.updateTeacherDetail = (req,res)=>{
    try {
      User.findByIdAndUpdate(req.body._id, req.body,function(err, teacher){
        if(err){
          res.status(405).send({msg:error, success : false})
        }else{
          res.status(200).send({msg:"Teacher updated!", success : true})
        }
      });
      
    } catch (error) {
      res.status(405).send({msg:error})
    }
    };