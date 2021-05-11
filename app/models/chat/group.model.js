const { text } = require("body-parser");
const mongoose = require("mongoose");
const { now } = require("underscore");
const schema = mongoose.Schema;

const groupSchema = new schema({
  AdminId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "users",
  },
  GroupMember: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: "users",   
  }],
  Name:{
    type: String,
    default: null
  },
  Description:{
    type: String,
    default: null
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
  Is_active: {
      type: Boolean,
      default: true
  },     
  Is_deleted: {
        type: Boolean,
        default: false
  },
  Is_admin: {
      type: Boolean,
      default: false
  },
SchoolId :{type: mongoose.Schema.Types.ObjectId,
  ref: "users"
  },
  Chats :[{
    SentBy : { type : mongoose.Schema.Types.ObjectId, ref : "users"},
    Message : {type : String},
    SentOn : {type :Date, default : Date.now}
  }]
});

module.exports = mongoose.model("Group", groupSchema, "Group");
