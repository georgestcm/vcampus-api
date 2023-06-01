const mongoose = require("mongoose");
const schema = mongoose.Schema;

const coureSchema = new schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "users",
  },
  // chapters: [
  //   {
  //     type: mongoose.Schema.Types.ObjectId,
  //     ref: "Chapters",
  //   },
  // ],
  chapters: [
    {
      _id: {
        type: mongoose.Schema.Types.ObjectId,
        default: function () { return new mongoose.Types.ObjectId }
      },
      chapterName: {
        type: String
      },
      courseContent: {
        type: String
      }
    }
  ],
  name: {
    type: String,
  },
  description: {
    type: String,
  },
  subject: {
    type: String,
  },
  school: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "schools",
  },
  curriculum: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: "Curriculums",
  }],
  availability_from: {
    type: Date,
  },
  availability_to: {
    type: Date,
  },
  is_repeat_yearly: {
    type: Boolean,
  },
  created_date: {
    type: Date,
  },
  updated_date: {
    type: Date,
  },
  is_deleted: {
    type: Boolean,
    default: false,
  },
  is_active: {
    type: Boolean,
    default: false,
  },
  codes: [
    { type: String }
  ],
  courseAccess: [//will insert self id along with shared teacher id 
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "users",
    }
  ]
});

module.exports = mongoose.model("Courses", coureSchema, "Courses");
