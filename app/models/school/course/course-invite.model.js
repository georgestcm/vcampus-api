const mongoose = require("mongoose");
const schema = mongoose.Schema;

const courseInviteSchema = new schema({
  sender: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "user",
  },
  receipent: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "user",
  },
  course: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Courses",
  },
  status: {
    type: String,
    default: "Pending",
  },
  sentBy: {
    //Teacher/Editor
    type: String,
    default : "Teacher"
  },
  sentOn: {
    type: Date,
    default: new Date(),
  },
  isDeleted: {
    type: Boolean,
    default: false,
  },
});

module.exports = mongoose.model(
  "CourseInvite",
  courseInviteSchema,
  "courseInvite"
);
