const mongoose = require('mongoose')
const schema = mongoose.Schema;


const chapterSchema = new schema({   

      
    
    chapter_name: {
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
      } ,
      user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'users'
      },  
      section: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'section'
      }, 
      course: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'course'
      },     
  })
  
  module.exports = mongoose.model('chapter',chapterSchema,'chapter')