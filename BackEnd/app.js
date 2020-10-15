const path = require("path");
const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const fs = require("fs");

const envVars = require("dotenv").config();
if (envVars.error) {
  throw envVars.error;
}

const postsRoutes = require("./routes/posts");
const authRoutes = require("./routes/auth");

const app = express();

// console.log(envVars.parsed);

// create mongodb cloud cluster using mongodb atlas
// create .env file with following @params:
// MONGODB_URI_PRE = "mongodb+srv://"
// MONGODB_USER = <USER NAME>
// MONGODB_PASSWORD <PASSWORD>
// MONGODB_URI_POST = "@mean-cluster.qyd3m.mongodb.net/mean-stack?retryWrites=true&w=majority"
// IT is ok to expose username and password since only certain IP is added to IP while list

const MONGODB_URI =
  process.env.MONGODB_URI_PRE +
  process.env.MONGODB_USER +
  ":" +
  process.env.MONGODB_PASSWORD +
  process.env.MONGODB_URI_POST;

// console.log(MONGODB_URI);

mongoose
  .connect(MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log("Connected to mongodb");
  })
  .catch((err) => {
    console.log(err);
  });

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

const IMAGE_PATH = "images";
if (!fs.existsSync(IMAGE_PATH)) {
  fs.mkdirSync(IMAGE_PATH);
}

app.use("/images", express.static(path.join(__dirname, IMAGE_PATH)));
app.use("/", express.static(path.join(__dirname, "dist/FrontEnd")));

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Origin,X-Requested-With,Content-Type,Accept, Authorization"
  );
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET,POST,PATCH,DELETE,PUT,OPTIONS"
  );
  next();
});

app.use("/api/posts", postsRoutes);
app.use("/api/auth", authRoutes);
// app.use("/", (req, res, next) => {
//   res.sendFile(path.join(__dirname, "dist/FrontEnd", "index.html"));
// });

module.exports = app;
