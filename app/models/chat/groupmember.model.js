const mongoose = require("mongoose");
const schema = mongoose.Schema;

const groupMemberSchema = new schema({
  AdminId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "users",
  },
  GroupMemberId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "users",
  },
  GroupId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Group",
  },
  Chat: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Chat",
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
    },
  Is_active: {
        type: Boolean,
        default: true
    }  ,
 
 
});

module.exports = mongoose.model("GroupMember", groupMemberSchema, "GroupMember");
