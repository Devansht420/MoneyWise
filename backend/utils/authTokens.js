const jwt = require("jsonwebtoken");

const ACCESS_EXPIRES = process.env.JWT_ACCESS_EXPIRES || "24h";
const REFRESH_EXPIRES = process.env.JWT_REFRESH_EXPIRES || "7d";

// short-lived token for api calls
function signAccessToken(userId, secret) {
  return jwt.sign({ id: userId, tokenType: "access" }, secret, {
    expiresIn: ACCESS_EXPIRES,
  });
}

// long-lived token used only to mint new access tokens
function signRefreshToken(userId, secret) {
  return jwt.sign({ id: userId, tokenType: "refresh" }, secret, {
    expiresIn: REFRESH_EXPIRES,
  });
}

module.exports = {
  signAccessToken,
  signRefreshToken,
  ACCESS_EXPIRES,
  REFRESH_EXPIRES,
};
