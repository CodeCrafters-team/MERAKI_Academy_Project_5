 const jwt = require("jsonwebtoken");

const authentication = (req, res, next) => {
  try {
    if (!req.headers.authorization) {
      return res.status(403).json({
        success: false,
        message: "No authorization header provided",
      });
    }

    const authHeader = req.headers.authorization;
    if (!authHeader.startsWith("Bearer ")) {
      return res.status(403).json({
        success: false,
        message: "Invalid authorization format. Use 'Bearer <token>'",
      });
    }

    const token = authHeader.split(" ")[1];
    if (!token) {
      return res.status(403).json({
        success: false,
        message: "No token provided",
      });
    }


    const verify = jwt.verify(token, process.env.SECRET || "MERAKI");
    req.token = verify;
    next();
  } catch (error) {
    return res.status(403).json({
      success: false,
      message: "The token is invalid or expired",
      error: error.message,
    });
  }
};

module.exports = authentication;
