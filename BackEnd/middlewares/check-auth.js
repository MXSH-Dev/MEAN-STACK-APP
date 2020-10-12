const jwt = require("jsonwebtoken");

module.exports = (req, res, next) => {
  try {
    // console.log("TOKEN:", req.headers.authorization);
    const token = req.headers.authorization.split(" ")[1];
    // console.log("TOKEN after split:", token);
    const result = jwt.verify(token, "secret_this_should_be_longer");
    // console.log("TOKEN VERIFY RESULT:", result);
    next();
  } catch {
    res.status(401).json({
      message: "Auth Failed",
    });
  }
};
