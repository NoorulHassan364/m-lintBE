const mongoose = require("mongoose");

const dashboardSchema = new mongoose.Schema({
  name: {
    type: String,
  },

  link: {
    type: String,
  },

  image: {
    type: String,
  },

  imgArray: [
    {
      type: Object,
    },
  ],

  imageBase64: { type: String },

  admin_Id: {
    type: String,
  },

  token: { type: String },

  created_at: { type: Date, default: Date.now },
  updated_at: { type: Date, default: Date.now },
});

const Dashboard = mongoose.model("Dashboard", dashboardSchema);

module.exports = Dashboard;
