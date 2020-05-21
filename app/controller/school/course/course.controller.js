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
  courseQuery.user = req.body.UserId;
  courseQuery.school = req.body.School;
  courseQuery.curriculum = req.body.Curriculum;
  courseQuery.availability_from = req.body.AvailabilityFrom;
  courseQuery.availability_to = req.body.AvailabilityTo;
  courseQuery.created_date = new Date();
  courseQuery.updated_date = new Date();
  courseQuery.is_repeat_yearly = IsRepeatYearly;
  try {
    const result = await courseModel.create(courseQuery);
    const sections = await saveSections(req.body.Sections);
    await courseModel.update({ _id: result._id }, { sections });
    res.send({ message: "Course saved successfully!" });
  } catch (error) {
    console.log("error:", error);
    res.send({
      message: "Error Adding course",
      error,
    });
  }
};

async function saveSections(sections) {
  let sectionResults = [];
  for (let index = 0; index < sections.length; index++) {
    const sectionQuery = {};
    sectionQuery.section_name = sections[index].SectionName;
    sectionQuery.updated_date = new Date();
    sectionQuery.created_date = new Date();
    const result = await sectionModel.create(sectionQuery);
    sectionResults.push(result._id);
    const chapters = await saveChapters(sections[index].Chapter);
    await sectionModel.update({ _id: result._id }, { chapters });
  }
  return sectionResults;
}
async function saveChapters(chapters) {
  let chapterResults = [];
  for (let index = 0; index < chapters.length; index++) {
    const chapterQuery = {};
    chapterQuery.chapter_name = chapters[index].ChapterName;
    chapterQuery.updated_date = new Date();
    chapterQuery.created_date = new Date();
    const result = await chapterModel.create(chapterQuery);
    chapterResults.push(result._id);
    const topics = await saveTopics(chapters[index].Topics);
    await chapterModel.update({ _id: result._id }, { topics });
  }
  return chapterResults;
}
async function saveTopics(topics) {
  let topicResults = [];
  for (let index = 0; index < topics.length; index++) {
    const topicQuery = {};
    topicQuery.topic_name = topics[index].TopicName;
    topicQuery.paragraph = topics[index].Paragraph;
    topicQuery.updated_date = new Date();
    topicQuery.created_date = new Date();
    const result = await topicModel.create(topicQuery);
    topicResults.push(result._id);
  }
  return topicResults;
}

exports.findCourseById = async (req, res) => {
  try {
    const result = await courseModel
      .findById(req.params.courseId)
      .populate("users")
      .populate("sections")
      .populate("sections.chapters")
      .populate("chapters.topics");
    res.send(result);
  } catch (error) {
    console.log("error:", error);
    res.send({
      message: "Error retrieving course with id " + req.params.courseId,
      error,
    });
  }
};

exports.findCourses = async (req, res) => {
  try {
    const result = await courseModel.find();
    res.send(result);
  } catch (error) {
    console.log("error:", error);
    res.send({
      message: "Error retrieving courses",
      error,
    });
  }
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
  Course.findByIdAndUpdate(
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
  Course.findByIdAndRemove(req.params.courseId)
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
