const mongoose = require('mongoose')
const schema = mongoose.Schema;
const chapter= require

const sectionSchema = new schema({   

    
    section_name: {
        type: String,
        default: null
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
    is_active: {
        type: Boolean,
        default: false
      }  ,
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
  
  module.exports = mongoose.model('section',sectionSchema,'section')