const Admin = require("../../models/admin");
const Dashboards = require("../../models/dashboard");
const { generateUID } = require("../../utils/helper");
const fs = require("fs");
const { generateToken } = require("../../utils/helper");
const imageToBase64 = require("image-to-base64");

class Dashboard {
  addDashboard = async (req, res) => {
    try {
      const { link, name } = req.body;
      // console.log(req.body, "body");
      // console.log(req.files, "Files");
      // console.log("files", req?.files[0]);
      const file = req.files[0];
      const _id = req.params.id;
      let data;
      data = await Dashboards.findOne({ admin_Id: _id, name: name });
      // console.log(data, "data");
      if (!data) {
        const user = await Admin.findById(_id);
        // const token = await createToken();
        let imageBase64 = await imageToBase64(file?.location);
        data = await Dashboards.create({
          name,
          link,
          image: file.location,
          imageBase64,
          admin_Id: _id,
        });

        res
          .status(201)
          .json({ message: "dashboard created successfully", data: data });
      } else {
        res.status(400).json({ message: "dashboard name already exists" });
      }
      // console.log(token, "token");
    } catch (error) {
      console.log(error);
      res.status(500).json({
        status: "error",
        message: "server error",
      });
    }
  };

  getDashboards = async (req, res) => {
    try {
      const _id = req.params.id;
      const data = await Dashboards.find({ admin_Id: _id });
      res.status(200).json({ data });
    } catch (error) {
      console.log(error);
      res.status(500).json({
        status: "error",
        message: "server error",
      });
    }
  };

  getSelectedDashboard = async (req, res) => {
    try {
      const { _id } = req.params;
      const data = await Dashboards.findById(_id);
      if (data) {
        res.status(200).json({ data: data });
      }
    } catch (error) {
      console.log(error);
      res.status(500).json({
        status: "error",
        message: "server error",
      });
    }
  };

  deleteDashboard = async (req, res) => {
    try {
      const { id } = req.params;
      console.log(req.params, req.body, "dddddddd");
      const data = await Dashboards.findByIdAndDelete(id);
      res.status(200).json({
        message: "dashboard deleted successfully",
      });
    } catch (error) {
      console.log(error);
      res.status(500).json({
        status: "error",
        message: "server error",
      });
    }
  };

  addDashboardImages = async (req, res) => {
    try {
      console.log(req.files, "Filedds");
      const { _id } = req.params;
      const file = req.files[0];
      const data = await Dashboards.findByIdAndUpdate(
        { _id },
        {
          $push: {
            imgArray: { image: file?.location },
          },
        }
      );
    } catch (error) {
      console.log(error);
      res.status(500).json({
        status: "error",
        message: "server error",
      });
    }
  };

  generateToken = async (req, res) => {
    try {
      const token = generateToken();
      res.status(200).json({ token });
    } catch (error) {
      console.log(error);
      res.status(500).json({
        status: "error",
        message: "server error",
      });
    }
  };
}

module.exports = new Dashboard();
