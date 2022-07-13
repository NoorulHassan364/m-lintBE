const nodemailer = require("nodemailer");
const htmlToText = require("html-to-text");
const pug = require("pug");

module.exports = class Email {
  constructor(email, name, url) {
    this.to = email;
    this.firstName = email;
    this.name = name;
    this.url = url;
    this.from = `M-Lint <${process.env.EMAIL_FROM}>`;
    // console.log(this.to, this.from, "yesy yess");
  }

  newTransport() {
    if (process.env.NODE_ENV === "production") {
      //sendgrid
      return nodemailer.createTransport({
        service: "SendGrid",
        auth: {
          user: process.env.SEND_GRID_USER_NAME,
          pass: process.env.SEND_GRID_PASSWORD,
        },
      });
    }
    return nodemailer.createTransport({
      host: process.env.MAIL_HOST,
      port: process.env.MAIL_PORT,
      secure: false,
      requireTLS: true,
      service: "gmail",
      auth: {
        user: `${process.env.MAIL_USERNAME}`,
        pass: `${process.env.MAIL_PASSWORD}`,
      },
    });
  }

  async send(template, subject) {
    //1)Render Html based on pug template
    const html = pug.renderFile(
      `${__dirname}/../views/emails/${template}.pug`,
      {
        firstName: this.firstName,
        url: this.url,
        from: this.name,
        subject,
      }
    );

    //2)define email options
    const mailOptions = {
      from: this.from,
      to: this.to,
      subject,
      html,
      text: htmlToText.fromString(html),
    };

    //3)cretae a transport and send email
    await this.newTransport().sendMail(mailOptions);
  }

  async sendWelcome() {
    // console.log("hi");
    await this.send("welcome", "Welcome to M-LiNT group");
  }
};

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

// exports.sendMail = function (mailOptions) {
//   transporter.sendMail(mailOptions, function (error, info) {
//     if (error) {
//       console.log("Email error: " + error);
//       message = "unable to send mail";
//     } else {
//       console.log("Email sent: " + info.response);
//       message = "email sent successfully";
//     }
//   });
// };
