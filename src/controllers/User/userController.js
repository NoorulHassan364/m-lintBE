const User = require("../../models/user");
const Admin = require("../../models/admin");
const UsageAnalytics = require("../../models/usageAnalytics");
const moment = require("moment");
const { format } = require("date-fns");
const {
  compareString,
  generateAccessToken,
  hashString,
  randomToken,
} = require("../../utils/helper");
const Email = require("../../utils/mailer");
const nodemailer = require("nodemailer");

class Users {
  getUsers = async (req, res) => {
    try {
      console.log(req.params);
      const data = await User.find({ admin_Id: req.params.admin_Id });
      res.status(200).json({ data: data });
    } catch (error) {
      console.log(error);
      res.status(500).json({
        status: "error",
        message: "server error",
      });
    }
  };

  updateUser = async (req, res) => {
    try {
      const data = await User.findByIdAndUpdate(
        { _id: req.params.id },
        req.body,
        {
          new: true,
        }
      );
      if (data) {
        res.status(200).json({ message: "successfully updated" });
      } else {
        res.status(400).json({ message: "unable to update" });
      }
    } catch (error) {
      console.log(error);
      res.status(500).json({
        status: "error",
        message: "server error",
      });
    }
  };

  deleteUser = async (req, res) => {
    try {
      const _id = req.params.id;
      const result = await User.findByIdAndDelete(_id);
      // console.log(result);
      if (result) {
        res
          .status(200)
          .json({ message: "delete successfully", admin_Id: result.admin_Id });
      } else {
        res.status(404).json({ message: "unable to delete" });
      }
    } catch (error) {
      console.log(error);
      res.status(500).json({
        status: "error",
        message: "server error",
      });
    }
  };

  getNotifications = async (req, res) => {
    try {
      console.log(req.params);
      const { id } = req.params;
      console.log(req.body);
      const { days } = req.body;
      if (days !== 0) {
        const date = new Date();
        let last = new Date(date.getTime() - days * 24 * 60 * 60 * 1000);
        const result = await Admin.findById(id).select("notifications");
        // console.log(result, "result");
        const arr = result?.notifications.filter(
          (item) => item.createdAt >= last && item.createdAt <= date
        );
        res.status(200).json({ data: arr });
      } else {
        const data = await Admin.findById(id).select("notifications");
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

  addMessage = async (req, res) => {
    try {
      console.log(req.params);
      console.log(req.body);
      const { _id } = req.params;
      const { user_id, message } = req.body;
      let data1, data2, data;
      data1 = await Admin.findById(_id);
      data2 = await User.findById({ _id: user_id });
      console.log(data1, data2);
      if (data1 && data2) {
        data = await Admin.findByIdAndUpdate(
          { _id },
          {
            $push: {
              messages: {
                from: "me",
                name: data2?.name,
                message: message,
                createdAt: new Date(),
              },
            },
          },
          { new: true }
        );

        data = await User.findByIdAndUpdate(
          { _id: user_id },
          {
            $push: {
              messages: {
                from: "admin",
                message: message,
                name: data1?.name,
                createdAt: new Date(),
              },
            },
          },
          { new: true }
        );
        res.status(200).json({ message: "Message sent successfully" });
      } else {
        data1 = await Admin.findById({ _id: user_id });
        data2 = await User.findById(_id);
        console.log(data1, data2);
        if (data1 && data2) {
          data = await Admin.findByIdAndUpdate(
            { _id: user_id },
            {
              $push: {
                messages: {
                  from: "user",
                  name: data2?.name,
                  message: message,
                  createdAt: new Date(),
                },
              },
            },
            { new: true }
          );

          data = await User.findByIdAndUpdate(
            { _id: _id },
            {
              $push: {
                messages: {
                  from: "me",
                  message: message,
                  name: data1?.name,
                  createdAt: new Date(),
                },
              },
            },
            { new: true }
          );
          res.status(200).json({ message: "Message sent successfully" });
        } else {
          data1 = await User.findById({ _id: user_id });
          data2 = await User.findById(_id);
          if (data1 && data2) {
            data = await User.findByIdAndUpdate(
              { _id: user_id },
              {
                $push: {
                  messages: {
                    from: "user",
                    name: data2?.name,
                    message: message,
                    createdAt: new Date(),
                  },
                },
              },
              { new: true }
            );

            data = await User.findByIdAndUpdate(
              { _id: _id },
              {
                $push: {
                  messages: {
                    from: "me",
                    message: message,
                    name: data1?.name,
                    createdAt: new Date(),
                  },
                },
              },
              { new: true }
            );
            res.status(200).json({ message: "Message sent successfully" });
          }
        }
      }
      // let _id;
      // _id = req.params.id;
      // const { message } = req.body;
      // const data = await User.findByIdAndUpdate(
      //   { _id },
      //   {
      //     $push: {
      //       messages: {
      //         from: "admin",
      //         adminName: adminName,
      //         message: message,
      //         createdAt: new Date(),
      //         theDate: new Date().toLocaleDateString(),
      //       },
      //     },
      //   },
      //   { new: true }
      // );
      // // console.log(data, "data");
      // let id = data.admin_Id;
      // const result = await Admin.findByIdAndUpdate(
      //   { _id: id },
      //   {
      //     $push: {
      //       messages: {
      //         from: "me",
      //         message: message,
      //         user_name: data.name,
      //         createdAt: new Date(),
      //         userId: _id,
      //       },
      //     },
      //   },
      //   { new: true }
      // );
      // // console.log(result);
    } catch (error) {
      console.log(error);
      res.status(500).json({
        status: "error",
        message: "server error",
      });
    }
  };

  readMessages = async (req, res) => {
    try {
      let data, _id;
      if (req.params.adminId && req.params.userId == 0) {
        _id = req.params.adminId;
        data = await Admin.findById(_id).select("messages");
        res.status(200).json({ data: data });
      } else {
        _id = req.params.userId;
        data = await User.findById(_id).select("messages");
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

  // readMessages = async (req, res) => {
  //   try {
  //     const _id = req.params.id;
  //     const data = await User.findById(_id).select("messages");
  //     res.status(200).json({ data: data });
  //   } catch (error) {
  //     console.log(error);
  //     res.status(500).json({
  //       status: "error",
  //       message: "server error",
  //     });
  //   }
  // };

  updateLastView = async (req, res) => {
    try {
      const _id = req.params.id;
      let data;
      data = await UsageAnalytics.findOne({
        userId: _id,
        dashboardId: req.body._id,
      });
      // console.log(data, "find data");
      if (!data) {
        data = await UsageAnalytics.create({
          userId: _id,
          dashboardId: req.body._id,
          adminId: req.body.admin_Id,
          lastView: new Date(),
          time: format(new Date(), "hh:mm:ss a"),
          numberOfUse: 1,
        });
        // console.log(data, "create data");
        res.status(200).json({ data: data });
      } else {
        const result = await UsageAnalytics.findByIdAndUpdate(
          data._id,
          {
            $inc: { numberOfUse: 1 },
            lastView: new Date(),
            time: format(new Date(), "hh:mm:ss a"),
          },
          { new: true }
        );
        // console.log(result, "updated");
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

  getUsageAnalytics = async (req, res) => {
    try {
      const { id } = req.params;
      console.log(id, "params");
      const data = await UsageAnalytics.find({ adminId: id }).populate([
        {
          path: "userId",
        },
        {
          path: "dashboardId",
        },
        {
          path: "reportId",
        },
      ]);
      // console.log(data, "data");
      res.status(200).json({ data: data });
    } catch (error) {
      console.log(error);
      res.status(500).json({
        status: "error",
        message: "server error",
      });
    }
  };

  addNotification = async (req, res) => {
    try {
      console.log(req.body);
      const data = await Admin.findByIdAndUpdate(
        { _id: req.body.admin_Id },
        {
          $push: {
            notifications: { name: req.body.name, createdAt: new Date() },
          },
        }
      );
      res.status(200).json({ data: data });
    } catch (error) {
      console.log(error);
      res.status(500).json({
        status: "error",
        message: "server error",
      });
    }
  };

  sendInvitation = async (req, res) => {
    try {
      console.log(req.body);
      const { email } = req.body;
      const _id = req.params.id;
      console.log(_id, email);
      const user = await Admin.findById({ _id });
      // console.log(user, "user");
      if (user) {
        const url = `http://localhost:3000/signup/${user._id}`;
        await new Email(email, user.name, url).sendWelcome();
        res.status(200).json({ message: "email sent successfully" });
        // var transporter = nodemailer.createTransport({
        //   host: "smtp.gmail.com",
        //   port: 587,
        //   secure: false,
        //   requireTLS: true,
        //   service: "gmail",
        //   auth: {
        //     user: `${process.env.MAIL_USERNAME}`,
        //     pass: `${process.env.MAIL_PASSWORD}`,
        //   },
        // });
        // const options = {
        //   from: process.env.MAIL_USERNAME,
        //   to: email,
        //   sender: process.env.MAIL_FROM_NAME,
        //   subject: `${user.name}, here's your PIN`,
        //   html: `
        //     <div style="align: center;">
        //     <h3>Hi ${email},</h3>
        //     <h2>${user.name} is likely to invite you join our company</h2>
        //     <p>please accept invitation if you to join and fill the desired information</p>
        //     <a href="http://localhost:3000/signup/${user._id}" style="
        //       outline: none;
        //       text-decoration: none;
        //       display: inline-block;
        //       text-align: center;
        //       line-height: 3;
        //       color: white;
        //       background: #4863A0;
        //       padding: 3px 10px 3px 10px;
        //       border-radius: 5px;
        //     ">Accept Invitation</a>
        //     </div>
        //     `,
        // };
        // transporter.sendMail(options, function (error, info) {
        //   if (error) {
        //     console.log("Email error: " + error);
        //     res.status(400).json({ message: "unable to send mail" });
        //   } else {
        //     console.log("Email sent: " + info.response);
        //     res.status(200).json({ message: "email sent successfully" });
        //   }
        // });
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

module.exports = new Users();
