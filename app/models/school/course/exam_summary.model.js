const mongoose = require('mongoose')
const schema = mongoose.Schema;


const examSummarySchema = new schema({   
    student: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "users"
      }, 
    exam: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "exam"
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
    ExamStartDateTime: {
        type: Date,
        default: new Date()
    },
    ExamEndDateTime: {
        type: Date,
        default: null
    },    
    Created_Date: {
        type: String,
        default: new Date()
    },
    Updated_Date: {
        type: String,
        default: null
    },
    Deleted_Date: {
        type: String,
        default: null
    },
    Is_deleted: {
        type: Boolean,
        default: false
    },
         
    }
  )
  
  module.exports = mongoose.model('ExamSummary',examSummarySchema,'ExamSummary')