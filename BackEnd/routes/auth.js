const express = require("express");
const router = express.Router();
const User = require("../Models/user");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const user = require("../Models/user");

router.post("/register", (req, res, next) => {
  let newUser = null;
  bcrypt
    .hash(req.body.password, 10)
    .then((hashedPassword) => {
      newUser = new User({
        email: req.body.email,
        username: req.body.username,
        password: hashedPassword,
      });

      newUser
        .save()
        .then((result) => {
          res.status(201).json({
            message: "user created",
            result: result,
          });
        })
        .catch((err) => {
          res.status(500).json({
            message: err,
          });
        });
    })
    .catch((err) => {
      console.log(err);
    });
});

router.post("/login", (req, res, next) => {
  let fetchedUser;
  User.findOne({ email: req.body.email })
    .then((user) => {
      if (!user) {
        return res.status(401).json({
          message: "Auth failed, no such user!",
        });
      }
      fetchedUser = user;
      return bcrypt.compare(req.body.password, user.password);
    })
    .then((result) => {
      if (!result) {
        return res.status(401).json({
          message: "Auth failed, password incorrect!",
        });
      }

      // console.log(fetchedUser._id, fetchedUser.username);

      const token = jwt.sign(
        {
          _id: fetchedUser._id,
          email: fetchedUser.email,
          username: fetchedUser.username,
        },
        "secret_this_should_be_longer",
        { expiresIn: "1h" }
      );

      return res.status(200).json({
        message: "Login success!",
        token: token,
        expiresIn: 3600,
      });
    })
    .catch((err) => {
      console.log(err);
      return res.status(401).json({
        message: "Auth failed, no such user!",
      });
    });
});
module.exports = router;
