const mongoose = require("mongoose");

const conversationSchema = mongoose.Schema(
  {
    conversationId: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    members: {
      type: Array,
      required: true,
    },
    type: {
      type: String,
      required: true,
      enum: ["group", "p2p"],
      default: "p2p",
    },
    status: {
      type: String,
      required: true,
      enum: ["active", "inactive"],
      default: "inactive",
    },
    groupName: {
      type: String,
      required: false,
    },
    groupImage: {
      type: String,
      required: false,
    },
    groupDescription: {
      type: String,
      required: false,
    },
  },
  {
    timestamps: true,
    collection: "conversations",
  },
);

module.exports = {
  Conversation: mongoose.model("Conversations", conversationSchema),
};
