const mongoose = require("mongoose");
const schema = mongoose.Schema;

const courseCodeSchema = new schema({
  courseCode: {
    type: String,
    required: true,
  },
  courseCodeValidFrom: {
    type: Date,
  },
  courseCodeValidTo: {
    type: Date,
  },
  school: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Schools",
  },
  course: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Courses",
  },
  assignedToStudent: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "users",
  },
  createdAt: {
    type: Date,
    default: new Date(),
  },
  updatedAt: {
    type: Date,
  },
  isDeleted: {
    type: Boolean,
    default: false,
  },
  isActive: {
    type: Boolean,
    default: true,
  },
});

module.exports = mongoose.model("CourseCodes", courseCodeSchema, "CourseCode");
