const express = require('express')
const router = express.Router();
const mongoose = require('mongoose')
const Curriculum = require('D:/VCampus-BackendApi/vcampus-api/app/models/user')


exports.saveCurriculum = (req,res)=>{
    Curriculum.findOne({_id:req.body._id},(err,data)=>{
      if(err){
        console.log(err)
        res.status(401).send("DB error, please contact  admin")
      } else {
        if(data.school['curriculums'].includes(req.body.curriculum)){
          res.status(404).send("This school already has this curriculum")
        } else {
          Curriculum.update({_id:req.body._id},{ $push:{ "school.curriculums": req.body.curriculum}  },function(err,data){
            if(err){
              console.log(err)
            } else {
              res.status(200).send('Curriculum added')
            }
          })
        }
      }
    })
  };

  exports.getCurriculum = (req,res)=>{
    
    Curriculum.findOne({_id:req.body._id}  ,(err,data)=>{
      if(err){
        res.status(401).send(err)
      } else {
        res.status(200).send(data.school['curriculums'])
      }
    })
  };



  