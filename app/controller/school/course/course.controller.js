const express = require("express");
const under = require("underscore");
const router = express.Router();
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const courseModel = require("../../../models/school/course/course.model");
const sectionModel = require("../../../models/school/course/section.model");
const chapterModel = require("../../../models/school/course/chapter.model");
const topicModel = require("../../../models/school/course/topic.model");
var multer = require("multer");
var DIR = "./public/uploads/";
var fs = require("fs");
const GridFsStorage = require("multer-gridfs-storage");
const Grid = require("gridfs-stream");
//const methodOverride = require('method-override');
const dbConfig = require("../../../../app/core/config/db.config");
const crypto = require("crypto");
const path = require("path");
const courseCodeModel = require("../../../models/school/course/courseCode.model");
const { update } = require("../../../models/school/course/course.model");
const mediaModel = require("../../../models/school/course/media.model");
const courseInviteModel = require("../../../models/school/course/course-invite.model");
//var upload = multer({dest: DIR}).single('file');
//app.use(methodOverrid("_method"))

const connn = mongoose.createConnection(dbConfig.url);
let gfs;
connn.once("open", () => {
  gfs = Grid(connn.db, mongoose.mongo);
  gfs.collection("uploads");
});

var Storage = new GridFsStorage({
  url: dbConfig.url,
  file: (req, file) => {
    return new Promise((resolve, reject) => {
      crypto.randomBytes(16, (err, buf) => {
        if (err) {
          return reject(err);
        }
        const filename = buf.toString("hex") + path.extname(file.originalname);
        const fileInfo = {
          filename: filename,
          bucketName: "uploads",
        };
        resolve(fileInfo);
      });
    });
  },
});
//const upload = multer({ storage });

let storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, DIR);
  },
  filename: (req, file, cb) => {
    console.log(file.mimetype);
    var extension = file.originalname.split(".")[1];
    cb(null, file.fieldname + "-" + Date.now() + "." + extension);
  },
});

let upload = multer({ storage: Storage }).single("file"); //.array("supporingDocs[]", 12);//.single('file');

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
    for (var i = 0; i < req.body.sections.length; i++) {
      const sections = await saveSections(req.body.sections[i].section);
      await courseModel.update(
        { _id: result._id },
        { $push: { sections: sections } }
      ); //, {  sections });
    }
    res.send({ message: "Course saved successfully!", _id: result._id });
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
    await sectionModel.update(
      { _id: result._id },
      { $push: { chapters: chapters } }
    );
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
    await chapterModel.update(
      { _id: result._id },
      { $push: { topics: topics } }
    );
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
    const result = await courseModel
      .find({ is_deleted: false, school: { $exists: true } })
      .sort({ created_date: -1 })
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

exports.findCoursesByCourseName = async (req, res) => {
  try {
    const result = await courseModel
      .find({
        is_deleted: false,
        name: { $regex: req.params.searchText, $options: "i" },
        school: { $exists: true },
      })
      .sort({ created_date: -1 })
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

exports.findCoursesBySchoolId = async (req, res) => {
  try {
    const result = await courseModel
      .find({ is_deleted: false, school: req.params.schoolId })
      .sort({ created_date: -1 })
      .populate({
        path: "curriculum",
        model: "Curriculums",
      })
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

exports.findCoursesByCurriculum = async (req, res) => {
  try {
    const result = await courseModel
      .find({ is_deleted: false, curriculum: req.params.curriculumId })
      .sort({ created_date: -1 })
      .populate({
        path: "curriculum",
        model: "Curriculums",
      })
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

exports.getCoursesV2 = async (req, res) => {
  try {
    const result = await courseModel
      .find({
        $or: [
            { is_deleted: false, school: req.params.schoolId, user : req.params.userId } ,
            {courseAccess : {$in :[req.params.userId]}}
        ]
    })
      .sort({ created_date: -1 })
      .populate({
        path: "curriculum",
        model: "Curriculums",
      })
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
  //courseQuery.curriculum.push(req.body.curriculum);
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

exports.addCodeToCourse = async (req, res) => {
  try {
    await courseModel.update(
      { _id: req.body.courseId },
      { $addToSet: { codes: req.body.code }, updated_date: new Date() }
    );
    res
      .status(200)
      .json({ message: "Code added successfully!", success: true });
  } catch (error) {
    console.log("error:", error);
    res.status(405).json({
      message: "Error adding course code.",
      error,
      success: false,
    });
  }
};

exports.findCoursesByCode = async (req, res) => {
  try {
    const courseResult = await courseCodeModel.find({
      courseCode: req.params.code,
      courseCodeValidTo: { $gte: new Date() },
      isDeleted: false,
      isActive: true,
    });
    if (courseResult && courseResult.length == 0) {
      res
        .status(405)
        .json({ message: "Course not found with code :" + req.params.code });
    }
    const result = await courseModel
      .find({ is_deleted: false, codes: { $in: req.params.code } })
      .sort({ created_date: -1 })
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

exports.findMediaByUserId = async (req, res) => {
  try {
    const result = await mediaModel.find({ user: req.params.userId });
    res.send(result);
  } catch (error) {
    console.log("error:", error);
    res.send({
      message: "Error retrieving Media ",
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
exports.readDocs = (req, res) => {
  console.log("req");
  gfs.files.findOne({ filename: req.params.filename }, (err, file) => {
    if (!file || file.length === 0) {
      return res.status(404).json({ error: "File not found!" });
    } else if (err) {
      return res.status(404).json({ error: err });
    } else {
      const readstream = gfs.createReadStream(file.filename);
      readstream.pipe(res);
    }
  });
};

exports.shareCourseWithTeacher = async (req, res) => {
  try {
    courseModel.findOne({ _id: req.body.courseId }).then(
      (course) => {
        if (course) {
          course.sharedTeachers.push(req.body.teacherId);
          course.save();
          res.send({
            message: "Course shared success!",
          });
        }
      },
      (err) => {
        res.send({ message: "something went wrong!" });
      }
    );
  } catch (error) {
    console.log("error", error);
    res.send(error);
  }
};

exports.uploadDocs = async (req, res, next) => {
  upload(req, res, function (err) {
    if (err) {
      console.log(err);
      return res.status(422).send("an Error occured");
    }
    console.log(req.body.title);
    var fileName = req.file.filename;
    const result = createMedia(req.body.userId, req.body.title, fileName);
    res.send(fileName);
  });
  // })

  async function updateDocs(topicId, paragraphId, fileName) {
    await topicModel.update(
      { _id: topicId, "paragraph._id": paragraphId },
      { $set: { "paragraph.$.supportingDocs": fileName } }
    );
  }

  async function createMedia(userId, title, fileName) {
    const query = {
      user: userId,
      title: title,
      fileName: fileName,
    };
    await mediaModel.create(query);
  }
};

exports.saveInvite = async (req, res) => {
  try {
    const request = {
      sender : req.body.senderId,
      receipent : req.body.receipentId,
      course : req.body.courseId
    }
    await courseInviteModel.create(request);
    res
      .status(200)
      .json({ message: "Invite saved successfully!", success: true });
  } catch (error) {
    console.log("error", error);
    res.status(405).json({ message: error, success: false });
  }
};
exports.getInvite = async(req, res) => {
  try {
    console.log(req.params.teacherId);
    const result = await courseInviteModel
    .find({isDeleted : false, receipent : req.params.teacherId})
    .populate("course")
    .populate("sender");
    res.status(200).json(result);
} catch (error) {
    return res.status(405).json({error : error});
}  
};
exports.editInviteStatus = async(req, res) => {
  try {
    const status = req.body.status;
    console.log(req.body);
    await courseInviteModel.updateOne({_id : req.body.id},{status : req.body.status});
    if(status == 'Accepted'){
    await courseModel.updateOne({_id : req.body.courseId}, {$addToSet: {courseAccess : req.body.teacherId}});
    }
    res.status(200).json({ message: "Invitation Deleted successfully!" });
} catch (error) {
    return res.status(405).json({error : error});
}
};

exports.deleteInvite = async(req, res) => {
  try {
    await courseInviteModel.updateOne({_id : req.params.inviteId},{isDeleted :true});
    res.status(200).json({ message: "Invitation Deleted successfully!" });
} catch (error) {
    return res.status(405).json({error : error});
}
};
