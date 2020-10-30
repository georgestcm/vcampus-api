const mongoose = require('mongoose')
const schema = mongoose.Schema;


const examSchema = new schema({   
    school: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "users"
      }, 
    course: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Courses"
    },
    questions:[{
        type: mongoose.Schema.Types.ObjectId,
        ref:"multichoice_question"
        }],
    student: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "users",
            default : null
          },     
    Exam_Name: {
        type: String,
        default: null
    },
    Exam_Description: {
        type: String,
        default: null
    },
    Exam_Type: {
        type: String,
        default: null
    },
    Exam_StartDateTime: {
        type: Date,
        default: null
    },
    Exam_EndDateTime: {
        type: Date,
        default: null
    }, 
    Exam_Status :{
        type : String,
        default : 'Pending'
    },
    TotalQuestion: {
        type: Number,
        default: 0
    },     
    CorrectAnswer: {
        type: Number,
        default: 0
    },
    InCorrectAnswer: {
        type: String,
        default: 0
    },     
    Created_Date: {
        type: Date,
        default: new Date()
    },
    Updated_Date: {
        type: Date,
        default: null
    },
    Deleted_Date: {
        type: Date,
        default: null
    },
    Is_deleted: {
        type: Boolean,
        default: false
    }
         
    }
  )
  
  module.exports = mongoose.model('Exam',examSchema,'exam')