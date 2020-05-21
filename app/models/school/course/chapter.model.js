const mongoose = require("mongoose");
const schema = mongoose.Schema;

const chapterSchema = new schema({
  chapter_name: {
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
  section: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "sections",
  },
  course: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "courses",
  },
});

module.exports = mongoose.model("chapters", chapterSchema);
