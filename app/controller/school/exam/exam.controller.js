const express = require("express");
const under = require("underscore");
const router = express.Router();
const mongoose = require("mongoose");
const examModel = require("../../../models/school/course/exam.model");


exports.saveExam = async (req, res) => {
    const examQuery = {};
  
    examQuery.Exam_Name = req.body.Exam_Name;
    examQuery.Exam_Description = req.body.Exam_Description;
    examQuery.Exam_StartDateTime = req.body.Exam_StartDateTime;
    examQuery.Exam_EndDateTime = req.body.Exam_EndDateTime;
    examQuery.Created_Date = new Date();
    examQuery.Updated_Date = new Date();
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
  examModel.find({_id:req.params.examId, Is_deleted: false} ).populate({
    path: "questions",
    model: "multichoice_question",
    match: { Is_deleted: false }})
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
  examModel.find( { Is_deleted: false })
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
        Exam_Name : req.body.Exam_Name,
        Exam_Description : req.body.Exam_Description,
        Exam_StartDateTime : req.body.Exam_StartDateTime,
        Exam_EndDateTime : req.body.Exam_EndDateTime,
        Updated_Date :new Date()       
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
   
    examModel.findByIdAndUpdate(req.params.examId, { Is_deleted: true },  { new: true })
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