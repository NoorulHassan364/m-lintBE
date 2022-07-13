const mongoose = require("mongoose");
// mongodb+srv://M-Lint:MLint&2022@cluster0.stow59u.mongodb.net/test
// const DB = "mongodb+srv://mlint:Mongodb2022@cluster0.oaxg0.mongodb.net/test";
const DB =
  "mongodb+srv://M-Lint:MLint&2022@cluster0.stow59u.mongodb.net/?retryWrites=true&w=majority";
// const DB = "mongodb://127.0.0.1:27017";

mongoose
  .connect(DB, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("DB successfully connected!");
  })
  .catch((err) => {
    console.log(err);
  });
