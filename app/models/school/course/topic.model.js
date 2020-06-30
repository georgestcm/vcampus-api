const mongoose = require("mongoose");
const schema = mongoose.Schema;

const topicSchema = new schema({
  topic_name: {
    type: String,
  },
  created_date: {
    type: Date,
  },
  updated_date: {
    type: Date,
  },
  paragraph: [
    {
      paragraphName: {
        type: String,
        default: null,
      },
      supportingDocs: {
        type: String,
        default: null,
      },
    },
  ],
  is_deleted: {
    type: Boolean,
    default: false,
  },
  is_active: {
    type: Boolean,
    default: false,
  },
});

module.exports = mongoose.model("Topics", topicSchema, "Topics");
