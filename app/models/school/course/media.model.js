const mongoose = require('mongoose')
const schema = mongoose.Schema;

const mediaSchema = new schema({   
user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "users"
      },       
    title: {
        type: String
    },
    fileName: {
        type: String
    },
    createdOn: {
        type: Date,
        default: new Date()
    },   
    deleted: {
        type: Boolean,
        default: false
    }    
    }
  )
  
  module.exports = mongoose.model('mediaFile',mediaSchema,'mediaFile')