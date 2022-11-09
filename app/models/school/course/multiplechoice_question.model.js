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
    default: "Multi-Choice",//Fill-The-Blanks|All-True|Poll
  },
  Question_title: {
    type: String,
    default: null,
  },
  Question_for: { type: String, default: null },//Quiz|Exam|Practice
  Question_options: [
    {
      optionid: {
        type: Number,
        default: 0,
      },
      option: {
        type: String,
        default: null,
      }
    },
  ],
  Correct_answer: {
    type: Number,
    default: null,
  },
  Answer_comment: {
    type: String,
    default: null,
  },
  All_True :[{
    type : Number,
    default : null
  }],
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
  Poll :[
    {
      id: {
      type: Number,
      default: 0,
    },
    poll_option: {
      type: String,
      default: null,
    },
    poll_count :{
      type : Number,
      default : 0
    }
  }
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
