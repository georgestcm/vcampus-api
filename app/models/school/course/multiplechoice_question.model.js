const mongoose = require("mongoose");
const schema = mongoose.Schema;

const multichoice_questionSchema = new schema({
  school: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "users",
  },
  course: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Courses",
  },
  Type: {
    type: String,
    default: "Multi-choice",
  },
  Question_title: {
    type: String,
    default: null,
  },
  Question_for: { type: String, default: null },
  Question_options: [
    {
      optionid: {
        type: Number,
        default: 0,
      },
      option: {
        type: String,
        default: null,
      },
    },
  ],
  Correct_answer: {
    type: Number,
    default: null,
  },
  Fill_The_Blanks: [
    {
      id: {
        type: Number,
        default: 0,
      },
      answer: {
        type: String,
        default: null,
      },
    },
  ],
  Is_deleted: {
    type: Boolean,
    default: false,
  },
  Is_require: {
    type: Boolean,
    default: false,
  },
});

module.exports = mongoose.model(
  "multichoice_question",
  multichoice_questionSchema,
  "multichoice_question"
);
