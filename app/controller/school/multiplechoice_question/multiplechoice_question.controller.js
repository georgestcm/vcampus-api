const express = require("express");
const under = require("underscore");
const router = express.Router();
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const questionModel = require("../../../models/school/course/multiplechoice_question.model");
const examModel = require("../../../models/school/course/exam.model");

// Create and Save a new question
exports.saveQuestion = async (req, res) => {
  
    // const questionQuery = {};
    // //questionQuery.user = req.body.UserId;
    // questionQuery.exam = req.body.ExamId;
    // questionQuery.Question_title = req.body.Question_title;
    // questionQuery.Question_options =  req.body.Question_options;
    // questionQuery.Correct_answer = req.body.Correct_answer; 
    
    try {
     
      const result = await questionModel.create(req.body);
     
      //await examModel.update({ _id:req.body.ExamId },{ $push: { questions: result._id } }  );
      res.send({ message: "Question saved successfully!" });
    } catch (error) {
      console.log("error", error);
      res.send(error);
    }
};

  // Find a single Question with a QuestionId
exports.findOneQuestion = (req, res) => {
    questionModel.find({_id:req.params.questionId, Is_deleted:false})
    .then((question) => {
      if (!question) {
        return res.status(404).send({
          message: "question not found with id " + req.params.questionId,
        });
      }
      res.send(question);
    })
    .catch((err) => {
      if (err.kind === "ObjectId") {
        return res.status(404).send({
          message: "question not found with id " + req.params.questionId,
        });
      }
      return res.status(500).send({
        message: "Error retrieving question with id " + req.params.questionId,
      });
    });
};

// Retrieve and return all Questions from the database.
exports.findAll = (req, res) => {
    questionModel.find( { Is_deleted: false })
    .then(questions => {
        res.send(questions);
    }).catch(err => {
        res.status(500).send({
            message: err.message || "Some error occurred while retrieving Questions."
        });
    });
  };

  exports.findAllBySchoolId = (req, res) => {
    questionModel.find( { Is_deleted: false, school : req.params.schoolId })
    .then(questions => {
        res.send(questions);
    }).catch(err => {
        res.status(500).send({
            message: err.message || "Some error occurred while retrieving Questions."
        });
    });
  };

  exports.findAllByCourseAndType = (req, res) => {
    questionModel.find( { Is_deleted: false, course : req.params.courseId, Question_for : req.params.type })
    .then(questions => {
        res.send(questions);
    }).catch(err => {
        res.status(500).send({
            message: err.message || "Some error occurred while retrieving Questions."
        });
    });
  };
  // Update a question identified by the questionId in the request
exports.updateQuestion = (req, res) => {
    // Validate Request
    if (!req.body.Question_title) {
      return res.status(400).send({
        message: "question content can not be empty",
      });
    }
  
    // Find question and update it with the request body
    questionModel.findByIdAndUpdate(
      req.params.questionId,
      {        
        Question_title : req.body.Question_title,
        Question_options :  req.body.Question_options,
        Correct_answer : req.body.Correct_answer 
      },
      { new: true }
    )
      .then((question) => {
        if (!question) {
          return res.status(404).send({
            message: "question not found with id " + req.params.questionId,
          });
        }
        res.send({message:"Question update successfully"});
      })
      .catch((err) => {
        if (err.kind === "ObjectId") {
          return res.status(404).send({
            message: "question not found with id " + req.params.questionId,
          });
        }
        return res.status(500).send({
          message: "Error updating question with id " + req.params.questionId,
        });
      });
  };


  // Delete a question with the specified questionId in the request
exports.deleteQuestion = (req, res) => {
    questionModel.findByIdAndUpdate(req.params.questionId,{ Is_deleted: true })
    .then((question) => {
      if (!question) {
        return res.status(404).send({
          message: "question not found with id " + req.params.questionId,
        });
      }
      res.send({ message: "question deleted successfully!" });
    })
    .catch((err) => {
      if (err.kind === "ObjectId" || err.name === "NotFound") {
        return res.status(404).send({
          message: "question not found with id " + req.params.questionId,
        });
      }
      return res.status(500).send({
        message: "Could not delete question with id " + req.params.questionId,
      });
    });
};
