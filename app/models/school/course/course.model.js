const mongoose = require('mongoose')
const schema = mongoose.Schema;


const coureSchema = new schema({   

    course_id: {
        type: String,
        default: 1
      },
    user_id: {
        type: String,
        default: 1
      },
    name: {
        type: String,
        default: null
      },
    description: {
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
    isdeleted: {
        type: Boolean,
        default: false
      },
    isactive: {
        type: Boolean,
        default: false
      }      
  })
  
  module.exports = mongoose.model('course',coureSchema,'Course')