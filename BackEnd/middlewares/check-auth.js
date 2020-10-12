const jwt = require("jsonwebtoken");

module.exports = (req, res, next) => {
  try {
    // console.log("TOKEN:", req.headers.authorization);
    const token = req.headers.authorization.split(" ")[1];
    // console.log("TOKEN after split:", token);
    const decodedToken = jwt.verify(token, "secret_this_should_be_longer");
    console.log("TOKEN VERIFY RESULT:", decodedToken);
    req.userData = { email: decodedToken.email, userId: decodedToken._id };
    next();
  } catch {
    res.status(401).json({
      message: "Auth Failed",
    });
  }
};
