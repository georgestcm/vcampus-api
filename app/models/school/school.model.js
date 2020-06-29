const mongoose = require("mongoose");
const schema = mongoose.Schema;

const sectionSchema = new schema({
  schoolName: {
    type: String,
    required: true
  },
  principleName: {
    type: String,
    required: true
  },
  schoolAddress: {
    type: String,
    required: true
  },
  createdDate: {
    type: Date,
    default: Date.now
  },
  updatedDate: {
    type: Date,
  },
  isDeleted: {
    type: Boolean,
    default: false,
  },
  isActive: {
    type: Boolean,
    default: true,
  }
});

module.exports = mongoose.model("schools", sectionSchema, "schools");
