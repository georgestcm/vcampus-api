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
  chapters: {
    type: [mongoose.Schema.Types.ObjectId],
    ref: "chapters",
  },
});

module.exports = mongoose.model("sections", sectionSchema);
