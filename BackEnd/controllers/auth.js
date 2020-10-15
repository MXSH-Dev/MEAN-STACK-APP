const User = require("../Models/user");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

exports.createUser = (req, res, next) => {
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
          console.log(result);
          res.status(201).json({
            message: "user created",
            result: result,
          });
        })
        .catch((err) => {
          res.status(500).json({
            message: "Invalid authentication credentials!",
            detail: err,
          });
        });
    })
    .catch((err) => {
      console.log(err);
    });
};

exports.userLogin = (req, res, next) => {
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
        process.env.JWT_SECRET_KEY,
        { expiresIn: "1h" }
      );

      return res.status(200).json({
        message: "Login success!",
        token: token,
        expiresIn: 3600,
        userId: fetchedUser._id,
      });
    })
    .catch((err) => {
      console.log(err);
      return res.status(401).json({
        message: "Auth failed, no such user!",
      });
    });
};
