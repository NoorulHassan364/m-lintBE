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
    await this.send("resetPassword", "Reset Password M-LiNT");
  }
};
