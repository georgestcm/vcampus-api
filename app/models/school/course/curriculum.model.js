const mongoose = require("mongoose");
const schema = mongoose.Schema;

const CurriculumSchema = new schema({
    curriculum: {
    type: String,
    required:true
  },
  
  school: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Schools"
},
  createdAt: {
    type: Date,
    default: new Date()
  },
  updatedAt: {
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

module.exports = mongoose.model("Curriculums", CurriculumSchema, "Curriculums");
