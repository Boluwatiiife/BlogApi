const mongoose = require("mongoose");
require("dotenv").config();
const node_env = process.env.node_env;

const mongoDB_url = process.env.mongoDB_url;

const connect_to_mongoDB = function () {
  if (node_env !== "test") {
    mongoose.connect(mongoDB_url);

    mongoose.connection.on("connected", () => {
      console.log("mongoDB connected successfully!");
    });

    mongoose.connection.on("error", (err) => {
      console.log("error, could not connect to mongoDB");
      return err;
    });
  } else return "could not connect to db";
};

module.exports = { connect_to_mongoDB };
