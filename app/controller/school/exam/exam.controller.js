const express = require("express");
const under = require("underscore");
const router = express.Router();
const mongoose = require("mongoose");
const examModel = require("../../../models/school/course/exam.model");


exports.saveExam = async (req, res, _id,QuestionId) => {
    const examQuery = {};
    examQuery.course = req.body._id;
    examQuery.questions=req.body.QuestionId
    examQuery.exam_name = req.body.Exam_Name;
    examQuery.exam_description = req.body.Exam_Description;
    examQuery.exam_startDateTime = req.body.Exam_StartDateTime;
    examQuery.exam_endDateTime = req.body.Exam_EndDateTime;
    examQuery.created_date = new Date();
    examQuery.updated_date = new Date();
     try {
      const result = await examModel.create(examQuery);
      res.send({ message: "Exam Detail save successfully!" });
    } catch (error) {
      console.log("error", error);
      res.send(error);
    }
  };

  // Find a single exam with a examId
exports.findOneExam = (req, res) => {
  examModel.find({_id:req.params.examId, is_deleted: false} )
  .then((exam) => {
    if (!exam ) {
      return res.status(404).send({
        message: "exam not found with id " + req.params.examId,
      });
    }
    res.send(exam);
  })
  .catch((err) => {
    if (err.kind === "ObjectId") {
      return res.status(404).send({
        message: "exam not found with id " + req.params.examId,
      });
    }
    return res.status(500).send({
      message: "Error retrieving exam with id " + req.params.examId,
    });
  });
};

// Retrieve and return all exams from the database.
exports.findAll = (req, res) => {
  examModel.find( { is_deleted: false })
  .then(exams => {
      res.send(exams);
  }).catch(err => {
      res.status(500).send({
          message: err.message || "Some error occurred while retrieving exams."
      });
  });
};

  // Update a exam identified by the examId in the request
exports.updateExam = (req, res) => {
    // Validate Request
    if (!req.body.Exam_Name) {
      return res.status(400).send({
        message: "exam content can not be empty",
      });
    }
  
    // Find exam and update it with the request body
    examModel.findByIdAndUpdate(
      req.params.examId,
      
      {
        exam_name : req.body.Exam_Name,
        exam_description : req.body.Exam_Description,
        exam_startDateTime : req.body.Exam_StartDateTime,
        exam_endDateTime : req.body.Exam_EndDateTime,
        updated_date :new Date(),
       
      },
      { new: true },
    )
      .then((exam) => {
        if (!exam) {
          return res.status(404).send({
            message: "exam not found with id " + req.params.examId,
          });
        }
        res.send(exam);
      })
      .catch((err) => {
        if (err.kind === "ObjectId") {
          return res.status(404).send({
            message: "exam not found with id " + req.params.examId,
          });
        }
        return res.status(500).send({
          message: "Error updating exam with id " + req.params.examId,
        });
      });
  };

  //for delete exam
  exports.deleteExam = (req, res) => {
   
    examModel.findByIdAndUpdate(req.params.examId, { is_deleted: true },  { new: true })
    .then((exam) => {
      if (!exam) {
        return res.status(404).send({
          message: "exam not found with id " + req.params.examId,
        });
      }
      res.send({ message: "exam deleted successfully!" });
    })
    .catch((err) => {
      if (err.kind === "ObjectId" || err.name === "NotFound") {
        return res.status(404).send({
          message: "exam not found with id " + req.params.examId,
        });
      }
      return res.status(500).send({
        message: "Could not delete exam with id " + req.params.examId,
      });
    });
};