const AWS = require("aws-sdk");
const multer = require("multer");
const multerS3 = require("multer-s3");

const ALLOWED_EXTENSIONS = [
  "jpg",
  "jpeg",
  "png",
  "tiff",
  "jfif",
  "gif",
  "pdf",
  "doc",
  "docx",
  "xls",
  "xlxs",
  "csv",
  "txt",
  "rtf",
  "ppt",
  "pptx",
];

const getUniqueKey = () => {
  let length = 10;
  let result = "";
  let characters =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  let charactersLength = characters.length;

  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return (
    result +
    "-" +
    Math.floor(Math.random() * 100) +
    Math.floor(Math.random() * 10)
  );
};

const getS3 = () => {
  const { AWS_REGION, AWS_ACCESS_KEY_ID, AWS_SECRET_KEY } = process.env;

  const myConfig = new AWS.Config({
    region: AWS_REGION,
    accessKeyId: AWS_ACCESS_KEY_ID,
    secretAccessKey: AWS_SECRET_KEY,
    signatureVersion: "v4",
  });

  return new AWS.S3(myConfig);
};

exports.getS3 = getS3;

// exports.getSignedUrlForUpload = async (ext) => {
//   const { AWS_S3_GENERAL_BUCKET, AWS_SIGNED_URL_EXPIRY } = process.env;

//   return new Promise((resolve, reject) => {
//     if (!ALLOWED_EXTENSIONS.includes(ext.toLowerCase())) {
//       throw new Error("Invalid extension passed");
//     }
//     const uniqueKey = getUniqueKey();

//     let params = {
//       Key: `${uniqueKey}.${ext}`,
//       Bucket: AWS_S3_GENERAL_BUCKET,
//       Expires: AWS_SIGNED_URL_EXPIRY,
//       ACL: "public-read",
//     };
//     const s3 = getS3();

//     s3.getSignedUrl("putObject", params, function (err, signedUrl) {
//       if (err) {
//         // console.log(err);
//         return reject(err);
//       }
//       return resolve(signedUrl);
//     });
//   });
// };

exports.multerUploadS3 = multer({
  storage: multerS3({
    s3: getS3(),
    bucket: process.env.AWS_S3_GENERAL_BUCKET,
    acl: "public-read",
    metadata: function (req, file, cb) {
      // console.log(file, "file");
      cb(null, { fieldName: file.fieldname });
    },
    key: function (req, file, cb) {
      // console.log("running");
      cb(
        null,
        Date.now().toString() + "-" + file.originalname.split(" ").join("-")
      );
    },
  }),
});
