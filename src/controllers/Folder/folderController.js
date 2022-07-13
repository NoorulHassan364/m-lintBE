const Folder = require("../../models/folder");
const fs = require("fs");
const {
  compareString,
  generateAccessToken,
  hashString,
  randomToken,
} = require("../../utils/helper");

class Folders {
  addFolder = async (req, res) => {
    try {
      const { name, password, user_Id } = req.body;
      console.log(req.body, "boooody", req.params.admin_Id);
      const admin_Id = req.params.admin_Id;
      const data = await Folder.find({ admin_Id: admin_Id, name: name });
      // console.log(data, "data");
      if (data.length <= 0) {
        const passwordHash = await hashString(password);
        const result = await Folder.create({
          name,
          password: passwordHash,
          admin_Id,
          user_Id,
        });
        // console.log(result, "result");
        res.status(201).json({ message: "folder created successfully" });
      } else {
        return res
          .status(400)
          .json({ message: "name of this folder already exists" });
      }
    } catch (error) {
      console.log(error);
      res.status(500).json({
        status: "error",
        message: "server error",
      });
    }
  };

  getFolder = async (req, res) => {
    try {
      const admin_Id = req.params.admin_Id;
      const data = await Folder.find({ admin_Id });
      res.status(200).json({ data });
    } catch (error) {
      console.log(error);
      res.status(500).json({
        status: "error",
        message: "server error",
      });
    }
  };

  getFolderById = async (req, res) => {
    try {
      console.log(req?.body, ":dddddd");
      const { password } = req.body;
      const { _id } = req.params;
      const data = await Folder.findById({ _id });
      if (data && compareString(password, data.password)) {
        res.status(200).json({ message: "entered successfully", data: data });
      } else {
        res.status(400).json({ message: "invalid password" });
      }
    } catch (error) {
      console.log(error);
      res.status(500).json({
        status: "error",
        message: "server error",
      });
    }
  };

  updateFolder = async (req, res) => {
    try {
      const _id = req.params.id;
      console.log(req.body);
      const data = await Folder.findByIdAndUpdate({ _id }, req.body, {
        new: true,
      });
      // console.log(data, "data");
      res.status(200).json({ message: "Folder updated successfully" });
    } catch (error) {
      console.log(error);
      res.status(500).json({
        status: "error",
        message: "server error",
      });
    }
  };

  deleteFolder = async (req, res) => {
    try {
      const _id = req.params.id;
      console.log(req.params);
      const result = await Folder.findByIdAndDelete(_id);
      // console.log(result);
      res.status(200).json({
        message: "Folder deleted successfully",
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

  getFiles = async (req, res) => {
    try {
      const _id = req.params.id;
      const data = await Folder.findById(_id);
      res.status(200).json({ data: data });
    } catch (error) {
      console.log(error);
      res.status(500).json({
        status: "error",
        message: "server error",
      });
    }
  };

  uploadFile = async (req, res) => {
    try {
      const _id = req?.params?.id;
      // console.log("files", req?.files[0]);
      const file = req.files[0];

      const result = await Folder.findOne({
        files: { name: file.originalname },
      });
      if (!result) {
        // save image
        // const dir = "/public/uploads/files";
        // const path = dir + Date.now() + "-" + file.name;

        // if (!fs.existsSync(process.cwd() + dir)) {
        //   fs.mkdirSync(process.cwd() + dir, { recursive: true });
        // }
        // file.mv(process.cwd() + path, function (err) {
        //   if (err) throw err;
        // });

        // console.log(path, "path");
        const data = await Folder.findByIdAndUpdate(
          { _id },
          {
            $push: {
              files: { path: file.location, name: file.originalname },
            },
          }
        );
        // console.log(data, "data");
        res.status(201).json({ message: "upload successfully", data: data });
      } else {
        res.status(400).json({ message: "file already exists" });
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

module.exports = new Folders();
