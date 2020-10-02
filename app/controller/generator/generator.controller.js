const express = require('express')
const under = require("underscore")
const router = express.Router();
const mongoose = require('mongoose')
const User = require('../../models/user')
const CourseCode = require('../../models/generator/courseCode.model');

exports.test = ( req, res) =>{
    res.send("OK");
}

exports.generateCode = (req,res)=>{
    let reqData = req.body;
    let courseCode = new CourseCode(reqData);
    courseCode.save((err,docs) =>{
        if(err){
            console.log(err)
        }
        else{   
            res.status(200).send({msg:'New Course Code has been added'})
        }
    });
    };

    exports.getAllCourseCode =async (req,res)=>{
        try {
            const result = await CourseCode.find();
            res.send(result);
        } catch (error) {
            res.status(500).send({msg : 'Error getting course code'});
        }
    }

    exports.studentCourseEnrollment =async (req,res)=>{
        try {
            console.log(req.body);
            const result = await CourseCode.findOne({courseCode : req.body.courseCode});
            if(result){
                // if(result.courseCodeValidFrom > new Date()){
                //     res.status(500).send({msg : 'Course code is not yet started'});
                // }
                // else if(result.courseCodeValidTo > new Date()){
                //     res.status(500).send({msg : 'Course code expired, cannot enroll.'});
                // }
              await CourseCode.findByIdAndUpdate({ _id : result._id},{assignedToStudent : req.body.studentId},function(err, code){
                    if(err){
                        res.status(500).send({msg : 'Error enrolling course code'});
                    }else{
                        res.status(200).send({msg : 'Enrollment Success', courseCode : result});
                    }
                });
            }else{
                res.status(500).send({msg : 'Course code not found for '+req.body.courseCode, err : result});
            }
             
            
        } catch (error) {
            res.status(500).send({msg : 'Error enrolling course code'});
        }
    }

    exports.getAllEnrolledCourse =async (req,res)=>{
        try {
            const result = await CourseCode.find({assignedToStudent : req.params.studentId})
            .populate({
                path: "course",
                model: "Courses",
                });
            res.send(result);
        } catch (error) {
            console.log(error);
            res.status(500).send({msg : 'Error getting courses'});
        }
    }

