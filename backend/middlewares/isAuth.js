const jwt = require("jsonwebtoken");

const JWT_SECRET = process.env.JWT_SECRET || "moneyWiseKey";

const isAuthenticated = async (req, res, next) => {
  // get token from authorization header
  const token = req.headers?.authorization?.split(" ")[1];
  if (!token) {
    res.status(401);
    return next(new Error("Missing token, login required"));
  }

  try {
    // verify token and attach user id to request
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded.id;
    return next();
  } catch (error) {
    res.status(401);
    return next(new Error("Token invalid or expired, login again"));
  }
};

module.exports = isAuthenticated;
