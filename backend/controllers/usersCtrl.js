const asyncHandler = require("express-async-handler");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../model/User");
const {
  signAccessToken,
  signRefreshToken,
} = require("../utils/authTokens");

const JWT_SECRET = process.env.JWT_SECRET || "moneyWiseKey";
// optional separate secret so refresh tokens cannot be verified as access
const JWT_REFRESH_SECRET =
  process.env.JWT_REFRESH_SECRET || JWT_SECRET;

const usersController = {
  // register a new user
  register: asyncHandler(async (req, res) => {
    const { username, email, password } = req.body;

    // validate required fields
    if (!username || !email || !password) {
      res.status(400);
      throw new Error("Please provide username, email, and password");
    }

    // check if user already exists
    const userExists = await User.findOne({ email });
    if (userExists) {
      res.status(400);
      throw new Error("User already exists");
    }

    // hash password before saving
    const salt = await bcrypt.genSalt(12);
    const hashedPassword = await bcrypt.hash(password, salt);

    const userCreated = await User.create({
      email,
      username,
      password: hashedPassword,
    });

    res.status(201).json({
      username: userCreated.username,
      email: userCreated.email,
      id: userCreated._id,
    });
  }),

  // login existing user
  login: asyncHandler(async (req, res) => {
    const { email, password } = req.body;

    // find user by email
    const user = await User.findOne({ email });
    if (!user) {
      res.status(401);
      throw new Error("Invalid login credentials");
    }

    // compare plaintext with hashed password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      res.status(401);
      throw new Error("Invalid login credentials");
    }

    // issue access (24h by default) and refresh (7d by default) tokens
    const accessToken = signAccessToken(user._id, JWT_SECRET);
    const refreshToken = signRefreshToken(user._id, JWT_REFRESH_SECRET);

    res.json({
      message: "Login success",
      accessToken,
      refreshToken,
      id: user._id,
      email: user.email,
      username: user.username,
    });
  }),

  // exchange refresh token for a new access token
  refreshAccessToken: asyncHandler(async (req, res) => {
    const { refreshToken } = req.body;
    if (!refreshToken) {
      res.status(400);
      throw new Error("Refresh token is required");
    }

    let decoded;
    try {
      decoded = jwt.verify(refreshToken, JWT_REFRESH_SECRET);
    } catch (e) {
      res.status(401);
      throw new Error("Invalid or expired refresh token");
    }

    if (decoded.tokenType !== "refresh") {
      res.status(401);
      throw new Error("Invalid refresh token");
    }

    const accessToken = signAccessToken(decoded.id, JWT_SECRET);
    res.json({ accessToken });
  }),

  // get current user profile
  profile: asyncHandler(async (req, res) => {
    const user = await User.findById(req.user);
    if (!user) {
      res.status(404);
      throw new Error("User not found");
    }

    res.json({ username: user.username, email: user.email });
  }),

  // change current user password
  changeUserPassword: asyncHandler(async (req, res) => {
    const { newPassword } = req.body;
    if (!newPassword) {
      res.status(400);
      throw new Error("New password is required");
    }

    const user = await User.findById(req.user);
    if (!user) {
      res.status(404);
      throw new Error("User not found");
    }

    // hash new password before saving
    const salt = await bcrypt.genSalt(12);
    const hashedPassword = await bcrypt.hash(newPassword, salt);
    user.password = hashedPassword;

    await user.save({
      validateBeforeSave: false,
    });

    res.json({ message: "Password changed successfully" });
  }),

  // update current user profile
  updateUserProfile: asyncHandler(async (req, res) => {
    const { email, username } = req.body;

    const updatedUser = await User.findByIdAndUpdate(
      req.user,
      {
        username,
        email,
      },
      {
        new: true,
      }
    );

    if (!updatedUser) {
      res.status(404);
      throw new Error("User not found");
    }

    res.json({ message: "User profile updated successfully", updatedUser });
  }),
};

module.exports = usersController;
