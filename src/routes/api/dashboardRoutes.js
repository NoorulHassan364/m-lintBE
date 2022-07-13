const express = require("express");
const Router = express.Router();
const dashboardController = require("../../controllers/Dashboard/dashboardController");
const { multerUploadS3 } = require("../../utils/s3Helper");

Router.post(
  "/addDashboard/:id",
  multerUploadS3.any(),
  dashboardController.addDashboard
);

Router.patch(
  "/addDashboardImages/:_id",
  multerUploadS3.any(),
  dashboardController.addDashboardImages
);

Router.patch(
  "/deleteDashboard/:admin_Id/:id",
  dashboardController.deleteDashboard
);
Router.get("/getDashboards/:id", dashboardController.getDashboards);
Router.get(
  "/getSelectedDashboard/:_id",
  dashboardController.getSelectedDashboard
);

Router.get("/getToken", dashboardController.generateToken);

module.exports = Router;
