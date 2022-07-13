const mongoose = require("mongoose");

const reportSchema = new mongoose.Schema({
  title: {
    type: "string",
    trim: true,
    unique: true,
  },

  description: {
    type: String,
  },

  dashboardId: { type: mongoose.Schema.Types.ObjectId, ref: "Dashboard" },

  admin_Id: {
    type: String,
  },

  viewImage: { type: String },
  viewBase64: { type: String },

  created_at: { type: Date, default: Date.now },
  updated_at: { type: Date, default: Date.now },
});

const Report = mongoose.model("Report", reportSchema);

module.exports = Report;
