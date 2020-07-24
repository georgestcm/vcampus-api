const mongoose = require("mongoose");
const schema = mongoose.Schema;

const courseCodeSchema = new schema({
  courseCode: {
    type: String,
    required:true
  },
  courseCodeNote: {
    type: String,
  },
  courseCodeValidFrom :{
    type : Date
  },
  courseCodeValidTo : {
    type : Date
  },
  school: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Schools"
},
  createdAt: {
    type: Date,
    default: new Date()
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
  }
});

module.exports = mongoose.model("CourseCodes", courseCodeSchema, "CourseCode");
