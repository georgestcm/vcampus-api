const mongoose = require('mongoose')
const schema = mongoose.Schema;


const multichoice_questionSchema = new schema({   
    
    
    question: {
        type: String,
        default: null
    },   
    options:{
        type:Array,
        default:[]
        },     
    created_date: {
        type: String,
        default: null
    },
    updated_date: {
        type: String,
        default: null
    },
    is_deleted: {
        type: Boolean,
        default: false
    },
    is_require: {
        type: Boolean,
        default: false
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'users'
    },  
    course: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'course'
    }      
    }
  )
  
  module.exports = mongoose.model('multichoice_question',multichoice_questionSchema,'multichoice_question')