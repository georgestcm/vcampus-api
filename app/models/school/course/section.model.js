const mongoose = require("mongoose");
const schema = mongoose.Schema;

const sectionSchema = new schema({
  section_name: {
    type: String,
  },
  created_date: {
    type: Date,
  },
  updated_date: {
    type: Date,
  },
  is_deleted: {
    type: Boolean,
    default: false,
  },
  is_active: {
    type: Boolean,
    default: false,
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "users",
  },
  course: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "courses",
  },
});

module.exports = mongoose.model("sections", sectionSchema);
