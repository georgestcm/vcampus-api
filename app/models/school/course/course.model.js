const mongoose = require('mongoose')
const schema = mongoose.Schema;


const coureSchema = new schema({   

    
    user: {
        
        type: mongoose.Schema.Types.ObjectId,
        ref: 'users'
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
    is_deleted: {
          type: Boolean,
          default: false
        },
    is_active: {
          type: Boolean,
          default: false
        },
         
  })
  
  module.exports = mongoose.model('course',coureSchema,'course')