const mongoose = require('mongoose')
const schema = mongoose.Schema;


const multichoice_questionSchema = new schema({   
    
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "users"
    },  
    course: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "courses"
    },
    exam: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "exam"
    },
    question_title: {
        type: String,
        default: null
    },   
    question_options:[{
            optionid:{
                    type:Number,
                    default:null
                    },
            option:{
                type:String,
                default:null
                    }   
            }],
    correct_answer: {
        type: Number,
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
   
    })
  
  module.exports = mongoose.model('multichoice_question',multichoice_questionSchema,'multichoice_question')