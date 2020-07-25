const mongoose = require("mongoose");
const schema = mongoose.Schema;

const coureSchema = new schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "users",
  },
  sections: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Sections",
    },
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
    type: String
},
  curriculum: {
    type: String,
  },
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
     {type : String}
    // {
    //   type: mongoose.Schema.Types.ObjectId,
    //   ref: "CourseCodes",
    // },
  ] 
});

module.exports = mongoose.model("Courses", coureSchema, "Courses");
