const express = require("express");
const Router = express.Router();
const folderController = require("../../controllers/Folder/folderController");
const { multerUploadS3 } = require("../../utils/s3Helper");

Router.post("/addFolder/:admin_Id", folderController.addFolder);
Router.get("/getFolder/:admin_Id", folderController.getFolder);
Router.delete("/deleteFolder/:id", folderController.deleteFolder);
Router.patch("/updateFolder/:id", folderController.updateFolder);
Router.post(
  "/uploadFile/:id",
  multerUploadS3.any(),
  folderController.uploadFile
);
Router.post("/getFolderById/:_id", folderController.getFolderById);
Router.get("/getFiles/:id", folderController.getFiles);

module.exports = Router;
