const mongoose = require("mongoose");

const userSchema = mongoose.Schema(
  {
    userId: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
    friend_list: {
      type: Array,
      default: [],
    },
    friend_requests: {
      type: Array,
      default: [],
    },
  },
  {
    timestamps: true,
    collection: "users",
  },
);

module.exports = { User: mongoose.model("Users", userSchema) };
