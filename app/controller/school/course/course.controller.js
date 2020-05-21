const express = require("express");
const under = require("underscore");
const router = express.Router();
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const courseModel = require("../../../models/school/course/course.model");
const sectionModel = require("../../../models/school/course/section.model");
const chapterModel = require("../../../models/school/course/chapter.model");
const topicModel = require("../../../models/school/course/topic.model");

// Create and Save a new course
exports.saveCourse = async (req, res) => {
  const courseQuery = {};
  courseQuery.name = req.body.CourseName;
  courseQuery.description = req.body.Description;
  courseQuery.subject = req.body.Subject;
  courseQuery.school = req.body.School;
  courseQuery.curriculum = req.body.Curriculum;
  courseQuery.availability_from = new Date();
  courseQuery.availability_to = new Date();
  courseQuery.created_date = new Date();
  courseQuery.updated_date = new Date();
  courseQuery.is_repeat_yearly = true;
  try {
    const result = await courseModel.create(courseQuery);
    const sectionQuery = await saveSections(req.body.Sections, result._id);
    res.send({ message: "Course saved successfully!" });
  } catch (error) {
    console.log("error", error);
    res.send(error);
  }
};

async function saveSections(sections, _id) {
  for (let index = 0; index < sections.length; index++) {
    const sectionQuery = {};
    sectionQuery.section_name = sections[index].SectionName;
    sectionQuery.course = _id;
    sectionQuery.updated_date = new Date();
    sectionQuery.created_date = new Date();
    const result = await sectionModel.create(sectionQuery);
    const chapterQuery = await saveChapters(
      sections[index].Chapter,
      result._id,
      _id
    );
  }
  return true;
}
async function saveChapters(chapters, _id, courseId) {
  for (let index = 0; index < chapters.length; index++) {
    const chapterQuery = {};
    chapterQuery.chapter_name = chapters[index].ChapterName;
    chapterQuery.course = courseId;
    chapterQuery.section = _id;
    chapterQuery.updated_date = new Date();
    chapterQuery.created_date = new Date();
    const result = await chapterModel.create(chapterQuery);
    const chapter = await saveTopics(
      chapters[index].Topics,
      result._id,
      courseId,
      _id
    );
  }
  return true;
}
async function saveTopics(topics, _id, courseId, sectionId) {
  for (let index = 0; index < topics.length; index++) {
    const topicQuery = {};
    topicQuery.topic_name = topics[index].TopicName;
    topicQuery.course = courseId;
    topicQuery.section = sectionId;
    topicQuery.chapter = _id;
    topicQuery.paragraph = topics[index].Paragraph;
    topicQuery.updated_date = new Date();
    topicQuery.created_date = new Date();
    const result = await topicModel.create(topicQuery);
  }
  return true;
}

// Find a single Course with a CourseId
exports.findOneCourse = (req, res) => {
    courseModel.findById(req.params.courseId)
    .then((course) => {
      if (!course) {
        return res.status(404).send({
          message: "course not found with id " + req.params.courseId,
        });
      }
      res.send(course);
    })
    .catch((err) => {
      if (err.kind === "ObjectId") {
        return res.status(404).send({
          message: "course not found with id " + req.params.courseId,
        });
      }
      return res.status(500).send({
        message: "Error retrieving course with id " + req.params.courseId,
      });
    });
};

// Update a course identified by the courseId in the request
exports.updateCourse = (req, res) => {
  // Validate Request
  if (!req.body.name) {
    return res.status(400).send({
      message: "course content can not be empty",
    });
  }

  // Find course and update it with the request body
  courseModel.findByIdAndUpdate(
    req.params.courseId,
    {
      name: req.body.name,
      description: req.body.description,
      created_date: req.body.created_date,
      updated_date: req.body.updated_date,
    },
    { new: true }
  )
    .then((course) => {
      if (!course) {
        return res.status(404).send({
          message: "course not found with id " + req.params.courseId,
        });
      }
      res.send(course);
    })
    .catch((err) => {
      if (err.kind === "ObjectId") {
        return res.status(404).send({
          message: "course not found with id " + req.params.courseId,
        });
      }
      return res.status(500).send({
        message: "Error updating course with id " + req.params.courseId,
      });
    });
};

// Delete a course with the specified courseId in the request
exports.deleteCourse = (req, res) => {
    courseModel.findByIdAndRemove(req.params.courseId)
    .then((course) => {
      if (!course) {
        return res.status(404).send({
          message: "course not found with id " + req.params.courseId,
        });
      }
      res.send({ message: "course deleted successfully!" });
    })
    .catch((err) => {
      if (err.kind === "ObjectId" || err.name === "NotFound") {
        return res.status(404).send({
          message: "course not found with id " + req.params.courseId,
        });
      }
      return res.status(500).send({
        message: "Could not delete course with id " + req.params.courseId,
      });
    });
};
