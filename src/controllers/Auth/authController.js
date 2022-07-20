const User = require("../../models/user");
const Admin = require("../../models/admin");
const Email = require("../../utils/mailer");
const ResetEmail = require("../../utils/resetMailer");
const ApprovalMail = require("../../utils/approvalMail");
const UsageAnalytics = require("../../models/usageAnalytics");

const {
  compareString,
  generateAccessToken,
  hashString,
  randomToken,
} = require("../../utils/helper");

class Auth {
  signup = async (req, res) => {
    try {
      console.log(req.body);
      console.log(req.params);
      let { name, email, address, password, phone, role } = req.body;
      const user = await User.findOne({ email });
      const admin = await Admin.findOne({ email });

      // console.log(user);
      if (user || admin) {
        return res.status(400).json({
          status: "error",
          message: "email already exist!",
        });
      }
      const passwordHash = await hashString(password);
      let data;
      if (role === "admin") {
        data = await Admin.create({
          name,
          email,
          address,
          phone,
          role,
          password: passwordHash,
        });
        let superAdmin = "nnjei001@gmail.com";
        const url = `${process.env.FRONT_END_URL}/admin_approval/${data._id}`;
        await new ApprovalMail(
          superAdmin,
          data?.name,
          data?.email,
          url
        ).sendWelcome();
      }
      if (role === "user") {
        console.log(req.body.admin_Id);
        const result = await Admin.findById(req.body.admin_Id);
        if (result) {
          data = await User.create({
            name,
            email,
            address,
            phone,
            role,
            password: passwordHash,
            admin_Id: req.body.admin_Id,
          });
        } else {
          return res.status(400).json({ message: "wrong admin id" });
        }
      }
      // console.log(data, "dddddaaata");
      res.status(201).json({
        status: "success",
        message: "signup successfully!",
        data: data,
      });
    } catch (error) {
      console.log(error);
      res.status(500).json({
        status: "error",
        message: "server error",
      });
    }
  };

  login = async (req, res) => {
    try {
      let { email, password } = req.body;
      console.log(req.body);
      let response;
      response = await User.findOne({ email }).populate({ path: "admin_Id" });
      // console.log(response);
      if (
        response &&
        response?.role === "user" &&
        compareString(password, response.password)
      ) {
        let accessToken = generateAccessToken(response);
        // console.log(accessToken, "......");
        await User.findByIdAndUpdate(
          { _id: response?._id },
          { lastLogin: new Date() },
          { new: true }
        );

        return res.status(200).json({
          status: "success",
          data: { accessToken, response },
          message: "login Successfully!",
        });
      } else {
        response = await Admin.findOne({ email });

        if (
          response &&
          response?.role === "admin" &&
          compareString(password, response.password)
        ) {
          if (response?.isApproved === false) {
            return res.status(400).json({ message: "Approval pending." });
          }
          let accessToken = generateAccessToken(response);

          return res.status(200).json({
            status: "success",
            data: { accessToken, response },
            message: "login Successfully!",
          });
        } else {
          res.status(400).json({ message: "Invalid Credential" });
        }
      }
    } catch (error) {
      console.log(error);
      res.status(500).json({
        status: "error",
        message: "server error",
      });
    }
  };

  adminApproval = async (req, res) => {
    try {
      const { _id } = req.params;
      const data = await Admin.findById(_id);
      if (data) {
        let result = await Admin.findByIdAndUpdate(
          { _id },
          { isApproved: true },
          { new: true }
        );
        res.status(200).json({ data: result });
      }
    } catch (error) {
      console.log(error);
      res.status(500).json({
        status: "error",
        message: "server error",
      });
    }
  };

  resetPassword = async (req, res) => {
    try {
      const { _id } = req.params;
      const user = await User.findById(_id);
      const admin = await Admin.findById(_id);
      if (!user && !admin) {
        return res.status(400).json({ message: "unable to find user" });
      } else {
        const { newPassword } = req.body;
        const passwordHash = await hashString(newPassword);
        if (user) {
          let data = await User.findByIdAndUpdate(
            _id,
            { password: passwordHash },
            { new: true }
          );
          res.status(200).json({ message: "password reset successfully" });
        }
        if (admin) {
          let data = await Admin.findByIdAndUpdate(
            _id,
            { password: passwordHash },
            { new: true }
          );
          res.status(200).json({ message: "password reset successfully" });
        }
      }
    } catch (error) {
      console.log(error);
      res.status(500).json({
        status: "error",
        message: "server error",
      });
    }
  };

  sendResetPassword = async (req, res) => {
    try {
      console.log(req.body);
      const { email } = req.body;
      const user = await User.findOne({ email });
      const admin = await Admin.findOne({ email });
      if (!user && !admin) {
        return res.status(400).json({ message: "email not exist" });
      } else {
        if (user) {
          const url = `${process.env.FRONT_END_URL}/resetPassword/${user._id}`;
          await new ResetEmail(email, user.name, url).sendWelcome();
          res.status(200).json({ message: "Reset Mail sent successfully" });
        }

        if (admin) {
          const url = `${process.env.FRONT_END_URL}/resetPassword/${admin._id}`;
          await new ResetEmail(email, admin.name, url).sendWelcome();
          res.status(200).json({ message: "Reset Mail sent successfully" });
        }
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

module.exports = new Auth();
