const express = require("express");
const under = require("underscore");
const router = express.Router();
const mongoose = require("mongoose");
const User = require("../../models/user");
const CourseCode = require("../../models/generator/courseCode.model");
const Courses = require("../../models/school/course/course.model")

//Single
// exports.generateCode = (req, res) => {
//   let reqData = req.body;
//   console.log(reqData);
//   let courseCode = new CourseCode(reqData);
//   courseCode.save((err, docs) => {
//     if (err) {
//       console.log(err);
//     } else {
//       res.status(200).send({ msg: "New Course Code has been added" });
//     }
//   });
// };

//Many
exports.generateCode = (req, res) => {
  CourseCode.insertMany(req.body).then(function(){
    res.status(200).send({ msg: "New Course Code has been added" });
  }).catch(function(err){
    console.log(err);
  })
};

exports.getAllCourseCode = async (req, res) => {
  try {
    const result = await CourseCode.find({isDeleted : false}).populate([{
      path: "curriculum",
      model: "Curriculums",
    },{path : 'createdBy',model : 'user'}]);

    res.send(result);
  } catch (error) {
    res.status(500).send({ msg: "Error getting course code",err : error });
  }
};

exports.studentCourseEnrollment = async (req, res) => {
  try {
    console.log(req.body);
    const result = await CourseCode.findOne({
      courseCode: req.body.courseCode,
    });
    if (result) {
      if (result.courseCodeValidTo < new Date()) {
        res.status(500).send({ msg: "Course code expired, cannot enroll." });
      } else {
        await CourseCode.findByIdAndUpdate(
          { _id: result._id },
          { assignedToStudent: req.body.studentId },
          function (err, code) {
            if (err) {
              res.status(500).send({ msg: "Error enrolling course code" });
            } else {
              res
                .status(200)
                .send({ msg: "Enrollment Success", courseCode: result });
            }
          }
        );
      }
    } else {
      res
        .status(500)
        .send({
          msg: "Course code not found for " + req.body.courseCode,
          err: result,
        });
    }
  } catch (error) {
    res.status(500).send({ msg: "Error enrolling course code" });
  }
};

exports.getAllEnrolledCourse = async (req, res) => {
  try {
    const result = await CourseCode.find({
      assignedToStudent: req.params.studentId,
    }).populate({
      path: "curriculam",
      model: "Curriculums",
    });
    let courseList =[]; 
    for(let i=0; i<result.length; i++){
      const course = await Courses.find({curriculum : result[i].curriculum, is_deleted : false });
      courseList.push(course);
    }
    res.send(courseList.filter(a => a.length >0));
  } catch (error) {
    console.log(error);
    res.status(500).send({ msg: "Error getting courses" });
  }
};

exports.getAllEnrolledCourseByName = async (req, res) => {
  try {
    const result = await CourseCode.find({
      assignedToStudent: req.params.studentId,
    }).populate({
      path: "curriculam",
      model: "Curriculums",
    });
    let courseList =[]; 
    for(let i=0; i<result.length; i++){
      const course = await Courses.find({curriculum : result[i].curriculum, is_deleted : false, "name" :req.params.course  });
      courseList.push(course);
    }
    res.send(courseList.filter(a => a.length >0));
  } catch (error) {
    console.log(error);
    res.status(500).send({ msg: "Error getting courses" });
  }
};
