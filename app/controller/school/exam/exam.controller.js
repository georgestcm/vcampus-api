const express = require("express");
const under = require("underscore");
const router = express.Router();
const mongoose = require("mongoose");
const examModel = require("../../../models/school/course/exam.model");
const mcqModel = require("../../../models/school/course/multiplechoice_question.model");

exports.saveExam = async (req, res,mcqId) => {
    const examQuery = {};
    examQuery.exam_name = req.body.Exam_Name;
    examQuery.questions = mcqId;
    examQuery.exam_description = req.body.Exam_Description;
    examQuery.exam_startDateTime = req.body.Exam_StartDateTime;
    examQuery.exam_endDateTime = req.body.Exam_EndDateTime;
    examQuery.created_date = new Date();
    examQuery.updated_date = new Date();
    examQuery.deleted_date = new Date();
    examQuery.is_active = true;
    examQuery.is_deleted = false;
    try {
      const result = await examModel.create(examQuery);
     // const sectionQuery = await saveSections(req.body.Sections, result._id);
      res.send({ message: "Exam Detail save successfully!" });
    } catch (error) {
      console.log("error", error);
      res.send(error);
    }
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
        created_date :new Date(),
        updated_date :new Date(),
        deleted_date :new Date(),
      },
      { new: true }
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
    examModel.findByIdAndRemove(req.params.examId)
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