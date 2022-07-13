const mongoose = require("mongoose");

const usageAnalyticsSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  dashboardId: { type: mongoose.Schema.Types.ObjectId, ref: "Dashboard" },
  adminId: { type: String },
  lastView: {
    type: Date,
  },
  time: { type: String },
  numberOfUse: { type: Number, default: 0 },

  reportId: { type: mongoose.Schema.Types.ObjectId, ref: "Report" },
  reportName: { type: String },
  noOfDownloads: { type: Number },

  created_at: { type: Date, default: Date.now },
  updated_at: { type: Date, default: Date.now },
});

const UsageAnalytics = mongoose.model("UsageAnalytics", usageAnalyticsSchema);

module.exports = UsageAnalytics;
