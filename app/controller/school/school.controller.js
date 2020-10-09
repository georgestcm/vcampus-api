const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const User = require("../../models/user");
const bcrypt = require("bcrypt");
const { isNull } = require("underscore");
const saltRounds = 10;
const Curriculum = require("../../models/school/course/curriculum.model");

// Create and Save a new Note
exports.saveSchoolDetail = (req, res) => {
  let schoolData = req.body;

  User.updateMany(
    { _id: schoolData.school_id },
    {
      $set: {
        school: {
          school_name: schoolData.school_name,
          principal_first_name: schoolData.principal_first_name,
          principal_last_name: schoolData.principal_last_name,
          description: schoolData.description,
          registration_valid: true,
        },
      },
    },
    function (err, result) {
      if (err) {
        res.status(401).send(err);
      } else {
        bcrypt.genSalt(saltRounds, function (err, salt) {
          bcrypt.hash(schoolData.password, salt, function (err, hash) {
            schoolData.password = hash;
            User.updateMany(
              { _id: schoolData.school_id },
              {
                $set: {
                  password: hash,
                },
              },
              function (err, result) {
                if (err) {
                  console.log(err);
                } else {
                  res.status(200).send(result);
                }
              }
            );
          });
        });
      }
    }
  );
};

exports.getAllSchoolByTeacherId = async (req, res) => {
  var teacherId = req.query.teacherId;
  try {
    //const result = await User.find({ roles: { "$in": 3}, "school.teacher._id": { "$in": teacherId}});
    const result = await User.find({
      roles: { $in: 3 },
      "school.teacher._id": { $in: teacherId },
    });
    res.send(result);
  } catch (error) {
    console.log("error:", error);
    res.send({
      message: "Error retrieving schools.",
      error,
    });
  }
};

exports.getAllSchool = async (req, res) => {
  try {
    const result = await User.find({ roles: { $in: 3 } }).select(
      "_id school.school_name"
    );
    const data = result.filter((a) => a.school.school_name != null);
    res.send(data);
  } catch (error) {
    console.log("error:", error);
    res.send({
      message: "Error retrieving schools.",
      error,
    });
  }
};

exports.getAllSchoolForAdmin = async (req, res) => {
  try {
    const result = await User.find({ roles: { $in: 3 } }).select(
      "_id username first_name last_name email phone_number profile_photo teacher school"
    );
    const data = result.filter((a) => a.school.school_name != null);
    res.send(data);
  } catch (error) {
    console.log("error:", error);
    res.send({
      message: "Error retrieving schools.",
      error,
    });
  }
};

exports.getAllStudents = async (req, res) => {
  try {
    const result = await User.find({
      roles: { $in: 6 },
      school_id: req.params.schoolId,
    }).select(
      "_id username first_name last_name email phone_number profile_photo "
    );
    res.send(result);
  } catch (error) {
    console.log("error:", error);
    res.send({
      message: "Error retrieving students.",
      error,
    });
  }
};

exports.studentList = async (req, res) => {
  //Using for chat
  try {
    const result = await User.find({ roles: { $in: 6 } }).select(
      "_id username first_name last_name email phone_number profile_photo "
    );
    res.send(result);
  } catch (error) {
    console.log("error:", error);
    res.send({
      message: "Error retrieving students.",
      error,
    });
  }
};
exports.updateSchoolDetail = (req, res) => {
  try {
    const query = {
      school: {
        school_name: req.body.school_name,
        principal_first_name: req.body.principal_first_name,
        principal_last_name: req.body.principal_last_name,
        description: req.body.description,
      },
    };

    User.findByIdAndUpdate(req.body._id, query, function (err, school) {
      if (err) {
        res.status(405).send({ msg: error, success: false });
      } else {
        res.status(200).send({ msg: "School updated!", success: true });
      }
    });
  } catch (error) {
    res.status(405).send({ msg: error });
  }
};

exports.getAllAdminStaff = async (req, res) => {
  try {
    const result = await User.find({ roles: { $in: 2 } });
    res.send(result);
  } catch (error) {
    console.log("error:", error);
    res.send({
      message: "Error retrieving Admin Staff.",
      error,
    });
  }
};

exports.updateStaffDetail = (req, res) => {
  try {
    User.findByIdAndUpdate(req.body._id, req.body, function (err, staff) {
      if (err) {
        res.status(405).send({ msg: error, success: false });
      } else {
        res.status(200).send({ msg: "Staff updated!", success: true });
      }
    });
  } catch (error) {
    res.status(405).send({ msg: error });
  }
};

exports.deleteUserPermanent = (req, res) => {
  try {
    console.log("deleteUserPermanent");
    User.findByIdAndDelete(req.params.id, function (err, user) {
      if (err) {
        res.status(405).send({ msg: error, success: false });
      } else {
        res.status(200).send({ msg: "User deleted!", success: true });
      }
    });
  } catch (error) {
    res.status(405).send({ msg: error });
  }
};

// Curriculum CRUD Operation

exports.saveCurriculam = async (req, res) =>{
  try {
     const curriculumReq = new Curriculum(req.body);
      curriculumReq.save((err, docs) =>{
        if(err){
          res.status(405).send({msg : error});
        }else{
          res.status(200).send({msg : "Curriculam added successfully."});
        }
      });
  } catch (error) {
    res.status(405).send({msg : error});
  }
}

exports.getAllCurriculam = async (req,res) =>{
  try {
   const result = await Curriculum.find();
   res.send(result);
  } catch (error) {
    res.status(500).send({ msg: "Error getting Curriculam" });
  }
}

exports.getAllCurriculamBySchoolId = async (req,res) =>{
  try {
   const result = await Curriculum.find({school : req.params.schoolId});
   res.send(result);
  } catch (error) {
    res.status(500).send({ msg: "Error getting Curriculam" });
  }
}

