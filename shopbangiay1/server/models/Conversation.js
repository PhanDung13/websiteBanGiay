const mongoose = require("mongoose");

const ConversationSchema = new mongoose.Schema(
  {
    id_user: { type: String },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Conversation", ConversationSchema);
