const express = require('express')
const under = require("underscore")
const router = express.Router();
const mongoose = require('mongoose')
const jwt = require('jsonwebtoken')
const Course = require("../../../models/school/course/course.model.js");

// Create and Save a new course
exports.saveCourse = (req, res) => {   
        const course = new Course({       
        name: req.body.name,
        description: req.body.description,
        created_date: req.body.created_date,
        updated_date: req.body.updated_date
    });
    // Save course in the database
    course.save()
    .then(data => {
        var payload = { _id: data.course_id };
      var token = jwt.sign(payload, "HS256", {
        expiresIn: "1d"
      });
        res.send(data,token);
    }).catch(err => {
        res.status(500).send({
            message: err.message || "Some error occurred while creating the course."
        });
    });
};

// Find a single Course with a CourseId
exports.findOneCourse = (req, res) => {
    Course.findById(req.params.courseId)
    .then(course => {
        if(!course) {
            return res.status(404).send({
                message: "course not found with id " + req.params.courseId
            });            
        }
        res.send(course);
    }).catch(err => {
        if(err.kind === 'ObjectId') {
            return res.status(404).send({
                message: "course not found with id " + req.params.courseId
            });                
        }
        return res.status(500).send({
            message: "Error retrieving course with id " + req.params.courseId
        });
    });
};


// Update a course identified by the courseId in the request
exports.updateCourse = (req, res) => {
    // Validate Request
    if(!req.body.name) {
        return res.status(400).send({
            message: "course content can not be empty"
        });
    }

    // Find course and update it with the request body
    Course.findByIdAndUpdate(req.params.courseId, {
        name: req.body.name,
        description: req.body.description,
        created_date: req.body.created_date,
        updated_date: req.body.updated_date
    }, {new: true})
    .then(course => {
        if(!course) {
            return res.status(404).send({
                message: "course not found with id " + req.params.courseId
            });
        }
        res.send(course);
    }).catch(err => {
        if(err.kind === 'ObjectId') {
            return res.status(404).send({
                message: "course not found with id " + req.params.courseId
            });                
        }
        return res.status(500).send({
            message: "Error updating course with id " + req.params.courseId
        });
    });
};

// Delete a course with the specified courseId in the request
exports.deleteCourse = (req, res) => {
    Course.findByIdAndRemove(req.params.courseId)
    .then(course => {
        if(!course) {
            return res.status(404).send({
                message: "course not found with id " + req.params.courseId
            });
        }
        res.send({message: "course deleted successfully!"});
    }).catch(err => {
        if(err.kind === 'ObjectId' || err.name === 'NotFound') {
            return res.status(404).send({
                message: "course not found with id " + req.params.courseId
            });                
        }
        return res.status(500).send({
            message: "Could not delete course with id " + req.params.courseId
        });
    });
};