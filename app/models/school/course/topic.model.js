const mongoose = require('mongoose')
const schema = mongoose.Schema;


const topicSchema = new schema({   
  
    // user_id: {
    //   type: String,
    //   default: 1
    // },
    // course_id: {
    //     type: String,
    //     default: 1
    //   },    
    // section_id: {
    //     type: String,
    //     default: 1
    //   },
    topic_name: {
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
    paragraph:[{
        description:{
          type:String,
          default:null
        },
        document:{
          type:String,
          default:null
        }
      }],     
    is_deleted: {
        type: Boolean,
        default: false
      },
    is_active: {
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
      }, 
      section: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'section'
      }, 
      chapter: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'chapter'
      },      
  })
  
  module.exports = mongoose.model('topic',topicSchema,'topic')