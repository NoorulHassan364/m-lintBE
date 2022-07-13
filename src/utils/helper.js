const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const ms = require("ms");
const { v4: uuidv4 } = require("uuid");
let crypto = require("crypto");
// const { v4: uuidv4 } = require("uuid");
const JWT = require("simple-jwt");

exports.hashString = (string) => {
  return bcrypt.hashSync(string, Number.parseInt(process.env.SALT_ROUND));
};

exports.compareString = (string, hashString) =>
  bcrypt.compareSync(string, hashString);

exports.currentDateFullString = function () {
  var d = new Date(),
    dformat =
      [d.getFullYear(), d.getMonth() + 1, d.getDate()].join("-") +
      " " +
      [d.getHours(), d.getMinutes(), d.getSeconds()].join(":");
  return dformat;
};

exports.formatDate = function (date = new Date().now()) {
  var d = new Date(date),
    month = "" + (d.getMonth() + 1),
    day = "" + d.getDate(),
    year = d.getFullYear();

  if (month.length < 2) month = "0" + month;
  if (day.length < 2) day = "0" + day;

  return [year, month, day].join("-");
};

exports.generateUID = function () {
  var firstPart = (Math.random() * 46656) | 0;
  var secondPart = (Math.random() * 46656) | 0;
  firstPart = ("000" + firstPart.toString(36)).slice(-3);
  secondPart = ("000" + secondPart.toString(36)).slice(-3);
  return firstPart + secondPart;
};

exports.extractString = (str) => {
  return str.substring(str.lastIndexOf("<#>") + 3, str.lastIndexOf("</#>"));
};

exports.randomToken = (length = 48) => {
  return new Promise((resolve, reject) => {
    crypto.randomBytes(length, function (err, buffer) {
      var token = buffer.toString("hex");
      if (err) reject(err);
      else resolve(token);
    });
  });
};

exports.generateAccessToken = (data) => {
  return jwt.sign(data.toJSON(), process.env.TOKEN_SECRET, {
    expiresIn: process.env.EXPIRES_IN,
  });
};

exports.splitArray = (arr, length) => {
  let newArray = [];
  let noOfArrays = Math.ceil(arr.length / length);

  if (!length) {
    return arr;
  }

  let startIndex = 0;
  for (let i = 0; i < noOfArrays; i++) {
    newArray = [
      ...newArray,
      arr.slice(startIndex, startIndex + parseInt(length)),
    ];
    startIndex += parseInt(length);
  }

  return newArray;
};

exports.generateToken = () => {
  const date = new Date();
  const day = date.getTime();
  const exp_time = (day + 1 * 60 * 1000) / 1000;
  console.log(exp_time);

  const header = {
    typ: "JWT",
    alg: "HS256",
    kid: "236ec85c-38fe-45d8-8317-02a4aac38e31",
    iss: "9a8c6028-bfea-47ff-9829-d3c434b92521",
  };

  const payload = {
    iss: "9a8c6028-bfea-47ff-9829-d3c434b92521",
    exp: exp_time,
    jti: uuidv4(),
    aud: "tableau",
    sub: "cical89343@hekarro.com",
    scp: ["tableau:views:embed", "tableau:metrics:embed"],
  };

  const secret = "TeBqUyM35zA4riO3Y3ZTXCYmvsMbMH5HCPMskkcodKY=";
  const token = JWT.getToken(header, payload, secret);

  return token;
};
