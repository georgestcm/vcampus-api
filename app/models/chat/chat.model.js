const mongoose = require("mongoose");
const schema = mongoose.Schema;

const chatSchema = new schema({
 
  GroupId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Group",
  },
  To:{
    type: mongoose.Schema.Types.ObjectId,
    ref: "user",
  },
  From:{
    type: mongoose.Schema.Types.ObjectId,
    ref: "user",
  }, 
  Message:{
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
  Is_deleted: {
        type: Boolean,
        default: false
    }
    
 
});

module.exports = mongoose.model("Chat", chatSchema, "Chat");
