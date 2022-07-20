require("dotenv").config();
const express = require("express");
const cors = require("cors");
// const fileUpload = require("express-fileupload");
require("dotenv").config({ path: "src/.env" });

const app = express();
require("./src/db/connection");
// const db = require("./models/index");s
const routes = require("./src/routes");

app.use(cors());
app.use(express.json({ limit: "25mb" }));

app.use(express.urlencoded({ limit: "25mb", extended: true }));
// app.use(fileUpload());

app.use(express.static("build"));
app.use("/public", express.static("public"));
app.use("/api", routes);

// db.sequelize.sync();

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}.`);
});
