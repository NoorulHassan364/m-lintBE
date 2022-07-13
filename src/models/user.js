const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  name: {
    type: "string",
  },

  email: {
    type: String,
    unique: [true, "email already exist"],
    required: [true, "you must have an email"],
  },

  address: {
    type: String,
    required: [true, "you must have an address"],
  },

  phone: {
    type: String,
  },

  password: {
    type: String,
    required: [true, "you must have password"],
  },

  role: {
    type: String,
  },

  admin_Id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Admin",
  },

  messages: [
    {
      type: Object,
    },
  ],

  lastLogin: { type: Date },

  created_at: { type: Date, default: Date.now },
  updated_at: { type: Date, default: Date.now },
});

const User = mongoose.model("User", userSchema);

module.exports = User;
