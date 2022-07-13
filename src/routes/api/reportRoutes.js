const express = require("express");
const Router = express.Router();
const reportsController = require("../../controllers/Reports/reportsController");
const { multerUploadS3 } = require("../../utils/s3Helper");

Router.post("/addReport/:admin_Id", reportsController.addReport);
Router.get("/getReports/:admin_Id", reportsController.getReports);
Router.patch("/updateReport/:id", reportsController.updateReport);
Router.delete("/deleteReport/:id", reportsController.deleteReport);
Router.patch("/downloadReport/:id", reportsController.downloadReport);

module.exports = Router;
