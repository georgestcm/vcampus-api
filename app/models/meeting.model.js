const mongoose = require("mongoose");
const schema = mongoose.Schema;

const meetingSchema = new schema({
  school: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "users",
  },
  course: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Courses",
  },
  meetingName: {
    type: String,
    default: null,
  },
  meetingDescription: {
    type: String,
    default: null,
  },
  createdOn: {
    type: Date,
    default: new Date(),
  },
  updatedOn: {
    type: Date,
    default: null,
  },
  deleted: {
    type: Boolean,
    default: false,
  },
});

module.exports = mongoose.model("Meeting", meetingSchema, "meeting");
