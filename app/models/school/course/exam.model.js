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
    exam_name: {
        type: String,
        default: null
    },
    exam_description: {
        type: String,
        default: null
    },
    exam_startDateTime: {
        type: String,
        default: null
    },
    exam_endDateTime: {
        type: String,
        default: null
    }, 
    Is_active: {
        type: Boolean,
        default: false
    },      
    created_date: {
        type: String,
        default: null
    },
    updated_date: {
        type: String,
        default: null
    },
    deleted_date: {
        type: String,
        default: null
    },
    is_deleted: {
        type: Boolean,
        default: false
    },
    
         
    }
  )
  
  module.exports = mongoose.model('exam',examSchema,'exam')