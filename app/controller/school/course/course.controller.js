const express = require("express");
const under = require("underscore");
const router = express.Router();
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const courseModel = require("../../../models/school/course/course.model");
const sectionModel = require("../../../models/school/course/section.model");
const chapterModel = require("../../../models/school/course/chapter.model");
const topicModel = require("../../../models/school/course/topic.model");
var multer = require('multer');
var DIR = './public/uploads/';
var fs =require ("fs");
const { update } = require("../../../models/school/course/course.model");
//var upload = multer({dest: DIR}).single('file');

let storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, DIR);
  },
  filename: (req, file, cb) => {
    console.log(file.mimetype);
    var extension = file.originalname.split('.')[1];
    cb(null, file.fieldname + '-' + Date.now()+"."+extension);
  }
});
let upload = multer({storage: storage}).single('file');//.array("supporingDocs[]", 12);//.single('file');

// Create and Save a new course
exports.saveCourse = async (req, res) => {
  const courseQuery = {};
  courseQuery.name = req.body.courseName;
  courseQuery.description = req.body.description;
  courseQuery.subject = req.body.subject;
  courseQuery.user = req.body.userId;
  courseQuery.school = req.body.school;
  courseQuery.curriculum = req.body.curriculum;
  courseQuery.availability_from = req.body.availableFrom;
  courseQuery.availability_to = req.body.availableTo;
  courseQuery.created_date = new Date();
  courseQuery.updated_date = new Date();
  courseQuery.is_repeat_yearly = req.body.repeatYearly;
  try {
    const result = await courseModel.create(courseQuery);
    for(var i=0;i <req.body.sections.length; i++){
      const sections = await saveSections(req.body.sections[i].section);
      await courseModel.update({ _id: result._id }, { $push: {sections:sections }});//, {  sections });
    } 
    res.send({ message: "Course saved successfully!", _id :result._id });
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
    sectionQuery.section_name = sections[index].sectionName;
    sectionQuery.updated_date = new Date();
    sectionQuery.created_date = new Date();
    const result = await sectionModel.create(sectionQuery);
    sectionResults.push(result._id);
    const chapters = await saveChapters(sections[index].chapter);
    await sectionModel.update({ _id: result._id }, {$push: { chapters: chapters }});
  }
  return sectionResults;
}
async function saveChapters(chapters) {
  let chapterResults = [];
  for (let index = 0; index < chapters.length; index++) {
    const chapterQuery = {};
    chapterQuery.chapter_name = chapters[index].chapterName;
    chapterQuery.updated_date = new Date();
    chapterQuery.created_date = new Date();
    const result = await chapterModel.create(chapterQuery);
    chapterResults.push(result._id);
    const topics = await saveTopics(chapters[index].topic);
    await chapterModel.update({ _id: result._id }, { $push: { topics: topics }});
  }
  return chapterResults;
}
async function saveTopics(topics) {
  let topicResults = [];
  for (let index = 0; index < topics.length; index++) {
    const topicQuery = {};
    topicQuery.topic_name = topics[index].topicName;
    topicQuery.paragraph = topics[index].paragraph;
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
      .findOne({ _id: req.params.courseId, is_deleted: false })
      .populate({
        path: "sections",
        model: "Sections",
        match: { is_deleted: false },
        populate: {
          path: "chapters",
          model: "Chapters",
          match: { is_deleted: false },
          populate: {
            path: "topics",
            model: "Topics",
            match: { is_deleted: false },
          },
        },
      });
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
    const result = await courseModel.find({ is_deleted: false,  })
    .sort({'created_date': -1})
    .populate({
      path: "sections",
      model: "Sections",
      match: { is_deleted: false },
      populate: {
        path: "chapters",
        model: "Chapters",
        match: { is_deleted: false },
        populate: {
          path: "topics",
          model: "Topics",
          match: { is_deleted: false },
        },
      },
    });
    res.send(result);
  } catch (error) {
    console.log("error:", error);
    res.send({
      message: "Error retrieving courses",
      error,
    });
  }
};

exports.deleteCourse = async (req, res) => {
  try {
    const result = await courseModel.update(
      { _id: req.params.courseId },
      { is_deleted: true }
    );
    res.send(result);
  } catch (error) {
    console.log("error:", error);
    res.send({
      message: "Error delete course with id " + req.params.courseId,
      error,
    });
  }
};

exports.updateCourse = async (req, res) => {
  const courseQuery = {};
  courseQuery.name = req.body.courseName;
  courseQuery.description = req.body.description;
  courseQuery.subject = req.body.subject;
  courseQuery.user = req.body.userId;
  courseQuery.school = req.body.school;
  courseQuery.curriculum = req.body.curriculum;
  courseQuery.availability_from = req.body.availableFrom;
  courseQuery.availability_to = req.body.availableTo;
  courseQuery.is_repeat_yearly = req.body.repeatYearly;
  courseQuery.updated_date = new Date();
  courseQuery.is_repeat_yearly = req.body.IsRepeatYearly;
  try {
    await courseModel.update({ _id: req.params.courseId }, courseQuery);
    // const sections = await updateSections(
    //   req.body.Sections,
    //   req.params.courseId
    // );
    res.send({ message: "Course updated successfully!" });
  } catch (error) {
    console.log("error:", error);
    res.send({
      message: "Error updating course",
      error,
    });
  }
};

async function updateSections(sections, courseId) {
  for (let index = 0; index < sections.length; index++) {
    const sectionQuery = {};
    if (sections[index].SectionId === 0) {
      sectionQuery.section_name = sections[index].SectionName;
      sectionQuery.updated_date = new Date();
      sectionQuery.created_date = new Date();
      const result = await sectionModel.create(sectionQuery);
      await courseModel.update(
        { _id: courseId },
        { sections: { $push: result._id } }
      );
      const chapters = await updateChapters(
        sections[index].Chapters,
        result._id
      );
    } else {
      sectionQuery.section_name = sections[index].SectionName;
      sectionQuery.updated_date = new Date();
      sectionQuery.is_deleted = sections[index].isDeleted || false;
      await sectionModel.update(
        { _id: sections[index].SectionId },
        sectionQuery
      );
      const chapters = await updateChapters(
        sections[index].Chapters,
        sections[index].SectionId
      );
    }
  }
  return true;
}
async function updateChapters(chapters, sectionId) {
  for (let index = 0; index < chapters.length; index++) {
    const chapterQuery = {};
    if (chapters[index].ChapterId === 0) {
      chapterQuery.chapter_name = chapters[index].ChapterName;
      chapterQuery.created_date = new Date();
      chapterQuery.updated_date = new Date();
      const result = await chapterModel.create(chapterQuery);
      await sectionModel.update(
        { _id: sectionId },
        { chapters: { $push: result._id } }
      );
      const topics = await updateTopics(chapters[index].Topics, result._id);
    } else {
      chapterQuery.chapter_name = chapters[index].ChapterName;
      chapterQuery.updated_date = new Date();
      await chapterModel.update(
        { _id: chapters[index].ChapterId },
        chapterQuery
      );
      const topics = await updateTopics(
        chapters[index].Topics,
        chapters[index].ChapterId
      );
    }
  }
  return true;
}
async function updateTopics(topics, chapterId) {
  for (let index = 0; index < topics.length; index++) {
    const topicQuery = {};
    if (topics[index].TopicId === 0) {
      topicQuery.topic_name = topics[index].TopicName;
      topicQuery.paragraph = topics[index].Paragraph;
      topicQuery.created_date = new Date();
      topicQuery.updated_date = new Date();
      const result = await topicModel.create(topicQuery);
      await chapterModel.update(
        { _id: chapterId },
        { topics: { $push: result._id } }
      );
    } else {
      topicQuery.topic_name = topics[index].TopicName;
      topicQuery.paragraph = topics[index].Paragraph;
      topicQuery.updated_date = new Date();
      await topicModel.update({ _id: topics[index].TopicId }, topicQuery);
    }
  }
  return true;
}
//our file upload function.

exports.uploadDocs =  async (req, res, next) => {
    var path = '';
    //const resultUpdate =  updateDocs("5efcca5f44d125213cae5d66", "5efcca5f44d125213cae5d67", "fileName");
  //console.log(resultUpdate);
    upload(req, res, function (err) {
       if (err) {
         console.log(err);
         return res.status(422).send("an Error occured")
       }  
       //console.log(req.body.paragraphId);
       console.log(req.body.topicId);
       var fileName = req.file.filename;
       const resultUpdate =  updateDocs(req.body.topicId, req.body.paragraphId, fileName);
       console.log(resultUpdate);
       path = req.file.path;
     
       return res.send("Upload Completed for "+path); 
  });     
 // })

 async function updateDocs(topicId, paragraphId, fileName){
   await topicModel.update({_id : topicId, "paragraph._id":paragraphId},
    {$set :{"paragraph.$.supportingDocs":fileName}});
 }
}
