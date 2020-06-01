const mongoose = require('mongoose')
const schema = mongoose.Schema;


const examSchema = new schema({   
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "users"
      }, 
    course: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "courses"
    },
    questions:{
        type: [mongoose.Schema.Types.ObjectId],
        ref:"multichoice_question"
        },       
    Exam_Name: {
        type: String,
        default: null
    },
    Exam_Description: {
        type: String,
        default: null
    },
    Exam_StartDateTime: {
        type: String,
        default: null
    },
    Exam_EndDateTime: {
        type: String,
        default: null
    }, 
    Is_active: {
        type: Boolean,
        default: false
    },      
    Created_Date: {
        type: String,
        default: null
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
  
  module.exports = mongoose.model('Exam',examSchema,'exam')