const Report = require("../../models/reports");
const UsageAnalytics = require("../../models/usageAnalytics");
const imageToBase64 = require("image-to-base64");
const moment = require("moment");

class Reports {
  addReport = async (req, res) => {
    try {
      const { title, description, dashboardId, viewImage } = req.body;
      console.log(req.body, "body");
      const result = await Report.findOne({
        title,
      });
      // console.log(result, "result");
      if (!result) {
        const _id = req.params.admin_Id;
        if (viewImage) {
          let viewBase64 = await imageToBase64(viewImage);
          const data = await Report.create({
            title,
            description,
            dashboardId,
            admin_Id: _id,
            viewImage,
            viewBase64: viewBase64,
          });
        } else {
          const data = await Report.create({
            title,
            description,
            dashboardId,
            admin_Id: _id,
            viewImage,
          });
        }
        res.status(201).json({ message: "report successfully created" });
      } else {
        res.status(400).json({ message: "report name already exists" });
      }
    } catch (error) {
      console.log(error);
      res.status(500).json({
        status: "error",
        message: "server error",
      });
    }
  };

  getReports = async (req, res) => {
    try {
      const admin_Id = req.params.admin_Id;
      const data = await Report.find({ admin_Id }).populate([
        { path: "dashboardId" },
      ]);
      res.status(200).json({ data });
    } catch (error) {
      console.log(error);
      res.status(500).json({
        status: "error",
        message: "server error",
      });
    }
  };

  updateReport = async (req, res) => {
    try {
      const _id = req.params.id;
      const data = await Report.findByIdAndUpdate({ _id }, req.body, {
        new: true,
      });
      res.status(200).json({ message: "report updated successfully" });
    } catch (error) {
      console.log(error);
      res.status(500).json({
        status: "error",
        message: "server error",
      });
    }
  };

  deleteReport = async (req, res) => {
    try {
      const admin_Id = req.params.id;
      console.log(req.params);
      const result = await Report.findByIdAndDelete(admin_Id);
      // console.log(result);
      res.status(200).json({
        message: "report deleted successfully",
        admin_Id: result.admin_Id,
      });
    } catch (error) {
      console.log(error);
      res.status(500).json({
        status: "error",
        message: "server error",
      });
    }
  };

  downloadReport = async (req, res) => {
    try {
      const _id = req.params.id;
      const { userId, adminId } = req.body;
      // console.log(req.body, "boooody");
      let data, result;
      result = await Report.findById(_id);
      data = await UsageAnalytics.findOne({ reportId: _id, userId: userId });
      if (data) {
        data = await UsageAnalytics.findOneAndUpdate(
          { reportId: _id, userId: userId },
          { $inc: { noOfDownloads: 1 }, time: moment().format("LTS") },
          { new: true }
        );
      } else {
        data = await UsageAnalytics.create({
          userId,
          reportId: result._id,
          adminId,
          noOfDownloads: 1,
          time: moment().format("LTS"),
          dashboardId: result.dashboardId,
        });
      }
    } catch (error) {
      console.log(error);
      res.status(500).json({
        status: "error",
        message: "server error",
      });
    }
  };
}

module.exports = new Reports();
