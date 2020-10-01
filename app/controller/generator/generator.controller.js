const express = require('express')
const under = require("underscore")
const router = express.Router();
const mongoose = require('mongoose')
const User = require('../../models/user')
const CourseCode = require('../../models/generator/courseCode.model');

exports.test = ( req, res) =>{
    res.send("OK");
}

// Create and Save a new Note
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