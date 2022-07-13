const express = require("express");
const Router = express.Router();
const userController = require("../../controllers/User/userController");

Router.get("/getUsers/:admin_Id", userController.getUsers);
Router.patch("/updateUser/:id", userController.updateUser);
Router.delete("/deleteUser/:id", userController.deleteUser);
Router.post("/sendInvitation/:id", userController.sendInvitation);
Router.post("/get-notifications/:id", userController.getNotifications);
Router.post("/add-notification", userController.addNotification);
Router.patch("/sendMessage/:_id", userController.addMessage);
Router.get("/readMessages/:adminId/:userId", userController.readMessages);
// Router.get("/readMessages/:id", userController.readMessages);
Router.patch("/updateLastView/:id", userController.updateLastView);
Router.get("/getUsageAnalytics/:id", userController.getUsageAnalytics);

module.exports = Router;
