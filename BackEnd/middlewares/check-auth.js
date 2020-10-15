const jwt = require("jsonwebtoken");

module.exports = (req, res, next) => {
  try {
    // console.log("TOKEN:", req.headers.authorization);
    const token = req.headers.authorization.split(" ")[1];
    // console.log("TOKEN after split:", token);
    const decodedToken = jwt.verify(token, process.env.JWT_SECRET_KEY);
    console.log("TOKEN VERIFY RESULT:", decodedToken);
    req.userData = { email: decodedToken.email, userId: decodedToken._id };
    next();
  } catch {
    res.status(401).json({
      message: "Auth Failed, Invalid token!",
    });
  }
};
