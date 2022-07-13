const mongoose = require("mongoose");

const folderSchema = new mongoose.Schema({
  name: {
    type: String,
  },
  password: {
    type: String,
  },
  admin_Id: {
    type: String,
  },
  user_Id: {
    type: String,
  },
  files: [
    {
      type: Object,
    },
  ],
});

const Folder = mongoose.model("Folder", folderSchema);

module.exports = Folder;
