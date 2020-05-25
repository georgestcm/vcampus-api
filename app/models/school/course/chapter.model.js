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
  topics: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Topics",
    },
  ],
});

module.exports = mongoose.model("Chapters", chapterSchema, "Chapters");
