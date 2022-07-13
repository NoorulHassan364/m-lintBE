const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const adminSchema = new mongoose.Schema({
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

  isApproved: { type: Boolean, default: false },

  notifications: [
    {
      type: Object,
    },
  ],

  messages: [
    {
      type: Object,
    },
  ],

  created_at: { type: Date, default: Date.now },
  updated_at: { type: Date, default: Date.now },
});

const Admin = mongoose.model("Admin", adminSchema);

module.exports = Admin;
